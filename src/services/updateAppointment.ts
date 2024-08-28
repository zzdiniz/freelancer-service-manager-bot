import Appointment from "../types/Appointment";

const updateAppointmentStatus = async ({
  id,
  status,
}: Partial<Appointment>): Promise<void> => {
  const response = await fetch(
    `http://localhost:3000/appointment/update-status`,
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
