import Client from "../types/Client";
import dotenv from "dotenv";
dotenv.config();

const getClientById = async (id: number): Promise<Client> => {
  const response = await fetch(`${process.env.BASE_URL}client/${id}`);
  return await response.json();
};

export default getClientById;
