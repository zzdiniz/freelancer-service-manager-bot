import Conversation from "../types/Conversation";

const getConversation = async (
  providerId: number,
  clientId: number
): Promise<Conversation | undefined> => {
  const response = await fetch(
    `${process.env.BASE_URL}client/get-conversation/?providerId=${providerId}&clientId=${clientId}`
  );
  if (response.status !== 200) {
    return undefined;
  }
  return await response.json();
};

export default getConversation;
