import { tripsCol } from "../firebase/admin";
import { BackendFunction } from "./BackendFunction";

export const deleteTrip = async (
  IMEI: string,
  tripId: string
): Promise<BackendFunction> => {
  try {
    const docRef = tripsCol(IMEI).doc(tripId);
    docRef.delete();

    const message = "Successfuly deleted trip.";
    return [message, null];
  } catch (e) {
    const err = e as Error;
    return [null, err];
  }
};
