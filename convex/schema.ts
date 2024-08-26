import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    description: v.string(),
    avatar: v.string(),
    greeting: v.string(),
    embeddingModel: v.union(
      v.literal("bert-base-uncased"),
      v.literal("distilbert-base-uncased"),
      v.literal("roberta-base"),
      v.literal("microsoft/MiniLM-L12-H384-uncased"),
      v.literal("distilroberta-base"),
      v.literal("gpt2"),
      v.literal("google/electra-small-discriminator"),
      v.literal("albert-base-v2"),
      v.literal("t5-small"),
      v.literal("xlm-roberta-base"),
      v.literal("text-embedding-3-large"),
      v.literal("text-embedding-3-small"),
      v.literal("text-embedding-ada-002")
    ),
    completionModel: v.union(
      v.literal("gpt-4o"),
      v.literal("gpt-4o-mini"),
      v.literal("gpt-4-turbo"),
      v.literal("gpt-3.5-turbo")
    ),
    progress: v.union(
      v.literal("loading"),
      v.literal("splitting"),
      v.literal("embedding"),
      v.literal("deployed"),
      v.literal("error")
    ),
    // relation
    userId: v.id("users"),
  }),

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
    // TODO: if there's a third service that handles this, we don't need this field
    text: v.string(),
    columns: v.array(v.string()),
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
