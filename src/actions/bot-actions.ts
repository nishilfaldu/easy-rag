"use server";

import { WithoutSystemFields } from "convex/server";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { ConvexError } from "convex/values";

export async function addBot(
  bot: Omit<WithoutSystemFields<Doc<"bots">>, "progress" | "userId">,
  fileKeys: string[]
) {
  const token = await getAuthToken();

  const fileUrls = fileKeys.map(
    (fileKey) => `${process.env.S3_BUCKET_URL}${fileKey}`
  );

  try {
    const botId = await fetchMutation(
      api.bots.add,
      {
        completionModel: bot.completionModel,
        embeddingModel: bot.embeddingModel,
        name: bot.name,
        fileUrls,
      },
      { token }
    );

    return {
      success: true,
      message: "Bot created successfully",
      result: botId,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let errorMessage = error.message || "Unexpected error occurred";
    if (
      error instanceof ConvexError &&
      error.data &&
      typeof error.data === "string"
    ) {
      errorMessage = error.data;
    }

    console.error("Error creating a bot:", error);

    return {
      success: false,
      message: errorMessage,
      result: undefined,
    };
  }
}

export async function deleteBot(botId: Id<"bots">) {
  const token = await getAuthToken();

  try {
    await fetchMutation(api.bots.remove, { botId }, { token });

    return {
      success: true,
      message: "Bot deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting a bot:", error);

    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
}
