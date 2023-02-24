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
df = pd.read_csv('station_data2.csv', sep=',', header=0)
# create an jsonnd file to store the data, where each row looks like this:
# {"id": "ACW00011604", "elevation": 10.1, "country_code": "AC", "country_name": "Antigua and Barbuda", "coordinates": [-61.7833, 17.1167], "name": "St. John's", "years": []}
# with open('station_final.ndjson', 'w') as f:
#     for i, row in tqdm(df.iterrows()):
#         stationId = row['station_id']
#         elevation = row['elevation']
#         countryCode = row['country_code']
#         countryName = row['country_name']
#         coordinates = [row['longitude'], row['latitude']]
#         name = row['name'].replace('"', "'")
#         city = row['city']
#         if pd.isna(city):
#             city = ''
#         state = row['state']
#         if pd.isna(state):
#             state = ''
#         location_name = str(row['location_name']).replace('\t', ' ').replace('\n', ' ').replace('"', "'")
#         years = row['years'].replace('[', '').replace(']', '').replace(' ', '').replace("'", '').replace('\n', '')
#         years = [int(year) for year in [years[i:i+4] for i in range(0, len(years), 4)]] if years != '' else []
#         f.write(f'{{"id": "{stationId}", "elevation": {elevation}, "country_code": "{countryCode}", "country_name": "{countryName}", "state": "{state}", "coordinates": {coordinates}, "name": "{name}", "city": "{city}", "location_name": "{location_name}", "years": {str(years)}}}\n')


# ghcnd-stations

# create a tsv file to store the data, where each row looks like this:
# ACW00011604	10.1	AC	Antigua and Barbuda	-61.7833	17.1167	St. John's	St. John's	St. John's	St. John's	[1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
# with open('station_final.tsv', 'w') as f:
#     f.write('station_id\televation\tcountry_code\tcountry_name\tcoordinates\tname\tcity\tstate\tlocation_name\tyears\n')
#     for i, row in tqdm(df.iterrows()):
#         stationId = row['station_id']
#         elevation = row['elevation']
#         countryCode = row['country_code']
#         countryName = row['country_name']
#         coordinates = [row['longitude'], row['latitude']]
#         name = row['name'].replace('\t', ' ').replace('\n', ' ').replace('"', "'")
#         city = row['city']
#         if pd.isna(city):
#             city = ''
#         state = row['state']
#         if pd.isna(state):
#             state = ''
#         location_name = str(row['location_name']).replace('\t', ' ').replace('\n', ' ').replace('"', "'")
#         years = row['years'].replace('[', '').replace(']', '').replace(' ', '').replace("'", '').replace('\n', '')
#         # convert years to a list of integers, split it every 4 characters and convert it to a list of integers
#         years = [int(year) for year in [years[i:i+4] for i in range(0, len(years), 4)]] if years != '' else []
#         years = str(years).replace('[', '').replace(']', '').replace(' ', '')
#         f.write(f'{stationId}\t{elevation}\t{countryCode}\t{countryName}\t{coordinates[0]},{coordinates[1]}\t{name}\t{city}\t{state}\t{location_name}\t{years}\n')

df2 = pd.read_json('data.geojson')

# interate over every row and get the station id from features.properties.id
# then get the coordinates from features.geometry.coordinates
# then check if the coordinates match the coordinates in df

error_count = 0

for i, row in tqdm(df2.iterrows()):
    stationId = row['features']['properties']['id']
    coordinates = row['features']['geometry']['coordinates']
    coordinates = [coordinates[1], coordinates[0]]
    df3 = df.loc[df['station_id'] == stationId]
    if len(df3) == 0:
        print(f'Error: {stationId} not found.')
    elif len(df3) > 1:
        print(f'Error: {stationId} found more than once.')
    else:
        if df3['latitude'].values[0] != coordinates[0] or df3['longitude'].values[0] != coordinates[1]:
            print(f'Error: {stationId} coordinates do not match.')
            # replace the coordinates in df2 with the coordinates from df
            df2.at[i, 'features']['geometry']['coordinates'] = [df3['longitude'].values[0], df3['latitude'].values[0]]
            error_count += 1

# create a for loop to wrtie a file in the geojson format
# {
#     "type": "FeatureCollection",
#     "features": [
    # {
    #         "type": "Feature",
    #         "properties": {
    #             "name": "ST JOHNS COOLIDGE FIELD, AC",
    #             "id": "ACW00011604",
    #             "elevation": 10.1,
    #             "mindate": "1949-01-01",
    #             "maxdate": "1949-08-14"
    #         },
    #         "geometry": {
    #             "type": "Point",
    #             "coordinates": [
    #                 -61.78333,
    #                 17.11667
    #             ]
    #         }
    #     },

with open('data2.geojson', 'w') as f:
    f.write('{"type": "FeatureCollection", "features": [')
    for i, row in tqdm(df2.iterrows()):
        stationId = row['features']['properties']['id']
        elevation = row['features']['properties']['elevation']
        startYear = row['features']['properties']['mindate']
        endYear = row['features']['properties']['maxdate']
        coordinates = row['features']['geometry']['coordinates']
        name = row['features']['properties']['name']
        f.write('{"type": "Feature", "properties": {"name": "' + name + '", "id": "' + stationId + '", "elevation": ' + str(elevation) + ', "mindate": "' + startYear + '", "maxdate": "' + endYear + '"}, "geometry": {"type": "Point", "coordinates": [' + str(coordinates[0]) + ', ' + str(coordinates[1]) + ']}}')
        if i != len(df2) - 1:
            f.write(',')
    f.write(']}')
    
print(f'Error count: {error_count}')