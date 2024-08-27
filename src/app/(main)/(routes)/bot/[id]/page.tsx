import { Id } from "../../../../../../convex/_generated/dataModel";
import BotDetails from "./_components/bot-page";

export default function BotPage({ params }: { params: { id: string } }) {
  return <BotDetails id={params.id as Id<"bots">} />;
}
