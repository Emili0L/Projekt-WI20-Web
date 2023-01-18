# -*- coding: utf-8 -*-
"""
Script to seed the database with the station data.

Author: Sven Hüpers
Created: 2023-01-17

"""

import os
import sys
import logging
import argparse
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from sqlalchemy import Column, String, DateTime, Enum,Float
from sqlalchemy.ext.declarative import declarative_base
from tqdm import tqdm


### Variables
# Set up the database connection
DATABASE_URL = "postgresql://root:root@localhost:5432/ghcnd"
engine = create_engine(DATABASE_URL)
Base = declarative_base()
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Set up the WeatherData class
class WeatherData(Base):
    __tablename__ = "WeatherData"

    id = Column(String, primary_key=True)
    stationId = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=False), nullable=False)
    type = Column(Enum("MeasurementType"), nullable=False)
    value = Column(Float, nullable=False)

    def __init__(self, station_id, timestamp, measurement_type, value):
        self.id = f"{station_id}-{timestamp}-{measurement_type}"
        self.stationId = station_id
        self.timestamp = timestamp
        self.type = measurement_type
        self.value = value

    def __repr__(self):
        return f"<WeatherData(station_id={self.stationId}, timestamp={self.timestamp}, measurement_type={self.type}, value={self.value})>"

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up the parser
parser = argparse.ArgumentParser(description="Script to seed the database with the station data.")
parser.add_argument("--data_dir", type=str, default="data", help="Path to the data directory.")
parser.add_argument("--start_year", type=int, default=1793, help="Start year of the data to seed.")
parser.add_argument("--end_year", type=int, default=1800, help="End year of the data to seed.")


### Functions

def main(args):
    # Get the data
    data = []
    for year in range(args.start_year, args.end_year + 1):
        data += get_data(args.data_dir, year)
        logger.info(f"Added year {year} to the data.")

    # Insert the data
    insert_data(data)

def get_data(data_dir, year) -> list[WeatherData]:
    # Get the data
    data = pd.read_csv(os.path.join(data_dir, f"{year}.csv"), header=0)
    data = data.iloc[:, :4]
    data.columns = ["station_id", "timestamp", "measurement_type", "value"]

    # Convert the timestamp
    data["timestamp"] = pd.to_datetime(data["timestamp"], format="%Y-%m-%d")

    
    # Convert the measurement type
    data["measurement_type"] = data["measurement_type"].str.strip()

    # Only keep the measurement_types: TMAX, TMIN
    data = data[data["measurement_type"].isin(["TMAX", "TMIN"])]

    # Convert the value
    data["value"] = data["value"].astype(float)

    # Convert to a list of dicts
    data = data.to_dict(orient="records")

    # Convert to a list of WeatherData objects
    data = [WeatherData(**d) for d in data]

    logger.info(f"Got {len(data)} rows of data for year {year}.")

    return data

def insert_data(data: list[WeatherData]):
    # Insert the data
    for d in tqdm(data):
        try:    
            session.add(d)
            session.commit()
        except IntegrityError:
            session.rollback()

        except Exception as e:
            session.rollback()
            logger.error(f"Error inserting data for station_id={d.stationId}, timestamp={d.timestamp}, measurement_type={d.type}.")
            logger.error(e)
            sys.exit(1)

    logger.info(f"Successfully inserted {len(data)} rows of data.")

    # Close the session
    session.close()


### Main

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    args = parser.parse_args()
    main(args)

