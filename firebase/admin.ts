import { initializeApp, cert, getApps } from "firebase-admin/app";
import {
  CollectionReference,
  DocumentData,
  getFirestore,
} from "firebase-admin/firestore";

import serviceAccount from "../serviceKey.json";
import { Avl, Device } from "./models/Device";
import { Trip } from "./models/Trip";

import { User } from "./models/User";

const apps = getApps();

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

if (!apps.length) {
  initializeApp({
    credential: cert(params),
  });
}

const db = getFirestore();

const createCollection = <T = DocumentData>(collectionName: string) => {
  return db.collection(collectionName) as CollectionReference<T>;
};

export const usersCol = createCollection<User>("users");
export const devicesCol = createCollection<Device>("devices");
export const packetsCol = (id: string) =>
  createCollection<Avl>(`devices/${id}/packets`);
export const tripsCol = (id: string) =>
  createCollection<Trip>(`devices/${id}/trips`);

export { db };
