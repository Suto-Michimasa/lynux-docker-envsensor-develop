#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
sys.path.append('../')
import argparse
import time

from bluepy.btle import Peripheral, BTLEException

from omron.sensor_class import ReadFlashMemoryStatus, RequestAdvertiseSetting 


def connect(addr: str, max_retry=5, retry_interval_sec=1) -> Peripheral:
    ble_peripheral = None
    is_connected = False
    for i in range(max_retry):
        try:
            print(f'connecting to {addr} {i + 1}/{max_retry}')
            ble_peripheral = Peripheral(deviceAddr=addr, addrType="random")
        except BTLEException as e:
            print(f'ERROR: try {i + 1}: BTLE Exception while connecting ')
            print(f'ERROR:   type:' + str(type(e)))
            print(f'ERROR:   args:' + str(e.args))
            time.sleep(retry_interval_sec)
        else:
            is_connected = True
            print(f'connected.')
            return ble_peripheral

    if not is_connected:
        print(f"ERROR: connect failed.")
        raise Exception(F"BTLE connect to {addr} failed.")


def write_advertise_setting(ble_peripheral: Peripheral):
    request_advertise_setting = RequestAdvertiseSetting()
    ble_service = ble_peripheral.getServiceByUUID(uuidVal=request_advertise_setting.serviceUuid)
    ble_char = ble_service.getCharacteristics(forUUID=request_advertise_setting.uuid)[0]

    # advertise_intervalとadvertise_modeを指定して、encode_data()に渡す
    advertise_interval = 500

    advertise_mode = 1
    write_value = request_advertise_setting.encode_data(advertise_interval, advertise_mode)
    print(f'write_advertise_setting(advertise_interval={advertise_interval}, advertise_mode={advertise_mode}) write_value={write_value}')
    ble_char.write(write_value)


# LatestTimeCounterをリクエストする
def main():
    parser = argparse.ArgumentParser(description='OMRONの環境センサーの設定をメモリ書込モードに変更します')
    parser.add_argument("--addr", required=True, type=str, help='環境センサーのMACアドレスを指定する')

    args = parser.parse_args()

    # 環境センサーに接続する
    ble_peripheral = connect(addr=args.addr)

    # LatestTimeCounterを書き込む
    write_advertise_setting(ble_peripheral)

    # flash memoryの書き込み状態を確認する
    read_flash_memory_status = ReadFlashMemoryStatus()
    service = ble_peripheral.getServiceByUUID(uuidVal=read_flash_memory_status.serviceUuid)
    ble_char = service.getCharacteristics(forUUID=read_flash_memory_status.uuid)[0]
    raw_data = ble_char.read()
    read_flash_memory_status.parse(raw_data)

    print(f"read_flash_memory_status={read_flash_memory_status.to_dict()}")


if __name__ == "__main__":
    main()
