import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Addresses, { IAddress } from "models/Addresses";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Users from "models/Users";
import Customers from "models/Customers";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  const {
    method,
    query,
    headers: { authorization },
  } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const customers = await Customers.find({
          user: String(query.id),
        }).sort({
          createdAt: -1,
        });

        res.status(200).json({
          success: true,
          data: customers,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        if (req.body.active) {
          await Customers.create({
            ...req.body,
          });
            await Customers.findOneAndUpdate(
              {
                active: true,
                user: req.body.user,
              },
              {
                active: false,
              }
            );
          }
          const customers = await Customers.create({
            ...req.body,
          });

          await Users.findByIdAndUpdate(req.body.user, {
            $addToSet: {
              addresses: customers._id,
            },
          });
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
