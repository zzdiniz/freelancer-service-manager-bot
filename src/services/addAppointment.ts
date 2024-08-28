import Appointment from "../types/Appointment";

const addAppointment = async ({ datetime,providerId,serviceId,clientId,status}: Appointment): Promise<void> => {

  const response = await fetch(`http://localhost:3000/appointment/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ datetime,providerId,serviceId,clientId,status}),
  });

  if (!response.ok) {
    throw new Error(`Failed to add appointment: ${response.statusText}`);
  }

  return;
};

export default addAppointment;
