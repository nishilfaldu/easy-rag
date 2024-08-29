"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { pdfToText } from "pdf-ts";
import mammoth from "mammoth";
import { Pool } from "pg";
import fs from "fs";

export const files = internalAction({
  args: {
    fileUrls: v.array(v.string()),
    botId: v.id("bots"),
  },
  handler: async (ctx, { fileUrls, botId }) => {
    // Define accepted content types
    const acceptedContentTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/markdown",
      "text/csv",
      "application/vnd.ms-excel",
    ];

    // update bot status to splitting
    await ctx.runMutation(internal.bots.updateBotStatus, {
      botId,
      status: "splitting",
    });

    // Iterate over each file URL
    for (const url of fileUrls) {
      try {
        const response = await fetch(url);
        const contentType = response.headers.get("content-type")!;

        if (acceptedContentTypes.some((type) => contentType.includes(type))) {
          // Process the file based on its type
          await ctx.runAction(internal.ingest.load.fetchSingle, { url });
        } else {
          console.error(
            `File type ${contentType} is not supported for URL: ${url}`
          );
        }
      } catch (error) {
        console.error(`Error fetching or processing file at ${url}:`, error);
      }
    }
  },
});

export const fetchSingle = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type")!;

      let text = "";
      console.log(contentType);

      if (contentType.includes("application/pdf")) {
        text = await processPdf(response);
      } else if (
        contentType.includes("text") ||
        contentType.includes("text/markdown")
      ) {
        text = await response.text();
      } else if (
        contentType.includes("application/msword") ||
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
      ) {
        text = await processDoc(response);
      }
      //  else if (fileType === ".csv") {
      //     text = await processCsv(response);
      //   }

      if (text.length > 0) {
        await ctx.runMutation(internal.documents.updateDocument, {
          url,
          text,
        });
      }
    } catch (error) {
      console.error(`Failed to process the file at ${url}:`, error);
    }
  },
});

// helpers
async function processPdf(response: Response): Promise<string> {
  const arrayBuffer = await response.arrayBuffer();
  const pdfBuffer = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array
  const text = await pdfToText(pdfBuffer); // Pass the Uint8Array to pdfToText
  // Assuming the structure of the returned text allows direct access to lines
  return text;
}

async function processDoc(response: Response): Promise<string> {
  try {
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

    const result = await mammoth.extractRawText({ buffer });
    const text = result.value; // Extracted text from the document
    return text;
  } catch (error) {
    console.error("Error processing the DOC/DOCX file with mammoth:", error);
    throw new Error("Failed to process DOC/DOCX file");
  }
}

// async function processCsv(response: Response): Promise<string> {
//   const text = await response.text();
//   return new Promise((resolve, reject) => {
//     parse(text, {}, (err, output) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(output.map((row) => row.join(",")).join("\n"));
//       }
//     });
//   });
// }

// database loading
export const postgresdb = internalAction({
  args: {
    dbUrl: v.string(),
    tables: v.array(
      v.object({
        tableName: v.string(),
        columns: v.array(v.string()),
      })
    ),
    botId: v.id("bots"),
  },
  handler: async (ctx, { dbUrl, tables, botId }) => {
    // Step 1: Update bot status to fetching
    await ctx.runMutation(internal.bots.updateBotStatus, {
      botId,
      status: "loading",
    });

    // Step 2: Initialize PostgreSQL connection pool
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.CA_CERT_PATH
        ? {
            // ca: fs.readFileSync(process.env.CA_CERT_PATH).toString(),
            ca: process.env.CA_CERT,
            rejectUnauthorized: false,
          }
        : false, // Disable SSL if CA_CERT_PATH is not provided
    });

    const client = await pool.connect();
    try {
      // Step 3: Iterate over each table and fetch the data
      for (const table of tables) {
        const { tableName, columns } = table;

        const columnList = columns.join(", ");
        const query = `SELECT ${columnList} FROM ${tableName}`;

        const res = await client.query(query);

        console.log(res);

        for (const row of res.rows) {
          // Step 4: Concatenate all column values into a single chunk
          const chunk = Object.values(row)
            .filter((value) => value !== null)
            .join(" ");

          // Step 5: Generate embedding for the concatenated chunk
          // const embedding = await generateEmbedding(chunk);

          // Step 6: Insert the chunk and its embedding into the text_chunks table
          // await ctx.runMutation(internal.ingest.load.storeChunk, {
          //   documentId: botId, // Assuming botId is used as documentId
          //   chunk,
          //   embedding,
          // });
        }
      }

      // Step 7: Update bot status to processing
      // await ctx.runMutation(internal.bots.updateBotStatus, {
      //   botId,
      //   status: "processing",
      // });
    } catch (error) {
      console.error("Error processing database:", error, error.message);
      await ctx.runMutation(internal.bots.updateBotStatus, {
        botId,
        status: "error",
      });
    } finally {
      client.release(); // Ensure the client is released back to the pool
    }
  },
});
