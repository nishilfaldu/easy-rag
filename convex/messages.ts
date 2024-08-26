import { v } from "convex/values";
import { mutation, query } from "./functions";
import { getManyFrom } from "convex-helpers/server/relationships";
import { internal } from "./_generated/api";

export const list = query({
  args: {
    botId: v.id("bots"),
  },
  handler: async ({ db }, { botId }) => {
    const messages = await getManyFrom(
      db,
      "messages",
      "byBotId",
      botId,
      "botId"
    );

    return messages;
  },
});

export const send = mutation({
  args: {
    botId: v.id("bots"),
    isViewer: v.boolean(),
    text: v.string(),
  },
  handler: async ({ db, scheduler }, { botId, isViewer, text }) => {
    await db.insert("messages", {
      botId,
      isViewer,
      text,
    });

    await scheduler.runAfter(0, internal.serve.answer, {
      botId,
    });
  },
});

export const clear = mutation({
  args: {
    botId: v.id("bots"),
  },
  handler: async ({ db }, { botId }) => {
    const messages = await getManyFrom(
      db,
      "messages",
      "byBotId",
      botId,
      "botId"
    );

    await Promise.all(messages.map((message) => db.delete(message._id)));
  },
});
