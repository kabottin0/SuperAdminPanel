import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import { paramCase } from "change-case";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import { multiFilesDelete } from "src/utils/uploader";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import { isValidToken } from "src/utils/jwt";
import Settings from "models/Settings";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

/**
 * Handler function for the product API endpoint.
 * @param req NextApiRequest object representing the incoming request.
 * @param res NextApiResponse object representing the outgoing response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  const {
    query: { id },
    method,
  } = req;

  

  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' });
  }

  // verify auth credentials
  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  const webUser = req.body.webUser
  const webPassword = req.body.webPassword



  if (username !== webUser || password !== webPassword) {
      return res.status(401).json({ message: 'Invalid Authentication Credentials' });
  }
 
  await dbConnect();

  switch (method) {
    case "PUT":
      res.status(200).json({ success: true, message: "settings-updated" });
        try {
          const settings = await Settings.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!settings) {
            return res
              .status(400)
              .json({ success: false, message: "item-could-not-found" });
          }
          res
            .status(200)
            .json({ success: true, message: "settings-updated" });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
    case "DELETE":
      try {
        const product = await Products.findOne({ slug: id });
        const length: any = product?.variants?.length;
        for (let i = 0; i < length || 0; i++) {
          await multiFilesDelete(product?.variants[i].images);
        }

        const deleteProduct = await Products.deleteOne({ slug: id });
        if (!deleteProduct) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, message: "deleted-success" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
