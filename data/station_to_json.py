import pandas as pd
import json
import os
from tqdm import tqdm
import warnings
import urllib.request
import gzip
import shutil

# ignore warnings
pd.options.mode.chained_assignment = None
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# change the working directory to the current directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def download_file(name):
    url = f"https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/by_station/{name}.csv.gz"
    file_name = f"{name}.csv.gz"

    try:
        urllib.request.urlretrieve(url, file_name)
        print(f"File {file_name} downloaded successfully.")
        return file_name
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"Error: {name} not found.")
        else:
            print(f"Error: {e.reason}")
        exit()
    except Exception as e:
        print(f"Error: {e}")
        exit()

def read_file(file_name):
    # open and read the gzipped file then remove the original file
    with gzip.open(file_name, 'rb') as f_in, open(file_name[:-3], 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
    os.remove(file_name)
    return file_name[:-3]

# read in the station metadata
df = pd.read_csv('station_metadata.csv', sep=',', header=0)

# for every stationId request the csv file from 
# https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/by_station/<stationId>.csv.gz
# and get a list of all years for which data is available
interator = df.iterrows()

for i, row in tqdm(interator):
    stationId = row['station_id']
    try: 
        if type(row['years']) == str:
            continue
    except:
        pass
    file_name = download_file(stationId)
    file_name = read_file(file_name)
    df2 = pd.read_csv(file_name, sep=',', header=None, names=['station_id', 'date', 'element', 'value', 'm_flag', 'q_flag', 's_flag', 'obs_time'])
    df2 = df2[df2['element'].isin(['TMAX', 'TMIN'])]
    years = df2['date'].astype(str).str[:4].unique()
    df.at[i, 'years'] = years
    os.remove(file_name)
    # save the current state of the dataframe
    df.to_csv('station_metadata.csv', index=False)


# # read in the station metadata3.csv
# df = pd.read_csv('station_metadata3.csv', sep=',', header=0)
# # read in the station metadata2.csv
# df2 = pd.read_csv('data/station_metadata2.csv', sep=',', header=0)
# # add all missing rows from df2 to df
# df = df.append(df2[~df2['station_id'].isin(df['station_id'])], ignore_index=True)
# # save the current state of the dataframe
# df.to_csv('data/station_metadata3.csv', index=False)





# # create an empty dataframe to store the station metadata
# station_metadata = pd.DataFrame(columns=['station_id', 'latitude', 'longitude', 'elevation', 'country_code', 'country_name', 'name'])



# # do the above faster with multiprocessing
# def process_line(line):
#     return {'station_id': line[:11].strip(),
#             'latitude': float(line[12:20]),
#             'longitude': float(line[21:30]),
#             'elevation': float(line[31:37]),
#             'name': line[41:71].strip(),
#             'country_code': line[:2],
#             }

# # read in the data/ghcnd-stations.txt file
# with open('data/ghcnd-stations.txt', 'r') as f:
#     lines = f.readlines()
    
#     for line in tqdm(lines):
#         station_metadata = station_metadata.append(process_line(line), ignore_index=True)




# # save as csv file  
# station_metadata.to_csv('data/station_metadata.csv', index=False)


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
