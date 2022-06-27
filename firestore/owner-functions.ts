import { FieldValue } from "firebase-admin/firestore";
import { devicesCol } from "../firebase/admin";
import { Device } from "../firebase/models/Device";
import { BackendFunction } from "./BackendFunction";

export const addOwner = async (
  data: Device,
  owner: string
): Promise<BackendFunction> => {
  try {

    const docRef = devicesCol.doc(data.IMEI);

    await docRef.update({
      name: data.name,
      owner: FieldValue.arrayUnion(owner),
    });

    const message = "Successfuly added device.";
    return [message, null];
  } catch (e) {
    const err = e as Error;
    return [null, err];
  }
};

export const deleteOwner = async (
  IMEI: string,
  owner: string
): Promise<BackendFunction> => {
  try {
    const docRef = devicesCol.doc(IMEI);
    await docRef.update({
      name: FieldValue.delete(),
      owner: FieldValue.arrayRemove(owner),
    });

    const message = "Successfuly removed device.";
    return [message, null];
  } catch (e) {
    const err = e as Error;
    return [null, err];
  }
};
