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
  const { q, size, country_code, start_year, end_year } = req.query;

  if (size !== undefined && isNaN(Number(size))) {
    res.status(400).json({
      error: "Parameter size must be a number",
    });
  }
  // Max size is 200
  if (size !== undefined && Number(size) > 200) {
    res.status(400).json({
      error: "Parameter size must be less than 200",
    });
  }
  // check that start_year and end_year are numbers and valid years
  Object.entries({ start_year, end_year }).forEach(([key, value]) => {
    if (value !== undefined && isNaN(Number(value))) {
      res.status(400).json({
        error: `Parameter ${key} must be a number`,
      });
    } else if (
      value !== undefined &&
      (Number(value) < 1750 || Number(value) > 2023)
    ) {
      res.status(400).json({
        error: `Parameter ${key} must be between 1750 and 2023`,
      });
    }
  });

  try {
    const result = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      size: Number(size) || 10,
      body: {
        query: {
          bool: {
            should: [
              {
                match_phrase: {
                  name: {
                    query: q as string,
                    boost: 3,
                  },
                },
              },
              {
                match_phrase: {
                  city: {
                    query: q as string,
                    boost: 1.5,
                  },
                },
              },
              {
                match_phrase: {
                  country_name: {
                    query: q as string,
                    boost: 1.5,
                  },
                },
              },
              {
                match_phrase: {
                  location_name: {
                    query: q as string,
                    boost: 2,
                  },
                },
              },
              {
                fuzzy: {
                  name: {
                    value: q as string,
                    fuzziness: 2,
                  },
                },
              },
              {
                fuzzy: {
                  city: {
                    value: q as string,
                    fuzziness: 2,
                  },
                },
              },
              {
                match: {
                  id: q as string,
                },
              },
            ],
            minimum_should_match: 1,
            filter: [
              {
                range: {
                  years: {
                    gte: Number(start_year),
                    lte: Number(end_year),
                  },
                },
              },
              ...(country_code
                ? [
                    {
                      match: {
                        country_code: country_code as string,
                      },
                    },
                  ]
                : []),
            ],
          },
        },
        // min_score: 1,
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
