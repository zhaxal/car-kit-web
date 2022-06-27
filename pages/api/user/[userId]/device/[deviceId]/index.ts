import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { deleteOwner } from "../../../../../../firestore/owner-functions";

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { method } = req;
  let { deviceId, userId } = req.query;

  switch (method) {
    case "DELETE":
      if (method === "DELETE") {
        const session = await getSession({ req });
        if (!session) return res.status(401).send("Unauthorized access");

        const [result, err] = await deleteOwner(
          deviceId as string,
          userId as string
        );

        if (err !== null) {
          res.status(500).send(err.message);
        } else res.status(200).json(result as string);
      }
      break;
  }
};

export default handler;
