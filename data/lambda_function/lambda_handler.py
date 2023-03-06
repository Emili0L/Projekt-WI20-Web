import json
import pandas as pd


# import time


def lambda_handler(event, context):
    station_id = event["queryStringParameters"]["stationID"]
    year = event["queryStringParameters"].get("year")
    month = event["queryStringParameters"].get("month")

    # t0 = time.time()

    df = pd.read_csv(f"https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/by_station/{station_id}.csv.gz", header=None,
                     index_col=0, usecols=[1, 2, 3],
                     names=['DATE',
                            'ELEMENT',
                            'DATA VALUE'],
                     parse_dates=['DATE'])

    # t1 = time.time()

    if station_id and not year and not month:
        df_tmax = df[df['ELEMENT'] == 'TMAX']  # filter for TMAX element
        df_tmax["CALC"] = df_tmax['DATA VALUE'].astype(float) / 10
        df_tmin = df[df['ELEMENT'] == 'TMIN']  # filter for TMIN element
        df_tmin["CALC"] = df_tmin['DATA VALUE'].astype(float) / 10

        df_summer_months_max = df_tmax[(df_tmax.index.month >= 6) & (df_tmax.index.month <= 8)]
        df_summer_max = df_summer_months_max.groupby(df_summer_months_max.index.year)["CALC"].mean()
        df_summer_months_min = df_tmin[(df_tmin.index.month >= 6) & (df_tmin.index.month <= 8)]
        df_summer_min = df_summer_months_min.groupby(df_summer_months_min.index.year)["CALC"].mean()

        df_winter_months_max = df_tmax[(df_tmax.index.month == 12) | (df_tmax.index.month <= 2)]
        # transfer the year index of the december to the previous year to enable the correct calculation
        df_winter_months_max.index = df_winter_months_max.index.map(
            lambda x: x.replace(year=x.year + 1) if x.month == 12 else x)
        df_winter_max = df_winter_months_max.groupby(df_winter_months_max.index.year)["CALC"].mean()
        df_winter_max.index = df_winter_max.index.map(lambda x: x - 1)

        df_winter_months_min = df_tmin[(df_tmin.index.month == 12) | (df_tmin.index.month <= 2)]
        # transfer the year index of the december to the previous year to enable the correct calculation
        df_winter_months_min.index = df_winter_months_min.index.map(
            lambda x: x.replace(year=x.year + 1) if x.month == 12 else x)
        df_winter_min = df_winter_months_min.groupby(df_winter_months_min.index.year)["CALC"].mean()
        df_winter_min.index = df_winter_min.index.map(lambda x: x - 1)

        df_autumn_months_max = df_tmax[(df_tmax.index.month >= 9) & (df_tmax.index.month <= 11)]
        df_autumn_max = df_autumn_months_max.groupby(df_autumn_months_max.index.year)["CALC"].mean()
        df_autumn_months_min = df_tmin[(df_tmin.index.month >= 9) & (df_tmin.index.month <= 11)]
        df_autumn_min = df_autumn_months_min.groupby(df_autumn_months_min.index.year)["CALC"].mean()

        df_spring_months_max = df_tmax[(df_tmax.index.month >= 3) & (df_tmax.index.month <= 5)]
        df_spring_max = df_spring_months_max.groupby(df_spring_months_max.index.year)["CALC"].mean()
        df_spring_months_min = df_tmin[(df_tmin.index.month >= 3) & (df_tmin.index.month <= 5)]
        df_spring_min = df_spring_months_min.groupby(df_spring_months_min.index.year)["CALC"].mean()

        yearly_averages_tmax = df_tmax.groupby(df_tmax.index.year)['CALC'].mean()
        yearly_averages_tmin = df_tmin.groupby(df_tmin.index.year)['CALC'].mean()

        result_df = pd.concat(
            [yearly_averages_tmax, yearly_averages_tmin, df_summer_max, df_summer_min, df_winter_max, df_winter_min,
             df_autumn_max, df_autumn_min, df_spring_max, df_spring_min], axis=1)

        # Change NaN to " " values to reviece Null in JSON
        result_df = result_df.fillna('')

        # Create a new dictionary to store the final result
        final_result = {
            "stationId": station_id,
            "data": []
        }

        # given_years = result_df.index.values.tolist()

        # get all relevant years
        given_years_max = yearly_averages_tmax.index.values.tolist()
        given_years_min = yearly_averages_tmin.index.values.tolist()
        set1 = set(given_years_max)
        set2 = set(given_years_min)
        union_set = set1.union(set2)
        given_years = list(union_set)

        start_year = given_years[0]
        end_year = given_years[-1]
        dict_years = {}

        for counter in range(end_year - start_year + 1):
            y = start_year + counter
            if y in given_years:
                dict_years[y] = True
            else:
                dict_years[y] = False

        for y in dict_years:
            if dict_years[y] == False:
                tmax = None
                tmin = None
                tmax_summer = None
                tmin_summer = None
                tmax_winter = None
                tmin_winter = None
                tmax_autumn = None
                tmin_autumn = None
                tmax_spring = None
                tmin_spring = None
            else:
                tmax = result_df.loc[[y]].values.flatten().tolist()[0]
                tmin = result_df.loc[[y]].values.flatten().tolist()[1]
                tmax_summer = result_df.loc[[y]].values.flatten().tolist()[2]
                tmin_summer = result_df.loc[[y]].values.flatten().tolist()[3]
                tmax_winter = result_df.loc[[y]].values.flatten().tolist()[4]
                tmin_winter = result_df.loc[[y]].values.flatten().tolist()[5]
                tmax_autumn = result_df.loc[[y]].values.flatten().tolist()[6]
                tmin_autumn = result_df.loc[[y]].values.flatten().tolist()[7]
                tmax_spring = result_df.loc[[y]].values.flatten().tolist()[8]
                tmin_spring = result_df.loc[[y]].values.flatten().tolist()[9]

                if tmax == "":
                    tmax = None
                if tmin == "":
                    tmin = None
                if tmax_summer == "":
                    tmax_summer = None
                if tmin_summer == "":
                    tmin_summer = None
                if tmax_winter == "":
                    tmax_winter = None
                if tmin_winter == "":
                    tmin_winter = None
                if tmax_autumn == "":
                    tmax_autumn = None
                if tmin_autumn == "":
                    tmin_autumn = None
                if tmax_spring == "":
                    tmax_spring = None
                if tmin_spring == "":
                    tmin_spring = None

            data = {
                "year": y,
                "tmin": tmin,
                "tmax": tmax,
                "tmax_summer": tmax_summer,
                "tmin_summer": tmin_summer,
                "tmax_winter": tmax_winter,
                "tmin_winter": tmin_winter,
                "tmax_autumn": tmax_autumn,
                "tmin_autumn": tmin_autumn,
                "tmax_spring": tmax_spring,
                "tmin_spring": tmin_spring
            }
            final_result["data"].append(data)

    if station_id and year and not month:
        df['DATA VALUE'] = df['DATA VALUE'].astype(float) / 10
        df_tmax = df[df['ELEMENT'] == 'TMAX']
        df_tmin = df[df['ELEMENT'] == 'TMIN']

        df_tmax = df_tmax[(df_tmax.index.year == int(year))]
        df_tmin = df_tmin[(df_tmin.index.year == int(year))]

        monthly_averages_tmax = df_tmax.groupby(df_tmax.index.month)['DATA VALUE'].mean()
        monthly_averages_tmin = df_tmin.groupby(df_tmin.index.month)['DATA VALUE'].mean()

        result_df = pd.concat([monthly_averages_tmax, monthly_averages_tmin], axis=1)

        # Change NaN to " " values to reviece Null in JSON
        result_df = result_df.fillna('')

        final_result = {
            "stationId": station_id,
            "data": []
        }

        # create a dict of the months in a year and the information if they are in the data
        # important to return a array with all month regardless of data for the graph
        given_months = result_df.index.values.tolist()

        dict_months = {m: m in given_months for m in range(1, 13)}

        final_result["data"] = [
            {
                "month": m,
                "tmin": result_df.loc[[m]].values.flatten().tolist()[1] if val and
                                                                           result_df.loc[[m]].values.flatten().tolist()[
                                                                               1] != '' else None,
                "tmax": result_df.loc[[m]].values.flatten().tolist()[0] if val and
                                                                           result_df.loc[[m]].values.flatten().tolist()[
                                                                               0] != '' else None
            } for m, val in dict_months.items()
        ]

    if station_id and year and month:
        df['DATA VALUE'] = df['DATA VALUE'].astype(float) / 10
        df_tmax = df[df['ELEMENT'] == 'TMAX']
        df_tmin = df[df['ELEMENT'] == 'TMIN']

        df_tmax = df_tmax[(df_tmax.index.year == int(year)) & (df_tmax.index.month == int(month))]
        df_tmin = df_tmin[(df_tmin.index.year == int(year)) & (df_tmin.index.month == int(month))]

        result_df = pd.concat([df_tmax, df_tmin], axis=1)

        # Change NaN to " " values to reviece Null in JSON
        result_df = result_df.fillna('')

        final_result = {
            "stationId": station_id,
            "data": []
        }

        for index in result_df.index:
            tmax = result_df.loc[[index]].values.flatten().tolist()[1]
            tmin = result_df.loc[[index]].values.flatten().tolist()[3]

            data = {
                "day": index.day,
                "tmin": tmin if tmin != '' else None,
                "tmax": tmax if tmax != '' else None
            }
            final_result["data"].append(data)

    # t2 = time.time()

    # time_download = t1-t0
    # time_calc = t2-t1
    # print(time_download)
    # print(time_calc)
    # print(f"Download: {time_download}. Calc: {time_calc})

    return {
        'statusCode': 200,
        'body': json.dumps(final_result)
    }
