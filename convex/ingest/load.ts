"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { pdfToText } from "pdf-ts";
import mammoth from "mammoth";

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
  console.log(text);
  // Assuming the structure of the returned text allows direct access to lines
  return text;
}

async function processDoc(response: Response): Promise<string> {
  try {
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

    const result = await mammoth.extractRawText({ buffer });
    const text = result.value; // Extracted text from the document
    console.log(text);
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
