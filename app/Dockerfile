FROM python:2.7-onbuild

RUN apt-get update && apt-get install -y \
    gcc \
    bluez \
    python-bluez \
    python-dev \
    libbluetooth3-dev

RUN pip install pybluez

CMD [ "python", "./envsensor_observer.py" ]
