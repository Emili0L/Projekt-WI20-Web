// catch the route: /api/markers/{z}/{x}/{y}
import { withMethods } from "../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
const station_metadata = require("./../../../resources/station_metadata.json");

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { pathArray } = req.query;
  // if the pathArray is not an array, return an error
  if (!Array.isArray(pathArray)) {
    res.status(400).json({ error: "Invalid path" });
    return;
  }
  try {
    var [z, x, y] = pathArray as string[];
  } catch (error) {
    res.status(400).json({ error: "Invalid path" });
    return;
  }

  // make sure z, x, and y are provided
  if (!z || !x || !y) {
    return res.status(400).json({ error: "Invalid path" });
  }

  // make sure z, x, and y are numbers
  if (isNaN(Number(z)) || isNaN(Number(x)) || isNaN(Number(y))) {
    return res.status(400).json({ error: "Invalid value provided" });
  }

  console.log("processing request", z, x, y);

  // only return 5 stations for now
  const stations = station_metadata.stations.slice(0, 500);

  // return the stations
  return res.status(200).json(stations);
}

// only allow GET requests to this route
export default withMethods(["GET"], handle);
