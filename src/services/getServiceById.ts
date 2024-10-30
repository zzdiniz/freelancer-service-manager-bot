import Service from "../types/Service";
import dotenv from "dotenv";
dotenv.config();

const getServiceById = async (id: number): Promise<Service> => {
  const response = await fetch(
    `${process.env.BASE_URL}service/${id}`
  );
  return await response.json();
};

export default getServiceById;
