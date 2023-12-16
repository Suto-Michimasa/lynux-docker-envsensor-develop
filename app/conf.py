#!/usr/bin/python

import os

# envsensor_observer configuration ############################################

# Bluetooth adaptor
BT_DEV_ID = 0

# time interval for sensor status evaluation (sec.)
CHECK_SENSOR_STATE_INTERVAL_SECONDS = 300
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
INFLUXDB_ADDRESS = "127.0.0.1"  # enter IP address of influxDB
INFLUXDB_PORT = 8086  # enter port number of influxDB
INFLUXDB_DATABASE = "lynx"  # enter influxDB database name
INFLUXDB_MEASUREMENT = "envsensor"  # enter measurement name
INFLUXDB_USER = os.environ.get('INFLUXDB_USERNAME')  # enter influxDB username
INFLUXDB_PASSWORD = os.environ.get('INFLUXDB_PASSWORD')  # enter influxDB user password
