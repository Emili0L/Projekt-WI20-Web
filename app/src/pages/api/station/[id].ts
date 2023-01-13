import type { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "../../../lib/middlewares";

async function handle(req: NextApiRequest, res: NextApiResponse) {
  var { id: stationId } = req.query;
  stationId = stationId as string;
  if (!stationId) {
    return res.status(400).end();
  }

  return res.status(200).json({
    data: {
      id: stationId,
      name: "Test Location",
      lat: 0,
      lng: 0,
    },
    error: null,
  });
}

export default withMethods(["GET"], handle);
