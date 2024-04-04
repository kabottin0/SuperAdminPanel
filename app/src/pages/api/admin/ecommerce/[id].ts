import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Notifications from "models/Notifications";
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
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const {
    query: { id },
    headers: { authorization },
    method,
  } = req;

  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        await Notifications.findOneAndUpdate(
          { ecommerceId: id },
          {
            opened: true,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        const singleEcommerce = await Ecommerce.findOne({ _id: id });
        if (!singleEcommerce) {
          return res
            .status(400)
            .json({ success: false, message: "item-could-not-found" });
        }
        res.status(200).json({ success: true, data: singleEcommerce });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
       const ecommerceCreate = await Ecommerce.create({
        ...req.body
       })
       console.log('req.body', req.body)
       res.status(200).json({ success: true, data: ecommerceCreate });

      } catch (error) {
        console.log('error bad request')
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    // case "PUT" /* Get a model by its ID */:
    //   try {
    //     const orders = await Orders.findByIdAndUpdate(id, req.body, {
    //       new: true,
    //       runValidators: true,
    //     });
    //     if (!orders) {
    //       return res
    //         .status(400)
    //         .json({ success: false, message: "item-could-not-found" });
    //     }
    //     res
    //       .status(200)
    //       .json({ success: true, message: "order-status-updated" });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;
    case "DELETE" /* Delete a model by its ID */:
      try {
        const deleteEcommerce = await Ecommerce.deleteOne({
          _id: id,
        });
        if (!deleteEcommerce) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, message: "deleted-success" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
