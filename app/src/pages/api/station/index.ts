import { Client } from "@elastic/elasticsearch";
import { withMethods } from "../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon, distance, size } = req.query;

  // if lat, lon, or distance are not provided or are not numbers, return an error
  Object.entries({ lat, lon, distance }).forEach(([key, value]) => {
    if (value === undefined) {
      res.status(400).json({
        error: `Missing required parameter: ${key}`,
      });
    } else if (isNaN(Number(value))) {
      res.status(400).json({
        error: `Parameter ${key} must be a number`,
      });
    }
  });

  if (size !== undefined && isNaN(Number(size))) {
    res.status(400).json({
      error: "Parameter size must be a number",
    });
  }

  try {
    const result = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      query: {
        // @ts-expect-error
        bool: {
          must: {
            match_all: {},
          },
          filter: [
            {
              geo_distance: {
                distance: `${distance}km`,
                coordinates: {
                  lat: Number(lat),
                  lon: Number(lon),
                },
              },
            },
          ],
        },
      },
      size: Number(size) || 20,
      sort: {
        _geo_distance: {
          coordinates: {
            lat: Number(lat),
            lon: Number(lon),
          },
          order: "asc",
          unit: "km",
          mode: "min",
          distance_type: "plane",
        },
      },
    });

    res.status(200).json(result.hits.hits);
  } catch (err) {
    // if the error returns an error code, return that
    if (err.statusCode) {
      res.status(err.statusCode).json(err);
    }
    // otherwise, return a 500
    res.status(500).json(err);
  }
}

// only allow GET requests to this route
export default withMethods(["GET"], handle);
