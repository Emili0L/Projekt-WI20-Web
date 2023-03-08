import type { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "../../../../lib/middlewares";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 }); // cache for 1 hour

async function handle(req: NextApiRequest, res: NextApiResponse) {
  var { id: stationId, year, month } = req.query;
  stationId = stationId as string;
  if (!stationId) {
    return res.status(400).end();
  }
  // check if the data is in the cache
  const url = `${process.env.AWS_LAMBDA_URL}?stationID=${stationId}&year=${year}&month=${month}`;
  const cachedData = cache.get(url);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  // Model: WeatherData
  // Fields: stationId, timestamp, value, type (TMIN, TMAX)

  // Returns data in the following format:
  // {
  //   stationId: "123",
  //   data: [
  //     {
  //       year: 2020, // OR month: "2020-01", OR day: "2020-01-01"
  //       TMIN: 10, // Yearly mean of TMIN
  //       TMAX: 20, // Yearly mean of TMAX
  //     },
  //     ...
  //     ]
  // }

  if (month && !year) {
    return res.status(400).end();
  }

  // if month is provied make sure it is a valid month and in the correct format
  if (month) {
    const monthInt = parseInt(month as string);
    if (monthInt < 1 || monthInt > 12) {
      return res.status(400).end();
    }

    month = monthInt.toString().padStart(2, "0");
  }

  try {
    if (year && month) {
      const response = await fetch(
        `${process.env.AWS_LAMBDA_URL}?stationID=${stationId}&year=${year}&month=${month}&code=${process.env.AWS_LAMBDA_API_KEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        cache.set(url, data);
        res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
        return res.status(200).json(data);
      } else {
        return res.status(response.status).json(await response.json());
      }
    }

    if (year) {
      const response = await fetch(
        `${process.env.AWS_LAMBDA_URL}?stationID=${stationId}&year=${year}&code=${process.env.AWS_LAMBDA_API_KEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        cache.set(url, data);
        res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
        return res.status(200).json(data);
      } else {
        return res.status(response.status).json(await response.json());
      }
    }

    const response = await fetch(
      `${process.env.AWS_LAMBDA_URL}?stationID=${stationId}&code=${process.env.AWS_LAMBDA_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      cache.set(url, data);
      res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json(await response.json());
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default withMethods(["GET"], handle);
