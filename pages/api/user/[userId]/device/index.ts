import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Device } from "../../../../../firebase/models/Device";
import { addOwner } from "../../../../../firestore/owner-functions";



const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { method } = req;
  let { userId } = req.query;

  switch (method) {
    case "POST":
      if (method === "POST") {
        const session = await getSession({ req });
        if (!session) return res.status(401).send("Unauthorized access");

        const data = req.body as Device;
        const owner = userId as string;

        const [result, err] = await addOwner(data, owner);

        if (err !== null) {
          res.status(500).send(err.message);
        } else res.status(200).json(result as string);
      }
      break;
  }
};

export default handler;
