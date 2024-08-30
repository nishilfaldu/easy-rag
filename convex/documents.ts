import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { internal } from "./_generated/api";

export const updateDocument = internalMutation({
  args: {
    url: v.string(),
    text: v.string(),
  },
  handler: async ({ db, scheduler }, { url, text }) => {
    const latestVersion = await db
      .query("documents")
      .withIndex("byUrl", (q) => q.eq("url", url))
      .order("desc")
      .first();

    if (!latestVersion) {
      throw new ConvexError("Bot with this id does not exist.");
    }

    const hasChanged = latestVersion === null || latestVersion.text !== text;
    if (hasChanged) {
      await db.patch(latestVersion._id, {
        text,
      });
      const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
        chunkSize: 2000,
        chunkOverlap: 100,
      });
      const chunks = await splitter.splitText(text);
      const chunkIds = await Promise.all(
        chunks.map(async (chunk) => {
          const chunkId = await db.insert("chunks", {
            documentId: latestVersion._id,
            text: chunk,
            embeddingId: null,
          });

          return chunkId;
        })
      );

      const bot = await db.get(latestVersion.botId);
      if (!bot) {
        throw new ConvexError("bot not found.");
      }

      await scheduler.runAfter(0, internal.ingest.embed.embedChunks, {
        chunkIds,
        embeddingModel: bot.embeddingModel,
        botId: bot._id,
      });
    }
  },
});
