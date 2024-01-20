#!/home/suto/.pyenv/shims/python  python

import os
from dotenv import load_dotenv

dotenv_path = '../.env'
load_dotenv(dotenv_path)

# envsensor_observer configuration ############################################

# Bluetooth adaptor
BT_DEV_ID = 0

# time interval for sensor status evaluation (sec.)
CHECK_SENSOR_STATE_INTERVAL_SECONDS = 20
INACTIVE_TIMEOUT_SECONDS = 60
# Sensor will be inactive state if there is no advertising data received in
# this timeout period.


# csv output to local file system
CSV_OUTPUT = False
# the directory path for csv output
CSV_DIR_PATH = os.path.dirname(os.path.abspath(__file__)) + "/log"


# use fluentd forwarder
FLUENTD_FORWARD = False
# fluent-logger-python
FLUENTD_TAG = "xxxxxxxx"  # enter "tag" name
FLUENTD_ADDRESS = "localhost"  # enter "localhost" or IP address of remote fluentd
FLUENTD_PORT = 24224  # enter port number of fluent daemon

# fluent-plugin-influxdb (when using influxDB through fluentd.)
FLUENTD_INFLUXDB = False
FLUENTD_INFLUXDB_ADDRESS = "xxx.xxx.xxx.xxx"  # enter IP address of Cloud Server
FLUENTD_INFLUXDB_PORT_STRING = "8086"  # enter port number string of influxDB
FLUENTD_INFLUXDB_DATABASE = "xxxxxxxx"  # enter influxDB database name


# uploading data to the cloud (required influxDB 0.9 or higher)
INFLUXDB_OUTPUT = True
# InfluxDB
INFLUXDB_URL = "http://172.16.4.127:8086"
INFLUXDB_BUCKET = "omron"  # enter influxDB database name
INFLUXDB_TOKEN = os.environ.get("INFLUXDB_TOKEN")  # enter measurement name
INFLUXDB_MEASUREMENT = "sensor_data"  
INFLUXDB_ORG="humanophilic"
INFLUXDB_USER = os.getenv("INFLUXDB_USERNAME")  # enter influxDB username
INFLUXDB_PASSWORD = os.getenv("INFLUXDB_PASSWORD")  # enter influxDB user password
