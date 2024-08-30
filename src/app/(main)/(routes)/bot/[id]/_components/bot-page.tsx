"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";
import BotDetailsPage from "./bot-details";

interface BotDetailsProps {
  id: Id<"bots">;
}

export default function BotDetails({ id }: BotDetailsProps) {
  const { isAuthenticated } = useConvexAuth();
  const bot = useQuery(
    api.bots.getBotById,
    isAuthenticated ? { botId: id } : "skip"
  );

  return (
    <BotDetailsPage bot={bot}/>
  );
}
