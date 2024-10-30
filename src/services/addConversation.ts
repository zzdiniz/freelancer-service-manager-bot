import Conversation from "../types/Conversation";
import dotenv from "dotenv";
dotenv.config();

const addConversation = async ({
  providerId,
  clientId,
}: Partial<Conversation>): Promise<void> => {
  const response = await fetch(
    `${process.env.BASE_URL}client/create-conversation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerId, clientId }),
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to add client: ${response.statusText}`);
  }

  return;
};

export default addConversation;
