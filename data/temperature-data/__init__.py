import logging
import json
import pandas as pd
from urllib.error import HTTPError
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    logging.info('Python HTTP trigger function processed a request.')
    station_id = req.params.get('stationID')
    year = req.params.get('year')
    month = req.params.get('month')

    if not station_id:
        return func.HttpResponse(
            "Please pass a stationID on the query string",
            status_code=400
        )

    if year:
        try:
            year = int(year)
            # has to be a 4 digit number and between 1763 and 2023 or equal to 1750
            if year < 1750 or year > 2023 or (year < 1763 and year != 1750):
                return func.HttpResponse(
                    "Please pass a valid year on the query string",
                    status_code=400
                )
        except ValueError:
            return func.HttpResponse(
                "Please pass a valid year on the query string",
                status_code=400
            )
    if month:
        try:
            month = int(month)
            if month < 1 or month > 12:
                return func.HttpResponse(
                    "Please pass a valid month on the query string",
                    status_code=400
                )
        except ValueError:
            return func.HttpResponse(
                "Please pass a valid month on the query string",
                status_code=400
            )

    try:
        df = pd.read_csv(f"https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/by_station/{station_id}.csv.gz", header=None,
                         index_col=0, usecols=[1, 2, 3],
                         names=['DATE',
                                'ELEMENT',
                                'DATA VALUE'],
                         parse_dates=['DATE'])
    except HTTPError as e:
        return func.HttpResponse(
            "Station ID not found",
            status_code=404
        )
    except TimeoutError as e:
        return func.HttpResponse(
            "Request timed out",
            status_code=504
        )
    except Exception as e:
        return func.HttpResponse(
            f"An error occured: {e}",
            status_code=500
        )
    if not year and not month:
        df_tmax = df[df['ELEMENT'] == 'TMAX']  # filter for TMAX element
        df_tmax["CALC"] = df_tmax['DATA VALUE'].astype(float) / 10
        df_tmin = df[df['ELEMENT'] == 'TMIN']  # filter for TMIN element
        df_tmin["CALC"] = df_tmin['DATA VALUE'].astype(float) / 10

        df_summer_months_max = df_tmax[(
            df_tmax.index.month >= 6) & (df_tmax.index.month <= 8)]
        df_summer_max = df_summer_months_max.groupby(
            df_summer_months_max.index.year)["CALC"].mean()
        df_summer_months_min = df_tmin[(
            df_tmin.index.month >= 6) & (df_tmin.index.month <= 8)]
        df_summer_min = df_summer_months_min.groupby(
            df_summer_months_min.index.year)["CALC"].mean()

        df_winter_months_max = df_tmax[(
            df_tmax.index.month == 12) | (df_tmax.index.month <= 2)]
        # transfer the year index of the december to the previous year to enable the correct calculation
        df_winter_months_max.index = df_winter_months_max.index.map(
            lambda x: x.replace(year=x.year + 1) if x.month == 12 else x)
        df_winter_max = df_winter_months_max.groupby(
            df_winter_months_max.index.year)["CALC"].mean()
        df_winter_max.index = df_winter_max.index.map(lambda x: x - 1)

        df_winter_months_min = df_tmin[(
            df_tmin.index.month == 12) | (df_tmin.index.month <= 2)]
        # transfer the year index of the december to the previous year to enable the correct calculation
        df_winter_months_min.index = df_winter_months_min.index.map(
            lambda x: x.replace(year=x.year + 1) if x.month == 12 else x)
        df_winter_min = df_winter_months_min.groupby(
            df_winter_months_min.index.year)["CALC"].mean()
        df_winter_min.index = df_winter_min.index.map(lambda x: x - 1)

        df_autumn_months_max = df_tmax[(
            df_tmax.index.month >= 9) & (df_tmax.index.month <= 11)]
        df_autumn_max = df_autumn_months_max.groupby(
            df_autumn_months_max.index.year)["CALC"].mean()
        df_autumn_months_min = df_tmin[(
            df_tmin.index.month >= 9) & (df_tmin.index.month <= 11)]
        df_autumn_min = df_autumn_months_min.groupby(
            df_autumn_months_min.index.year)["CALC"].mean()

        df_spring_months_max = df_tmax[(
            df_tmax.index.month >= 3) & (df_tmax.index.month <= 5)]
        df_spring_max = df_spring_months_max.groupby(
            df_spring_months_max.index.year)["CALC"].mean()
        df_spring_months_min = df_tmin[(
            df_tmin.index.month >= 3) & (df_tmin.index.month <= 5)]
        df_spring_min = df_spring_months_min.groupby(
            df_spring_months_min.index.year)["CALC"].mean()

        yearly_averages_tmax = df_tmax.groupby(
            df_tmax.index.year)['CALC'].mean()
        yearly_averages_tmin = df_tmin.groupby(
            df_tmin.index.year)['CALC'].mean()

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

        # get all relevant years
        given_years = list(set(yearly_averages_tmax.index.values.tolist()).union(
            set(yearly_averages_tmin.index.values.tolist())))
        
        # sort the years
        given_years.sort()

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
            data = {
                "year": y,
                "tmin": None,
                "tmax": None,
                "tmax_summer": None,
                "tmin_summer": None,
                "tmax_winter": None,
                "tmin_winter": None,
                "tmax_autumn": None,
                "tmin_autumn": None,
                "tmax_spring": None,
                "tmin_spring": None
            }
            if dict_years[y] != False:
                data_list = result_df.loc[[y]].values.flatten().tolist()
                for i in range(len(data_list)):
                    if not data_list[i] == '':
                        if i == 0:
                            data["tmax"] = data_list[i]
                        elif i == 1:
                            data["tmin"] = data_list[i]
                        elif i == 2:
                            data["tmax_summer"] = data_list[i]
                        elif i == 3:
                            data["tmin_summer"] = data_list[i]
                        elif i == 4:
                            data["tmax_winter"] = data_list[i]
                        elif i == 5:
                            data["tmin_winter"] = data_list[i]
                        elif i == 6:
                            data["tmax_autumn"] = data_list[i]
                        elif i == 7:
                            data["tmin_autumn"] = data_list[i]
                        elif i == 8:
                            data["tmax_spring"] = data_list[i]
                        elif i == 9:
                            data["tmin_spring"] = data_list[i]
            final_result["data"].append(data)

    if year and not month:
        df['DATA VALUE'] = df['DATA VALUE'].astype(float) / 10
        df_tmax = df[df['ELEMENT'] == 'TMAX']
        df_tmin = df[df['ELEMENT'] == 'TMIN']

        df_tmax = df_tmax[(df_tmax.index.year == int(year))]
        df_tmin = df_tmin[(df_tmin.index.year == int(year))]

        monthly_averages_tmax = df_tmax.groupby(df_tmax.index.month)[
            'DATA VALUE'].mean()
        monthly_averages_tmin = df_tmin.groupby(df_tmin.index.month)[
            'DATA VALUE'].mean()

        result_df = pd.concat(
            [monthly_averages_tmax, monthly_averages_tmin], axis=1)

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

    if year and month:
        df['DATA VALUE'] = df['DATA VALUE'].astype(float) / 10
        df_tmax = df[df['ELEMENT'] == 'TMAX']
        df_tmin = df[df['ELEMENT'] == 'TMIN']

        df_tmax = df_tmax[(df_tmax.index.year == int(year))
                          & (df_tmax.index.month == int(month))]
        df_tmin = df_tmin[(df_tmin.index.year == int(year))
                          & (df_tmin.index.month == int(month))]

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

    return func.HttpResponse(json.dumps(final_result), mimetype="application/json")
