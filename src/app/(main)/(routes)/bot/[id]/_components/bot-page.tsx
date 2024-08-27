"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

interface BotDetailsProps {
  id: Id<"bots">;
}

export default function BotDetails({ id }: BotDetailsProps) {
  const { isAuthenticated } = useConvexAuth();
  const bot = useQuery(
    api.bots.getBotById,
    isAuthenticated ? "skip" : { botId: id }
  );

  const isBotLoading = !bot;

  return <div>Hello from bot page!</div>;
}
