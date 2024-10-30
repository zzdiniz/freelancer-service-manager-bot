
const addReview = async (appointmentId:number,review:number): Promise<void> => {

  const response = await fetch(`${process.env.BASE_URL}appointment/add-review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({appointmentId,review}),
  });

  if (!response.ok) {
    throw new Error(`Failed to add review to appointment: ${response.statusText}`);
  }

  return;
};

export default addReview;
