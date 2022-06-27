import { db, usersCol } from "../firebase/admin";
import { User } from "../firebase/models/User";
import { BackendFunction } from "./BackendFunction";

const compareUser = (json1: User, json2: User) => {
  return (
    JSON.stringify({
      email: json1.email,
      name: json1.name,
      image: json1.image,
    }) !==
    JSON.stringify({
      email: json2.email,
      name: json2.name,
      image: json2.image,
    })
  );
};

export const setUser = async (data: User): Promise<BackendFunction> => {
  try {
    const { name, image, email } = data;
    const docRef = usersCol.doc(data.id);

    await db.runTransaction(async (t) => {
      const user = await t.get(docRef);
      let isChanged = false;

      const userData = user.data();

      if (user.exists) isChanged = compareUser(data, userData!);

      if (isChanged) {
        t.set(docRef, { name, image, email }, { merge: true });
      }

      if (!user.exists) {
        t.set(docRef, { name, image, email }, { merge: true });
      }
    });

    const message = "Successfuly set user.";
    return [message, null];
  } catch (e) {
    const err = e as Error;
    return [null, err];
  }
};
