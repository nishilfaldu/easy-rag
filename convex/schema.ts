import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const embeddingModelsField = v.union(
  v.literal("text-embedding-3-large"),
  v.literal("text-embedding-3-small"),
  v.literal("text-embedding-ada-002"),
  v.literal("all-MiniLM-L6-v2"),
  v.literal("all-MiniLM-L12-v2"),
  v.literal("nli-roberta-base-v2"),
  v.literal("all-mpnet-base-v2"),
  v.literal("all-distilroberta-v1"),
  v.literal("gtr-t5-base"),
  v.literal("sentence-t5-large")
);

export const completionModelsField = v.union(
  // gpts
  v.literal("gpt-4o"),
  v.literal("gpt-4o-mini"),
  v.literal("gpt-4-turbo"),
  v.literal("gpt-3.5-turbo"),
  // anthropic
  v.literal("claude-3-5-sonnet-20240620"),
  v.literal("claude-3-opus-20240229"),
  v.literal("claude-3-sonnet-20240229"),
  v.literal("claude-3-haiku-20240307")
);

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phoneNumber: v.string(),

    imageUrl: v.string(),
  })
    .index("byUsername", ["username"])
    .index("byClerkId", ["clerkId"]),
  // bot
  bots: defineTable({
    name: v.string(),
    // description: v.string(),
    // avatar: v.string(),
    // greeting: v.string(),
    embeddingModel: embeddingModelsField,
    completionModel: completionModelsField,
    progress: v.union(
      v.literal("loading"),
      v.literal("splitting"),
      v.literal("embedding"),
      v.literal("deployed"),
      v.literal("error")
    ),

    userId: v.id("users"),
  }).index("byUserId", ["userId"]),

  messages: defineTable({
    botId: v.id("bots"),
    // Whether the message is from the AI (true if it's from the viewer/human)
    isViewer: v.boolean(),
    text: v.string(),
  }).index("byBotId", ["botId"]),

  documents: defineTable({
    // The original page URL for the document if a site is being parsed or s3 url for uploaded files
    url: v.string(),
    // The parsed document content
    botId: v.id("bots"),
    text: v.string(),
  }).index("byUrl", ["url"]),

  database: defineTable({
    url: v.string(),
    tables: v.array(
      v.object({
        tableName: v.string(),
        columns: v.array(v.string()),
      })
    ),
    // TODO: if there's a third service that handles this, we don't need this field
    // text: v.string(),
    type: v.union(v.literal("postgresql"), v.literal("mysql")),
    botId: v.id("bots"),
  }),

  chunks: defineTable({
    // Which document this chunk belongs to
    documentId: v.id("documents"),
    // The chunk content
    text: v.string(),
    // If the chunk has been embedded, which embedding corresponds to it
    embeddingId: v.union(v.id("embeddings"), v.null()),
  })
    .index("byDocumentId", ["documentId"])
    .index("byEmbeddingId", ["embeddingId"]),

  // the actual embeddings
  embeddings: defineTable({
    embedding: v.array(v.number()),
    chunkId: v.id("chunks"),
  })
    .index("byChunkId", ["chunkId"])
    .vectorIndex("byEmbedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),
});
