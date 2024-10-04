import Bot from "../types/Bot";

const getBotByProviderId = async (id: number): Promise<Bot> => {
  const response = await fetch(`http://localhost:3000/bot/get-by-provider-id/${id}`);
  return await response.json();
};

export default getBotByProviderId;
