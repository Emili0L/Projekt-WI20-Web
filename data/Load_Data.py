# -*- coding: utf-8 -*-
"""
Driver script to download NOAA GHCN yearly station data (from amazon s3) and store it as a CSV file.

Author: Sven Hüpers
Created: 2023-01-12

"""

import sys
import pandas as pd
from ftplib import FTP
import os


os.chdir(os.path.dirname(os.path.abspath(__file__)))


ftp_path_dly = '/pub/data/ghcn/daily/'
ftp_path_dly_all = '/pub/data/ghcn/daily/all/'
ftp_filename = 'ghcnd-stations.txt'
url_prefix = 'https://noaa-ghcn-pds.s3.amazonaws.com'


def connect_to_ftp() -> FTP:
    ftp_path_root = 'ftp.ncdc.noaa.gov'

    # Access NOAA FTP server
    ftp = FTP(ftp_path_root)
    message = ftp.login()  # No credentials needed
    print(message)
    return ftp


def get_station_id(ftp: FTP):
    '''
    Get stations file
    '''
    ftp_full_path = os.path.join(ftp_path_dly, ftp_filename)
    local_full_path = os.path.join(output_dir, ftp_filename)
    if not os.path.isfile(local_full_path):
        with open(local_full_path, 'wb+') as f:
            ftp.retrbinary('RETR ' + ftp_full_path, f.write)

def get_countries(ftp: FTP):
    '''
    Get countries file
    '''
    ftp_full_path = os.path.join(ftp_path_dly_all, 'ghcnd-countries.txt')
    local_full_path = os.path.join(output_dir, 'ghcnd-countries.txt')
    if not os.path.isfile(local_full_path):
        with open(local_full_path, 'wb+') as f:
            ftp.retrbinary('RETR ' + ftp_full_path, f.write)


if __name__ == '__main__':
    output_dir = os.path.relpath('data')
    if not os.path.isdir(output_dir):
        os.mkdir(output_dir)
    if not os.path.isfile(os.path.join(output_dir, ftp_filename)):
        ftp = connect_to_ftp()
        get_station_id(ftp)
        ftp.quit()
    if not os.path.isfile(os.path.join(output_dir, 'ghcnd-countries.txt')):
        ftp = connect_to_ftp()
        get_countries(ftp)
        ftp.quit()

    # create a loop to get the users year range or skip this step and just get all the data

    while True:
        try:
            all_years = input('Do you want to download all years? (y/n): ')
            if all_years.lower() == 'y':
                start_year = 1763
                end_year = 2022
                break
            start_year = int(input('Enter start year: '))
            end_year = int(input('Enter end year: '))
            if start_year > end_year:
                print('Start year must be less than end year')
            else:
                break
        except ValueError:
            print('Invalid year, please enter a number')

    # create a loop to get all years the user selected
    for year in range(start_year, end_year + 1):
        # checkk if year.csv already exists
        if os.path.exists(os.path.join(output_dir, f'{year}.csv')):
            print(f'{year}.csv already exists')
            continue
        csv_file_name = f'/{year}.csv.gz'
        dataset_url = url_prefix + '/csv.gz' + csv_file_name
        print("Downloading data from: ", dataset_url)
        # download the data from the url into the output dir
        df = pd.read_csv(dataset_url, header=None,
                         index_col=False,
                         names=['station_identifier',
                                'measurement_date',
                                'measurement_type',
                                'measurement_flag',
                                'quality_flag',
                                'source_flag',
                                'observation_time'],
                         parse_dates=['measurement_date'])
        df.to_csv(os.path.join(output_dir, f'{year}.csv'), index=False)
