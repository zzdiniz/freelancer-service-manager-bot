import Appointment from "../types/Appointment";
import dotenv from "dotenv";
dotenv.config();

const getLatestAppointment = async (providerId: number,clientId: number): Promise<Appointment> => {
  const response = await fetch(
    `${process.env.BASE_URL}appointment/get-latest/?providerId=${providerId}&clientId=${clientId}`
  );
  return await response.json();
};

export default getLatestAppointment;
