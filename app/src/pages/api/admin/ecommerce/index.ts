import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import Ecommerce from "models/Ecommerce";


// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
    query,
  } = req;
  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const ecommerce = await Ecommerce.find();
        res.status(200).json({
          success: true,
          data: ecommerce,
          count: ecommerce.length,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    // case "POST":
    //   try {
    //     await Ecommerce.create({...req.body});
    //     res.status(201).json({ success: true, message: "ecommerce-created" });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(400).json({ success: false });
    //   }
    //   break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
