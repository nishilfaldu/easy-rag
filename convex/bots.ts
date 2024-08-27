import { v } from "convex/values";
import { mutation, query } from "./functions";
import { getManyFrom } from "convex-helpers/server/relationships";
import { completionModelsField, embeddingModelsField } from "./schema";

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
    { db, user },
    { name, embeddingModel, completionModel, fileUrls }
  ) => {
    const botId = await db.insert("bots", {
      name,
      embeddingModel,
      completionModel,
      userId: user._id,
      progress: "loading",
    });

    for (const fileUrl of fileUrls) {
      await db.insert("documents", {
        botId: botId,
        url: fileUrl,
        text: "sample text for a sample file",
      });
    }

    return botId;
  },
});
