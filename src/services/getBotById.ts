import Bot from "../types/Bot";
import dotenv from "dotenv";
dotenv.config();

const getBotById = async (id: number): Promise<Bot> => {
  const response = await fetch(`${process.env.BASE_URL}bot/get-by-id/${id}`);
  return await response.json();
};

export default getBotById;
