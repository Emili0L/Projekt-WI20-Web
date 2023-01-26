# Projekt-WI20-Web

![Contributors](https://img.shields.io/github/contributors/Emili0L/Projekt-WI20-Web?color=dark-green) ![License](https://img.shields.io/github/license/Emili0L/Projekt-WI20-Web) ![Deployment](https://vercelbadge.vercel.app/api/Emili0L/Projekt-WI20-Web)


- [Projekt-WI20-Web](#projekt-wi20-web)
  - [Problem statement](#problem-statement)
  - [Main objective](#main-objective)
  - [Dataset description](#dataset-description)
  - [Proposal](#proposal)
    - [Technologies](#technologies)
    - [Repository organization](#repository-organization)
    - [Solution](#solution)
  - [Results](#results)
      - [Live production demo:](#live-production-demo)
  - [License](#license)

## Problem statement
Global historical weather data is large, collected from year 1763 until today. There are over 160K weather stations across the world, each of them generating several observations on a daily basis. This sum up a total of more than 1.75B observations.  
The data is also not ready to perform analytics tasks over the entire dataset or those requiring geolocation information.
All that information has to be processed (ELT) to enable analytics tasks using information from several years, locations, observation date and type and so on  
As an example:  
- Max daily temperature in France (over all territory) in 1992.
- Plot a comparison of the main daily minimum temperature by year between NewYork and Miami.
- Overall ten hottest days in Madrid.
It is advisable that joins and aggregations will be needed for such kind of analysis.

## Main objective
Develop the data infrastructure including data pipeline and dashboard for users to perform advanced analytics tasks on the global historical weather data:
- Select a dataset.
- Create a pipeline for processing this dataset and putting it to a data-lake.
- Create a pipeline for moving the data from the lake to a data warehouse.
- Transform the data in the data warehouse: prepare it for the frontend.
- Create a frontend to view the dashboard.

## Dataset description

> The Global Historical Climatology Network (GHCN) is an integrated database of climate summaries from land surface stations across the globe that have been subjected to a common suite of quality assurance reviews. The data are obtained from more than 20 sources. Some data are more than 175 years old while others are less than an hour old. GHCN is the official archived dataset, and it serves as a replacement product for older NCEI-maintained datasets that are designated for daily temporal resolution

The [Global Historical Climatology Network - Daily](https://github.com/awslabs/open-data-docs/tree/main/docs/noaa/noaa-ghcn) is a dataset from NOAA that contains daily observations over global land areas (e.g. TMAX, SNOW...). It contains station-based observations from land-based stations worldwide. It is updated daily. The data is in CSV format. Each file corresponds to a year from 1763 to present and is named as such.  
Each file contains all weather observations from all the stations for all days in that year.  
Data description of the stations and countries, including geolocation, are available in a separate files.  

Information of all stations is stored in a specific file.
File format examples:
- http://noaa-ghcn-pds.s3.amazonaws.com/csv.gz/1788.csv.gz
- http://noaa-ghcn-pds.s3.amazonaws.com/ghcnd-stations.txt

Observation format:
- ID = 11 character station identification code
- YEAR/MONTH/DAY = 8 character date in YYYYMMDD format (e.g. 19860529 = May 29, 1986)
- ELEMENT = 4 character indicator of element type:
  - PRCP = Precipitation (tenths of mm)
  - SNOW = Snowfall (mm)
	- SNWD = Snow depth (mm)
  - TMAX = Maximum temperature (tenths of degrees C)
  - TMIN = Minimum temperature (tenths of degrees C)
- DATA VALUE = 5 character data value for ELEMENT 
- M-FLAG = 1 character Measurement Flag 
- Q-FLAG = 1 character Quality Flag 
- S-FLAG = 1 character Source Flag 
- OBS-TIME = 4-character time of observation in hour-minute format (i.e. 0700 =7:00 am

Format of ghcnd-stations.txt  
- Variable   Columns   Type
- ID            1-11   Character
- LATITUDE     13-20   Real
- LONGITUDE    22-30   Real
- ELEVATION    32-37   Real
- STATE        39-40   Character
- NAME         42-71   Character
- GSN FLAG     73-75   Character
- HCN/CRN FLAG 77-79   Character
- WMO ID       81-85   Character

Format of ghcnd-countries.txt  
- Variable   Columns   Type
- CODE          1-2    Character
- NAME         4-50    Character

## Proposal

### Technologies
- Infrastructure as code (IaC): Terraform
- Nextjs (Reactjs) for the frontend

### Repository organization
- \airflow: airflow files (docker-compose.yaml, Dockerfile, requirements, dags folder, etc.).  
- \assets: pictures.   
- \infra: terraform files for the definition of the infrastructure to deploy.  
- \README.md: this document.  

### Solution

<p align="left">
  <img alt="solution" src="./assets/solution.jpg" width=100%>
</p>

## Results


#### Live production demo:

> View the live demo at
- **[Production](https://projekt-wi-20-web.vercel.app/explore)**



## License

This project uses MIT license: [License](LICENSE)
