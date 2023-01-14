import pandas as pd
import json
import os

# change the working directory to the current directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Read in the data
station_metadata = pd.read_csv('data/ghcnd-stations.txt', 
                           sep='\s+',  # Fields are separated by one or more spaces
                           usecols=[0, 1, 2, 3],  # Grab only the first 4 columns
                           na_values=[-999.9],  # Missing elevation is noted as -999.9
                           header=None,
                           names=['station_id', 'latitude', 'longitude', 'elevation'])

# store a txt file where each line is a coordinate
# format: { lat: 48.7296776, lng: 9.106788280434158 },
with open('data/station_coordinates.txt', 'w') as f:
    for index, row in station_metadata.iterrows():
        f.write(f'{{ lat: {row["latitude"]}, lng: {row["longitude"]} }},\r' )

