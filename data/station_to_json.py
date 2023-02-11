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
df = pd.read_csv('station_data.csv', sep=',', header=0)
# create an jsonnd file to store the data, where each row looks like this:
# {"id": "ACW00011604", "elevation": 10.1, "country_code": "AC", "country_name": "Antigua and Barbuda", "coordinates": [-61.7833, 17.1167], "name": "St. John's", "years": []}
# with open('station.ndjson', 'w') as f:
#     for i, row in tqdm(df.iterrows()):
#         stationId = row['station_id']
#         elevation = row['elevation']
#         countryCode = row['country_code']
#         countryName = row['country_name']
#         coordinates = [row['longitude'], row['latitude']]
#         name = row['name']
#         years = row['years'].replace('[', '').replace(']', '').replace(' ', '').replace("'", '').replace('\n', '')
#         # convert years to a list of integers, split it every 4 characters and convert it to a list of integers
#         years = [int(year) for year in [years[i:i+4] for i in range(0, len(years), 4)]] if years != '' else []
#         f.write(f'{{"id": "{stationId}", "elevation": {elevation}, "country_code": "{countryCode}", "country_name": "{countryName}", "coordinates": {coordinates}, "name": "{name}", "years": {str(years)}}}\n')


# For every station, request the city name from the nominatim API
# and add it to the station data

# create a new column for the city name
df['city'] = ''
# create a new column for the state name
df['state'] = ''
# create a new column for the location name
df['location_name'] = ''

# iterate over all rows
for i, row in tqdm(df.iterrows()):
    # get the latitude and longitude
    lat = row['latitude']
    lon = row['longitude']
    # request the city name from the nominatim API
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1"
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    # if the city name is found, add it to the station data
    if 'town' in data['address']:
        df.at[i, 'city'] = data['address']['town']
    # if the state name is found, add it to the station data
    if 'state' in data['address']:
        df.at[i, 'state'] = data['address']['state']
    # if a display name is found, add it to the station data
    if 'display_name' in data:
        df.at[i, 'location_name'] = data['display_name']
    # save the station data to a csv file
    df.to_csv('station_data2.csv', index=False)
