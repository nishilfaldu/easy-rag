import { getManyFrom } from "convex-helpers/server/relationships";
import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { embedTexts } from "./ingest/embed";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const answer = internalAction({
  args: {
    botId: v.id("bots"),
  },
  handler: async ({ runQuery, vectorSearch, runMutation }, { botId }) => {
    const { OPENAI_MODEL, EMBEDDINGS_MODEL } = await runQuery(
      internal.serve.getModel,
      {
        botId,
      }
    );

    const messages = await runQuery(internal.serve.getMessages, {
      botId,
    });

    const lastUserMessage = messages.at(-1)!.text;

    const [embedding] = await embedTexts([lastUserMessage], EMBEDDINGS_MODEL);

    const searchResults = await vectorSearch("embeddings", "byEmbedding", {
      vector: embedding,
      limit: 8,
    });

    const relevantDocuments = await runQuery(internal.serve.getChunks, {
      embeddingIds: searchResults.map(({ _id }) => _id),
    });

    const messageId = await runMutation(internal.serve.addBotMessage, {
      botId,
    });

    try {
      const openai = new OpenAI();
      const stream = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Answer the user question based on the provided documents " +
              "or report that the question cannot be answered based on " +
              "these documents. Keep the answer informative but brief, " +
              "do not enumerate all possibilities.",
          },
          ...(relevantDocuments.map(({ text }) => ({
            role: "system",
            content: "Relevant document:\n\n" + text,
          })) as ChatCompletionMessageParam[]),
          ...(messages.map(({ isViewer, text }) => ({
            role: isViewer ? "user" : "assistant",
            content: text,
          })) as ChatCompletionMessageParam[]),
        ],
        stream: true,
      });

      let text = "";
      for await (const { choices } of stream) {
        const replyDelta = choices[0].delta.content;
        if (typeof replyDelta === "string" && replyDelta.length > 0) {
          text += replyDelta;
          await runMutation(internal.serve.updateBotMessage, {
            messageId,
            text,
          });
        }
      }
    } catch (error: any) {
      await runMutation(internal.serve.updateBotMessage, {
        messageId,
        text: "I cannot reply at this time. Reach out to us on our customer service helpline.",
      });
      throw error;
    }
  },
});

export const getMessages = internalQuery({
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

export const getChunks = internalQuery({
  args: {
    embeddingIds: v.array(v.id("embeddings")),
  },
  handler: async ({ db }, { embeddingIds }) => {
    const embeddings = Promise.all(
      embeddingIds.map(async (embeddingId) => {
        const embedding = (await db
          .query("chunks")
          .withIndex("byEmbeddingId", (q) => q.eq("embeddingId", embeddingId))
          .unique())!;

        return embedding;
      })
    );

    return embeddings;
  },
});

export const addBotMessage = internalMutation({
  args: {
    botId: v.id("bots"),
  },
  handler: async ({ db }, { botId }) => {
    const message = await db.insert("messages", {
      isViewer: false,
      text: "",
      botId: botId,
    });

    return message;
  },
});

export const updateBotMessage = internalMutation({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
  },
  handler: async ({ db }, { messageId, text }) => {
    await db.patch(messageId, { text });
  },
});

export const getModel = internalQuery({
  args: {
    botId: v.id("bots"),
  },
  handler: async ({ db }, { botId }) => {
    const bot = await db.get(botId);
    if (!bot) {
      throw new ConvexError("Bot not found when looking for a model.");
    }
    return {
      OPENAI_MODEL: bot.completionModel,
      EMBEDDINGS_MODEL: bot.embeddingModel,
    };
  },
});