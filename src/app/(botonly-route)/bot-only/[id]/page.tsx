import Chatbot from "../_components/chatbot";

export default function BotOnlyPage({ params }: { params: { id: string } }) {
  return <Chatbot botId={params.id} />;
}
