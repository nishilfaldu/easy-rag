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
import { HfInference } from "@huggingface/inference";

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
      // organization: process.env.OPENAI_ORGANIZATION,
      // project: process.env.OPENAI_PROJECT_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    const { data } = await openai.embeddings.create({
      input: texts,
      model: EMBEDDINGS_MODEL,
    });
    return data.map(({ embedding }) => embedding);
  } else if (
    EMBEDDINGS_MODEL === "all-MiniLM-L6-v2" ||
    EMBEDDINGS_MODEL === "all-MiniLM-L12-v2" ||
    EMBEDDINGS_MODEL === "nli-roberta-base-v2" ||
    EMBEDDINGS_MODEL === "all-mpnet-base-v2" ||
    EMBEDDINGS_MODEL === "all-distilroberta-v1" ||
    EMBEDDINGS_MODEL === "gtr-t5-base" ||
    EMBEDDINGS_MODEL === "sentence-t5-large"
  ) {
    const inference = new HfInference(process.env.HUGGINGFACEHUB_API_KEY);

    const embeddings = await inference.featureExtraction({
      model: `sentence-transformers/${EMBEDDINGS_MODEL}`,
      inputs: texts,
    });

    return embeddings as number[][];
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

    embeddings.map(async (embedding, i) => {
      const chunk = chunks[i];
      if (chunk) {
        await runMutation(internal.ingest.embed.addEmbedding, {
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

// helper internal mutations for database operations
export const storedbdocument = internalMutation({
  args: {
    botId: v.id("bots"),
    document: v.string(),
    url: v.string(),
  },
  handler: async ({ db }, { botId, document, url }) => {
    return await db.insert("documents", {
      botId: botId,
      text: document,
      url,
    });
  },
});

export const storechunk = internalMutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
  },
  handler: async ({ db }, { documentId, text }) => {
    const chunkId = await db.insert("chunks", {
      documentId,
      text,
      embeddingId: null,
    });

    return chunkId;
  },
});

export const storeembedding = internalMutation({
  args: {
    chunkId: v.id("chunks"),
    embedding: v.array(v.number()),
  },
  handler: async ({ db }, { chunkId, embedding }) => {
    const embeddingId = await db.insert("embeddings", {
      chunkId,
      embedding,
    });

    await db.patch(chunkId, { embeddingId });
  },
});

// util to remove nulls
function removeNulls<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined);
}
