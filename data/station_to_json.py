import pandas as pd
import json
import os
from tqdm import tqdm
import warnings

# ignore warnings
pd.options.mode.chained_assignment = None
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# change the working directory to the current directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# create an empty dataframe to store the station metadata
station_metadata = pd.DataFrame(columns=['station_id', 'latitude', 'longitude', 'elevation', 'country_code', 'country_name', 'name'])

# run over the data/ghcnd-stations.txt and set a new row based on the string in each line
# eample line: AE000041196  25.3330   55.5170   34.0    SHARJAH INTER. AIRP            GSN     41196
# with open('data/ghcnd-stations.txt', 'r') as f:
#     for line in tqdm(f):
#         station_metadata = station_metadata.append({'station_id': line[:11].strip(),
#                                                     'latitude': float(line[12:20]),
#                                                     'longitude': float(line[21:30]),
#                                                     'elevation': float(line[31:37]),
#                                                     'name': line[41:71].strip(),
#                                                     'country_code': line[:2],
#                                                     }, ignore_index=True)

# do the above faster with multiprocessing
def process_line(line):
    return {'station_id': line[:11].strip(),
            'latitude': float(line[12:20]),
            'longitude': float(line[21:30]),
            'elevation': float(line[31:37]),
            'name': line[41:71].strip(),
            'country_code': line[:2],
            }

# read in the data/ghcnd-stations.txt file
with open('data/ghcnd-stations.txt', 'r') as f:
    lines = f.readlines()
    
    for line in tqdm(lines):
        station_metadata = station_metadata.append(process_line(line), ignore_index=True)




# save as csv file  
station_metadata.to_csv('data/station_metadata.csv', index=False)


# # Read in the data
# station_metadata = pd.read_csv('data/ghcnd-stations.txt', 
#                            sep='\s+',  # Fields are separated by one or more spaces
#                            usecols=[0, 1, 2, 3],  # Grab only the first 4 columns
#                            na_values=[-999.9],  # Missing elevation is noted as -999.9
#                            header=None,
#                            names=['station_id', 'latitude', 'longitude', 'elevation'])
# # make sure missing elevations are stored as -999.9
# station_metadata['elevation'] = station_metadata['elevation'].fillna(-999.9)

# # Read in the country codes
# country_codes = pd.read_csv('data/ghcnd-countries.txt', sep=',', header=None, names=['country_code', 'country_name'])

# # Add the country name to the station metadata
# # the country code is the first 2 characters of the station id
# station_metadata['country_code'] = station_metadata['station_id'].str[:2]
# station_metadata = station_metadata.merge(country_codes, on='country_code')
# # trim the country name
# station_metadata['country_name'] = station_metadata['country_name'].str.strip()

# # # store the data as a json file
# station_metadata.to_json('data/station_metadata.json', orient='records')



# # with open('data/station_locations.json', 'w') as f:
# #     f.write('{"type": "FeatureCollection", "features": [')
# #     for i, row in station_metadata.iterrows():
# #         f.write('{"type": "Feature", "geometry": {"type": "Point", "coordinates": [%s, %s]}, "properties": {"id": "%s", "elevation": %s}},' % (row['longitude'], row['latitude'], row['station_id'], row['elevation']))
# #     f.write(']}')

# # # convert the file to ndjson
# # with open('data/station_locations.json', 'r') as f:
# #     data = json.load(f)

# # with open('data/station_locations.ndjson', 'w') as f:
# #     for feature in data['features']:
# #         # each line should look like this:
# #         # {"id": "USC00012345", "elevation": 123.4,"country_code": "AC","country_name": "Antigua and Barbuda ", "coordinates": [-123.45, 12.34]}
# #         f.write('{"id": "%s", "elevation": %s, "country_code": "%s", "country_name": "%s", "coordinates": [%s, %s]}' % (feature['properties']['id'], feature['properties']['elevation'], feature['country_code'], feature['country_name'], feature['geometry']['coordinates'][0], feature['geometry']['coordinates'][1]))
# #         f.write('\n')


# # read in the station metadata as a json file
# with open('data/station_metadata.json', 'r') as f:
#     station_metadata = json.load(f)

# # store the data as ndjson
# # format should look like this:
# # {"id": "USC00012345", "elevation": 123.4,"country_code": "AC","country_name": "Antigua and Barbuda ", "coordinates": [-123.45, 12.34]}
# with open('data/station_metadata.ndjson', 'w') as f:
#     for feature in station_metadata:
#         f.write('{"id": "%s", "elevation": %s, "country_code": "%s", "country_name": "%s", "coordinates": [%s, %s]}' % (feature['station_id'], feature['elevation'], feature['country_code'], feature['country_name'], feature['longitude'], feature['latitude']))
#         f.write('\n')
