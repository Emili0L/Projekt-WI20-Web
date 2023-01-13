import { withMethods } from "../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @param lat as number
 * @param lng as number
 * @param radius as number
 * @param x_count as number
 */

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lng, radius, x_count } = req.query;

  // check if all required fields are present
  for (const [key, value] of Object.entries({
    lat,
    lng,
  })) {
    if (!value) {
      return res.status(400).json({
        data: null,
        error: `Missing required field ${key}`,
      });
    }
  }
  // check if the provided values are actually numbers
  for (const [key, value] of Object.entries({
    lat,
    lng,
    radius,
    x_count,
  })) {
    if (value && isNaN(Number(value))) {
      return res.status(400).json({
        data: null,
        error: `Invalid value for ${key}`,
      });
    }
  }

  res.status(200).send("I'm alive");
}

// only allow GET requests to this route
export default withMethods(["GET"], handle);
