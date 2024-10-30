import Appointment from "../types/Appointment";

const getLatestAppointment = async (providerId: number,clientId: number): Promise<Appointment> => {
  const response = await fetch(
    `${process.env.BASE_URL}appointment/get-latest/?providerId=${providerId}&clientId=${clientId}`
  );
  return await response.json();
};

export default getLatestAppointment;
