import Conversation from "../types/Conversation";

const addConversation = async ({
  providerId,
  clientId,
}: Partial<Conversation>): Promise<void> => {
  const response = await fetch(
    `http://localhost:3000/client/create-conversation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerId, clientId }),
    }
  );
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(`Failed to add client: ${response.statusText}`);
  }

  return;
};

export default addConversation;
