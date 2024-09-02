import { Clerk } from "@clerk/clerk-js";

// Fetch the Clerk Publishable Key from the environment variables
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Initialize Clerk with the Publishable Key
const clerk = new Clerk(clerkPubKey);
await clerk.load();

consol.log("clerk loaded");

if (clerk.user) {
  document.getElementById("app").innerHTML = `
    <div id="chatbot-container"></div>
  `;

  const chatbotDiv = document.getElementById("chatbot-container");

  // Render the Chatbot component
  const root = ReactDOM.createRoot(chatbotDiv);
  root.render(
    React.createElement(window.Chatbot, {
      botId: "js71qsag15hdeg8v2h859kwebd6zv35f", // Replace with a real bot ID
    })
  );
} else {
  document.getElementById("app").innerHTML = `
    <div id="sign-in"></div>
  `;

  const signInDiv = document.getElementById("sign-in");
  clerk.mountSignIn(signInDiv);
}
