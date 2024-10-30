
const getAvailableDates = async (providerId: number): Promise<string[]> => {
  const response = await fetch(`${process.env.BASE_URL}appointment/get-available-dates?providerId=${providerId}`);
  return await response.json();
};

export default getAvailableDates ;
