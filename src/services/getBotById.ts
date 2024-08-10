import Bot from "../types/Bot";

const getBotById = async (id: number): Promise<Bot> => {
  const response = await fetch(`http://localhost:3000/bot/get-by-id/${id}`);
  return await response.json();
};

export default getBotById;
