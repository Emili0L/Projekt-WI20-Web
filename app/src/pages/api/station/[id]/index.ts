import type { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "../../../../lib/middlewares";
import prisma from "../../../../prisma";

async function handle(req: NextApiRequest, res: NextApiResponse) {
  var { id: stationId, year, month } = req.query;
  stationId = stationId as string;
  if (!stationId) {
    return res.status(400).end();
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
      const data = await prisma.$queryRaw`SELECT
        EXTRACT(day FROM timestamp) as day,
        AVG(CASE WHEN type='TMIN' THEN value/10 ELSE NULL END) as TMIN,
        AVG(CASE WHEN type='TMAX' THEN value/10 ELSE NULL END) as TMAX
      FROM "WeatherData"
      WHERE "stationId" = ${stationId}
      AND EXTRACT(year FROM timestamp) = ${parseInt(year as string)}
      AND EXTRACT(month FROM timestamp) = ${parseInt(month as string)}
      GROUP BY day
      ORDER BY day ASC
    `;
      return res.status(200).json({
        stationId: stationId,
        data: data,
      });
    }

    if (year) {
      const data = await prisma.$queryRaw`SELECT 
        date_trunc('month', timestamp) as month, 
        AVG(CASE WHEN type='TMIN' THEN value/10 ELSE NULL END) as TMIN,
        AVG(CASE WHEN type='TMAX' THEN value/10 ELSE NULL END) as TMAX
      FROM "WeatherData"
      WHERE "stationId" = ${stationId} 
      AND EXTRACT(year FROM timestamp) = ${parseInt(year as string)}
      GROUP BY month
      ORDER BY month ASC
    `;
      return res.status(200).json({
        stationId: stationId,
        data: data,
      });
    }

    const data = await prisma.$queryRaw`SELECT 
        EXTRACT(year FROM timestamp) as year, 
        AVG(CASE WHEN type='TMIN' THEN value/10 ELSE NULL END) as TMIN,
        AVG(CASE WHEN type='TMAX' THEN value/10 ELSE NULL END) as TMAX
      FROM "WeatherData"
      WHERE "stationId" = ${stationId}
      GROUP BY year
      ORDER BY year ASC
    `;

    res.status(200).json({
      stationId: stationId,
      data: data,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default withMethods(["GET"], handle);
