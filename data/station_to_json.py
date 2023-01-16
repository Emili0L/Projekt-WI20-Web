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
# make sure missing elevations are stored as -999.9
station_metadata['elevation'] = station_metadata['elevation'].fillna(-999.9)

# Read in the country codes
country_codes = pd.read_csv('data/ghcnd-countries.txt', sep=',', header=None, names=['country_code', 'country_name'])

# Add the country name to the station metadata
# the country code is the first 2 characters of the station id
station_metadata['country_code'] = station_metadata['station_id'].str[:2]
station_metadata = station_metadata.merge(country_codes, on='country_code')
# trim the country name
station_metadata['country_name'] = station_metadata['country_name'].str.strip()

# # store the data as a json file
station_metadata.to_json('data/station_metadata.json', orient='records')



# with open('data/station_locations.json', 'w') as f:
#     f.write('{"type": "FeatureCollection", "features": [')
#     for i, row in station_metadata.iterrows():
#         f.write('{"type": "Feature", "geometry": {"type": "Point", "coordinates": [%s, %s]}, "properties": {"id": "%s", "elevation": %s}},' % (row['longitude'], row['latitude'], row['station_id'], row['elevation']))
#     f.write(']}')

# # convert the file to ndjson
# with open('data/station_locations.json', 'r') as f:
#     data = json.load(f)

# with open('data/station_locations.ndjson', 'w') as f:
#     for feature in data['features']:
#         # each line should look like this:
#         # {"id": "USC00012345", "elevation": 123.4,"country_code": "AC","country_name": "Antigua and Barbuda ", "coordinates": [-123.45, 12.34]}
#         f.write('{"id": "%s", "elevation": %s, "country_code": "%s", "country_name": "%s", "coordinates": [%s, %s]}' % (feature['properties']['id'], feature['properties']['elevation'], feature['country_code'], feature['country_name'], feature['geometry']['coordinates'][0], feature['geometry']['coordinates'][1]))
#         f.write('\n')


# read in the station metadata as a json file
with open('data/station_metadata.json', 'r') as f:
    station_metadata = json.load(f)

# store the data as ndjson
# format should look like this:
# {"id": "USC00012345", "elevation": 123.4,"country_code": "AC","country_name": "Antigua and Barbuda ", "coordinates": [-123.45, 12.34]}
with open('data/station_metadata.ndjson', 'w') as f:
    for feature in station_metadata:
        f.write('{"id": "%s", "elevation": %s, "country_code": "%s", "country_name": "%s", "coordinates": [%s, %s]}' % (feature['station_id'], feature['elevation'], feature['country_code'], feature['country_name'], feature['longitude'], feature['latitude']))
        f.write('\n')
