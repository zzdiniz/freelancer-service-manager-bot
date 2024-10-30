import Bot from "../types/Bot";
import dotenv from "dotenv";
dotenv.config();

const getBotByProviderId = async (id: number): Promise<Bot> => {
  const response = await fetch(`${process.env.BASE_URL}bot/get-by-provider-id/${id}`);
  return await response.json();
};

export default getBotByProviderId;
