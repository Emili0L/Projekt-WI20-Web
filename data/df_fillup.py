import pandas as pd
import os
from tqdm import tqdm
import warnings

# ignore warnings
pd.options.mode.chained_assignment = None
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# change the working directory to the current directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# get the name of the file to fill up
fill_up_file = input("Enter the name of the file to fill up: ")
# get the name of the file to fill it up with
full_data = input("Full Data file: ")

# break if the files are the same or not csvs
if fill_up_file == full_data or fill_up_file[-4:] != '.csv' or full_data[-4:] != '.csv':
    print("Error: The files are the same or not csvs.")
    exit()

# read in the data
df_fill_up = pd.read_csv(fill_up_file, sep=',', header=0)
df_full_data = pd.read_csv(full_data, sep=',', header=0)

count = 0

# create for all missing stationids a new row in the file to fill up
for i, row in tqdm(df_full_data.iterrows()):
    stationId = row['station_id']
    if stationId not in df_fill_up['station_id'].values:
        df_fill_up = df_fill_up.append(row)
        count += 1

# save the file to a csv file
df_fill_up.to_csv(fill_up_file, index=False)

print(f"{count} rows added to {fill_up_file}.")