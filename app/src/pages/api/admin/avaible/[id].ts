import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import Orders from "models/Orders";
import { isValidToken } from "src/utils/jwt";
import Ecommerce from "models/Ecommerce";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const {
    query: { id },
    method,
    headers: { authorization },
  } = req;

  if (!authorization) {
    res.status(401).json({ success: false, message: "unauthorized" });
    return;
  }

  // Token validation
  const isValid = isValidToken(authorization);

  if (!isValid) {
    res.status(401).json({ success: false, message: "token-expired" });
    return;
  }

  await dbConnect();

  switch (method) {
      
    case "POST":
      const ecommerce = await Ecommerce.findByIdAndUpdate(
        id, 
        { ...req.body},
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({ success: true, data: ecommerce, message: "success"});
      break;

    default:
      res
        .status(400)
        .json({ success: false, message: "invalid-request-method" });
      break;
  }
}
