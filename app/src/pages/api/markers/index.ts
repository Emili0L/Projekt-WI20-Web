import { withMethods } from "../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import supercluster from "supercluster";
const geodata = require("./../../../resources/data.json");

// initialize supercluster
const index = new supercluster({
  radius: 100,
  maxZoom: 16,
});

// add points to supercluster
index.load(geodata.features);

function handle(req: NextApiRequest, res: NextApiResponse) {
  var { bounds, zoom } = req.query;
  bounds = bounds as string;

  Object.entries({ bounds, zoom }).forEach(([key, value]) => {
    if (value === undefined) {
      res.status(400).json({ error: `${key} is undefined` });
    }
  });

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
