import Conversation from "../types/Conversation";

const getConversation = async (
  providerId: number,
  clientId: number
): Promise<Conversation | undefined> => {
  const response = await fetch(
    `http://localhost:3000/client/get-conversation/?providerId=${providerId}&clientId=${clientId}`
  );
  if (response.status !== 200) {
    return undefined;
  }
  return await response.json();
};

export default getConversation;
