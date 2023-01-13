import type { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "../../../lib/middlewares";

async function handle(req: NextApiRequest, res: NextApiResponse) {
  var { id: locationId } = req.query;
  locationId = locationId as string;
  if (!locationId) {
    return res.status(400).end();
  }

  return res.status(200).json({
    data: {
      id: locationId,
      name: "Test Location",
      lat: 0,
      lng: 0,
    },
    error: null,
  });
}

export default withMethods(["GET"], handle);
