

#Author: Chris Hattub

#Script that concurrently downloads all data from NOAA API

#TODO: Fix bug where not all stations are found for VT and NH.





import requests
import csv
import time

from datetime import date
import argparse
import random
import concurrent.futures
from tenacity import retry, wait_random_exponential, stop_after_attempt, retry_if_exception_type, stop_after_delay, \
    wait_fixed


@retry(
    wait=wait_fixed(0.2) + wait_random_exponential(multiplier=0.1, max=2),  # Wait 0.2 seconds between retries with additional exponential backoff
    stop=stop_after_delay(60),  # Stop after 60 seconds
    retry=retry_if_exception_type(requests.exceptions.RequestException)  # Retry only for request exceptions
)
def make_request_with_retry(url, headers, params):
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response

API_BASE_URL = "https://www.ncei.noaa.gov/cdo-web/api/v2/{endpoint}"
API_KEY = "ENTER KEY"
STATE = "NH"  # Default State
DATA_TYPES = ["TAVG", "TMAX", "TMIN", "TOBS"]
START_YEAR = 2010

END_YEAR = date.today().year
OUTPUT_FILE = "massachusetts_temperature_data.csv"

HEADERS = {"token": API_KEY}

def fetch_stations_page(offset, params):
    url = API_BASE_URL.format(endpoint="stations")
    params["offset"] = offset
    max_retries = 5
    backoff_factor = 2
    retries = 0

    while retries < max_retries:
        response = requests.get(url, headers=HEADERS, params=params)
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 503 or response.status_code == 429:
            wait_time = (backoff_factor ** retries) + random.uniform(0, 0.1)
            print(
                f"Error getting stations (status code: {response.status_code}). Retrying in {wait_time:.2f} seconds...")
            time.sleep(wait_time)
            retries += 1
        else:
            print(f"Error getting stations (status code: {response.status_code}): {response.text}")
            break
    return None


def get_stations(state):
    params = {
        "datasetid": "GHCND",
        "locationid": f"FIPS:{state}",
        "limit": 1000,
    }

    stations = []
    offset = 1
    while True:
        station_data = fetch_stations_page(offset, params)
        if station_data is None or "results" not in station_data:
            break
        stations.extend(station_data["results"])

        metadata = station_data.get("metadata")
        if metadata:
            resultset = metadata.get("resultset")
            if resultset:
                count = resultset.get("count")
                if count and count <= offset + len(station_data["results"]) - 1:
                    break

        offset += params["limit"]

    return stations




def download_data_for_station_year(station_id, data_type, year):
    endpoint = "data"
    url = API_BASE_URL.format(endpoint=endpoint)
    data = {}

    params = {
        "datasetid": "GHCND",
        "datatypeid": data_type,
        "stationid": station_id,
        "startdate": f"{year}-01-01",
        "enddate": f"{year}-12-31",
        "limit": 1000,
    }
    offset = 1

    while True:
        params["offset"] = offset
        try:
            response = make_request_with_retry(url, headers=HEADERS, params=params)
            data_response = response.json()
            if "results" in data_response:
                for result in data_response["results"]:
                    date = result["date"][:10]
                    if date not in data:
                        data[date] = {}
                    data[date][data_type] = result["value"]

                if data_response["metadata"]["resultset"]["count"] > offset + data_response["metadata"]["resultset"][
                    "limit"] - 1:
                    offset += data_response["metadata"]["resultset"]["limit"]
                else:
                    break
            else:
                break
        except requests.exceptions.RequestException as e:
            if e.response.status_code == 429:
                print(
                    f"Encountered a rate limit error for {station_id} and {year}. Retrying with exponential backoff...")
            elif e.response.status_code == 503:
                print(
                    f"Encountered a temporary error for {station_id} and {year}. Retrying with exponential backoff...")
            else:
                print(
                    f"Error getting data for {station_id} and {year} (status code: {e.response.status_code}): {e.response.text}")
                break
        time.sleep(1)

    return data


def download_data_for_station(station, data_types, start_year, end_year):
    station_data = {
        "latitude": station["latitude"],
        "longitude": station["longitude"],
        "elevation": station["elevation"],
        "data": {},
    }

    with concurrent.futures.ThreadPoolExecutor() as executor:
        station_id = station["id"]
        for data_type in data_types:
            year_data_futures = {}
            for year in range(start_year, end_year + 1):
                future = executor.submit(download_data_for_station_year, station_id, data_type, year)
                year_data_futures[future] = year

            for future in concurrent.futures.as_completed(year_data_futures):
                year_data = future.result()
                for date, values in year_data.items():
                    if date not in station_data["data"]:
                        station_data["data"][date] = {}
                    station_data["data"][date].update(values)

    return station_id, station_data


def download_data(station_info, data_types, start_year, end_year):
    all_data = {}

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(download_data_for_station, station, data_types, start_year, end_year) for
                   station in station_info]
        for future in concurrent.futures.as_completed(futures):
            station_id, station_data = future.result()
            all_data[station_id] = station_data

    return all_data


def write_data_to_csv(data, output_file):
    fieldnames = ["STATION", "LATITUDE", "LONGITUDE", "ELEVATION", "DATE", "TAVG", "TMAX", "TMIN",
                  "TOBS"]

    with open(output_file, mode="w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for station_id, station_data in data.items():
            for date, values in station_data["data"].items():
                row = {
                    "STATION": station_id,
                    "LATITUDE": station_data["latitude"],
                    "LONGITUDE": station_data["longitude"],
                    "ELEVATION": station_data["elevation"],
                    "DATE": date,
                    "TAVG": values.get("TAVG"),
                    "TMAX": values.get("TMAX"),
                    "TMIN": values.get("TMIN"),
                    "TOBS": values.get("TOBS"),
                }
                writer.writerow(row)


def parse_arguments():
    parser = argparse.ArgumentParser(description="Download weather data for a specific state.")
    parser.add_argument("state", help="The two-letter state abbreviation ('MA')")
    args = parser.parse_args()
    return args


def main(state):
    print("Retrieving station IDs and information...")
    station_info = get_stations(state)
    print(f"Found {len(station_info)} stations.")

    print("Downloading data...")
    data = download_data(station_info, DATA_TYPES, START_YEAR, END_YEAR)
    print(f"Downloaded data for {len(data)} stations.")

    output_file = f"{state.lower()}_temperature_data.csv"
    print("Writing data to CSV...")
    write_data_to_csv(data, output_file)
    print("Done.")


if __name__ == "__main__":
    args = parse_arguments()
    main(args.state)
