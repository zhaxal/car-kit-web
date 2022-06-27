import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getPacketLast } from "../../../../../../../firestore/device-function";

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { method } = req;
  let { deviceId } = req.query;

  switch (method) {
    case "GET":
      if (method === "GET") {
        const session = await getSession({ req });
        if (!session) return res.status(401).send("Unauthorized access");

        const [result, err] = await getPacketLast(deviceId as string);

        if (err !== null) {
          res.status(500).send(err.message);
        } else res.status(200).json(result);
      }
      break;
  }
};

export default handler;
