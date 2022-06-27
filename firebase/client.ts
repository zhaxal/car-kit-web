import { initializeApp } from "firebase/app";
import {
  collection,
  CollectionReference,
  DocumentData,
  getFirestore,
} from "firebase/firestore";
import { Avl, Device } from "./models/Device";
import { Trip } from "./models/Trip";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export const devicesCol = createCollection<Device>("devices");
export const packetsCol = (id: string) =>
  createCollection<Avl>(`devices/${id}/packets`);

export const tripsCol = (id: string) =>
  createCollection<Trip>(`devices/${id}/trips`);

export const tripsPacketsCol = (deviceId: string, tripId: string) =>
  createCollection<Avl>(`devices/${deviceId}/trips/${tripId}/packets`);

export { db };
