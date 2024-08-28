import OpenAI from "openai";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { v } from "convex/values";
import { getAll } from "convex-helpers/server/relationships";
import { internal } from "../_generated/api";
import { embeddingModelsField } from "../schema";
import { pipeline } from "@xenova/transformers";

export async function embedTexts(
  texts: string[],
  // TODO: this needs better type
  EMBEDDINGS_MODEL: string
) {
  if (texts.length === 0) return [];

  if (
    EMBEDDINGS_MODEL === "text-embedding-3-large" ||
    EMBEDDINGS_MODEL === "text-embedding-3-small" ||
    EMBEDDINGS_MODEL === "text-embedding-ada-002"
  ) {
    const openai = new OpenAI({
      organization: process.env.OPENAI_ORGANIZATION,
      project: process.env.OPENAI_PROJECT_ID,
    });
    const { data } = await openai.embeddings.create({
      input: texts,
      model: EMBEDDINGS_MODEL,
    });
    return data.map(({ embedding }) => embedding);
  } else if (EMBEDDINGS_MODEL === "all-MiniLM-L6-v2") {
    // Load the feature-extraction pipeline
    const pipe = await pipeline(
      "feature-extraction",
      `Xenova/${EMBEDDINGS_MODEL}`,
      {
        quantized: false,
      }
    );

    // Perform feature extraction for the texts
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const result = await pipe(text, {
          pooling: "mean",
          normalize: true,
        });
        // The result is a nested array where the outer array corresponds to the sequence
        // and the inner array corresponds to the embedding dimensions.
        // Typically, you might want to average these embeddings across the sequence.
        const embedding = result.data as number[]; // Assume result[0] for simplicity
        return embedding;
      })
    );

    return embeddings;
  } else {
    // TODO: use transformers library here - add other options here
    return [[]];
  }
}

export const chunksNeedingEmbedding = internalQuery({
  args: {
    chunkIds: v.array(v.id("chunks")),
  },
  handler: async ({ db }, { chunkIds }) => {
    const chunks = await getAll(db, chunkIds);
    const filteredChunks = removeNulls(chunks);
    return filteredChunks;
  },
});

export const embedChunks = internalAction({
  args: {
    chunkIds: v.array(v.id("chunks")),
    embeddingModel: embeddingModelsField,
    botId: v.id("bots"),
  },
  handler: async (
    { runQuery, runMutation },
    { chunkIds, embeddingModel, botId }
  ) => {
    // update bot status to embedding
    await runMutation(internal.bots.updateBotStatus, {
      botId,
      status: "embedding",
    });
    const chunks = await runQuery(
      internal.ingest.embed.chunksNeedingEmbedding,
      {
        chunkIds,
      }
    );

    const embeddings = await embedTexts(
      chunks.map((chunk) => chunk.text),
      embeddingModel
    );

    embeddings.map((embedding, i) => {
      const chunk = chunks[i];
      if (chunk) {
        runMutation(internal.ingest.embed.addEmbedding, {
          chunkId: chunk._id,
          embedding,
        });
      }
    });

    // update status to deployed
    await runMutation(internal.bots.updateBotStatus, {
      botId,
      status: "deployed",
    });
  },
});

export const addEmbedding = internalMutation({
  args: {
    chunkId: v.id("chunks"),
    embedding: v.array(v.number()),
  },
  handler: async ({ db }, { chunkId, embedding }) => {
    const embeddingId = await db.insert("embeddings", {
      embedding,
      chunkId,
    });
    await db.patch(chunkId, { embeddingId });
  },
});

// util to remove nulls
function removeNulls<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined);
}
