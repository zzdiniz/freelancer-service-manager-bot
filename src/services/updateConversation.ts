import Conversation from "../types/Conversation";

const updateConversation = async ({
  providerId,
  clientId,
  conversationState
}: Partial<Conversation>): Promise<void> => {
  const response = await fetch(
    `http://localhost:3000/client/update-conversation`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerId, clientId,conversationState }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to add client: ${response.statusText}`);
  }

  return;
};

export default updateConversation;
