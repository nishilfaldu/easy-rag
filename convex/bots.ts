import { ConvexError, v } from "convex/values";
import { mutation, query } from "./functions";
import { getManyFrom } from "convex-helpers/server/relationships";
import { completionModelsField, embeddingModelsField } from "./schema";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async ({ db, user }, {}) => {
    const bots = getManyFrom(db, "bots", "byUserId", user._id, "userId");

    return bots;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    embeddingModel: embeddingModelsField,
    completionModel: completionModelsField,
    fileUrls: v.array(v.string()),
  },
  handler: async (
    { db, user, scheduler },
    { name, embeddingModel, completionModel, fileUrls }
  ) => {
    const botId = await db.insert("bots", {
      name,
      embeddingModel,
      completionModel,
      userId: user._id,
      progress: "loading",
      isDb: false,
    });

    for (const fileUrl of fileUrls) {
      await db.insert("documents", {
        botId: botId,
        url: fileUrl,
        text: "",
      });
    }

    await scheduler.runAfter(0, internal.ingest.load.files, {
      fileUrls,
      botId,
    });

    return botId;
  },
});

export const remove = mutation({
  args: { botId: v.id("bots") },
  handler: async ({ db, user }, { botId }) => {
    const bot = await db.get(botId);

    if (!bot) {
      throw new ConvexError("The bot you're trying to remove doesn't exist.");
    }

    if (bot.userId !== user._id) {
      throw new Error("You don't have permission to remove this bot");
    }

    db.delete(botId);
  },
});

export const getBotById = query({
  args: { botId: v.id("bots") },
  handler: async ({ db }, { botId }) => {
    const bot = await db.get(botId);

    if (!bot) {
      throw new ConvexError("The bot you're trying to get doesn't exist.");
    }

    if (!bot.isDb) {
      // get documents
      const documents = await getManyFrom(
        db,
        "documents",
        "byBotId",
        botId,
        "botId"
      );
      return {
        ...bot,
        documents,
      };
    }

    return bot;
  },
});

export const addWithDb = mutation({
  args: {
    name: v.string(),
    embeddingModel: embeddingModelsField,
    completionModel: completionModelsField,
    dbUrl: v.string(),
    dbType: v.union(v.literal("postgresql"), v.literal("mysql")),
    tables: v.array(
      v.object({
        tableName: v.string(),
        columns: v.array(v.string()),
      })
    ),
  },
  handler: async (
    { db, user, scheduler },
    { name, embeddingModel, completionModel, dbType, dbUrl, tables }
  ) => {
    const botId = await db.insert("bots", {
      name,
      embeddingModel,
      completionModel,
      userId: user._id,
      progress: "loading",
      isDb: true,
    });

    await db.insert("database", {
      botId: botId,
      tables,
      type: dbType,
      url: dbUrl,
    });

    if ((dbType = "postgresql")) {
      await scheduler.runAfter(0, internal.ingest.load.postgresdb, {
        dbUrl,
        tables,
        botId,
        embeddingModel,
      });
    } else if (dbType === "mysql") {
      await scheduler.runAfter(0, internal.ingest.load.mysqldb, {
        dbUrl,
        tables,
        botId,
        embeddingModel,
      });
    }

    return botId;
  },
});

// internal mutation for update bot status
export const updateBotStatus = internalMutation({
  args: {
    botId: v.id("bots"),
    status: v.union(
      v.literal("loading"),
      v.literal("splitting"),
      v.literal("embedding"),
      v.literal("deployed"),
      v.literal("error")
    ),
  },
  handler: async ({ db }, { botId, status }) => {
    await db.patch(botId, { progress: status });
  },
});
