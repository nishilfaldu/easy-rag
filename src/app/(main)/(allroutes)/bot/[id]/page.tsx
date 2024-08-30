import BotDetails from "./_components/bot-page";
import type { Id } from "../../../../../../convex/_generated/dataModel";




export default function BotPage({ params }: { params: { id: string } }) {
  return <BotDetails id={params.id as Id<"bots">} />;
}
