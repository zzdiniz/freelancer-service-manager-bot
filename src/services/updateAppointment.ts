import Appointment from "../types/Appointment";
import dotenv from "dotenv";
dotenv.config();

const updateAppointmentStatus = async ({
  id,
  status,
}: Partial<Appointment>): Promise<void> => {
  const response = await fetch(
    `${process.env.BASE_URL}appointment/update-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to add client: ${response.statusText}`);
  }

  return;
};

export default updateAppointmentStatus;
