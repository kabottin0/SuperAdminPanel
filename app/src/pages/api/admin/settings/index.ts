import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import Categories from "models/Categories";
import { isValidToken } from "src/utils/jwt";
import mongoose from "mongoose";
import Settings from "models/Settings";

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

/**
 * Handler function for the product API endpoint.
 * @param req NextApiRequest object representing the incoming request.
 * @param res NextApiResponse object representing the outgoing response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);


  const {
    method,
    query,
  } = req;

  await dbConnect();

  // if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
  //   return res.status(401).json({ message: 'Missing Authorization Header' });
  // }

  // // verify auth credentials
  // const base64Credentials = req.headers.authorization.split(' ')[1];
  // const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  // const [username, password] = credentials.split(':');

  switch (method) {
    case "GET":
      try {
        const settings = await Settings.find(
          {
            domain: { $regex: query.search || "", $options: "i" },
          });

        const webUser = settings[0]?.webUser
        const webPassword = settings[0]?.webPassword
        if (username !== webUser || password !== webPassword) {
          return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }
        res.status(200).json({
          success: true,
          data: settings,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":

      try {
        console.log('passo da index per la post di setting')
        // if (!authorization) {
        //   res.status(401).json({ success: false, message: "unauthorized" });
        //   return;
        // }

        // Token validation
        // const isValid = isValidToken(authorization);

        // if (!isValid) {
        //   res.status(401).json({ success: false, message: "token-expired" });
        //   return;
        // }



        await Settings.create({
          ...req.body,
        });

        res.status(201).json({ success: true, message: "settings-update" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
