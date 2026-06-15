import { v } from "convex/values";
import { mutation, publicMutation, publicQuery } from "./functions";
import { getManyFrom } from "convex-helpers/server/relationships";
import { internal } from "./_generated/api";

// Public: the embedded widget reads its conversation without a session.
export const list = publicQuery({
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

// Public: visitors on a customer's site post questions to the embedded widget.
export const send = publicMutation({
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
