import { withMethods } from "../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import supercluster from "supercluster";
const station_metadata = require("./../../../resources/station_metadata.json");

// initialize supercluster
const index = new supercluster({
  radius: 100,
  maxZoom: 16,
});
// convert coordinates to supercluster format
const points = station_metadata.stations.map((station) => ({
  type: "Feature",
  properties: {
    // generate unique id
    id:
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36),
    name: station.station_id,
  },
  geometry: {
    type: "Point",
    coordinates: [station.longitude, station.latitude],
  },
}));

// add points to supercluster
index.load(points);

function handle(req: NextApiRequest, res: NextApiResponse) {
  var { bounds, zoom } = req.query;
  bounds = bounds as string;

  // Parse the bounds string to an array of numbers
  const parsedBounds = bounds.split(",").map(Number);
  const zoomLevel = Number(zoom);

  // get clusters
  const clusters = index.getClusters(
    [parsedBounds[0], parsedBounds[1], parsedBounds[2], parsedBounds[3]],
    zoomLevel
  );

  // return clusters
  res.status(200).json(clusters);
}

// only allow GET requests to this route
export default withMethods(["GET"], handle);
