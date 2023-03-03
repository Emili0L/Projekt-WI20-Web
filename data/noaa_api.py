import json
import requests
import os
import pandas as pd

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# TOKEN = "YOUR_TOKEN_HERE"

# # Page from 0 to 39
# def get_data(page):
#     url = f"https://www.ncei.noaa.gov/cdo-web/api/v2/stations?datatypeid=TMIN&datatypeid=TMAX&limit=1000&offset={page*1000}"
#     headers = {
#         "token": TOKEN,
#         "Content-Type": "application/json"
#     }
#     response = requests.get(url, headers=headers)
#     return json.loads(response.text)

# # Get all data
# def get_all_data():
#     data = []
#     for page in range(40):
#         json = get_data(page)
#         data += json["results"]
#     return data

# # Save data to file
# def save_data(data):
#     with open("data.json", "w") as f:
#         json.dump(data, f)

# Load data from file
# def load_data():
#     with open("data.json", "r") as f:
#         return json.load(f)

# # Get all data
# data = get_all_data()

# # Save data to file
# save_data(data)


# # load csv file data into pandas dataframe
# df = pd.read_csv('data.csv')
# # fill missing elevation values with -9999
# df['elevation'] = df['elevation'].fillna(-9999)
# # create a geojson file as regular json file
# geojson = {'type': 'FeatureCollection', 'features': []}
# # loop through each row in the dataframe and convert each row to geojson format
# for _, row in df.iterrows():
#     # create a feature template and fill in properties from df
#     feature = {'type': 'Feature',
#                'properties': {},
#                'geometry': {'type': 'Point', 'coordinates': []}}
#     feature['geometry']['coordinates'] = [row['longitude'], row['latitude']]
#     feature['properties']['name'] = row['name']
#     feature['properties']['id'] = row['id']
#     feature['properties']['elevation'] = row['elevation']
#     feature['properties']['mindate'] = row['mindate']
#     feature['properties']['maxdate'] = row['maxdate']
#     # add this feature (aka, converted dataframe row) to the list of features inside our dict
#     geojson['features'].append(feature)

# # save geojson file
# with open('data.geojson', 'w') as f:
#     json.dump(geojson, f)

# load the data.csv file into a pandas dataframe
df = pd.read_csv('station_data.csv')
print("rows", len(df))
print("years", df['years'].count())
# # load in the csv file station_metadata3.csv into a pandas dataframe
# df2 = pd.read_csv('station_metadata3.csv')
# df2 = df2[df2['years'].notna()]

# # create a list of station ids that are in both df and df2
# station_ids = df[df['station_id'].isin(df2['station_id'])]['station_id'].values

# # print how many station ids are in both df and df2
# print("stationIDs", len(station_ids))

# # loop through these station ids and fill in any missing values in the years column
# for station_id in station_ids:
#     df.loc[df['station_id'] == station_id, 'years'] = df2.loc[df2['station_id'] == station_id, 'years'].values[0]

# # print how many rows have a value in col years
# print(df['years'].count())

# df['elevation'] = df['elevation'].fillna(-9999)
# # load station_metadata.csv file into a pandas dataframe
# df2 = pd.read_csv('station_metadata3.csv')
# # only keep the station ids that are in the data.csv file
# df2 = df2[df2['station_id'].isin(df['id'])]
# # save as csv file named station_data.csv
# df2.to_csv('station_data.csv', index=False)
