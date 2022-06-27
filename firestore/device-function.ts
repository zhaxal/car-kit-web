import { packetsCol } from "../firebase/admin";
import { BackendFunction } from "./BackendFunction";

export const getPacketLast = async (IMEI: string): Promise<BackendFunction> => {
  try {
    const colRef = packetsCol(IMEI);

    const packet = await colRef.orderBy("Time", "desc").limit(1).get();

    const message = packet.docs[0].data();
    return [message, null];
  } catch (e) {
    const err = e as Error;
    return [null, err];
  }
};
