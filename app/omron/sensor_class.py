#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Omron 環境センサーから生データを読み出して、加工するためのクラス
import struct
from abc import ABCMeta, abstractmethod
from datetime import datetime
from typing import List

from bluepy.btle import UUID


class OmronEnvSensorBLEChara(metaclass=ABCMeta):
    """
    Omron環境センサーのBLE Characteristicsを扱うための基礎クラス

    """

    def __init__(self, short_uuid: int):
        self._shortUUID = short_uuid
        self._char_uuid = UUID('%08X-0A3A-11E8-BA89-0ED5F89F718B' % (0xAB700000 + short_uuid))
        self._service_uuid = UUID('%08X-0A3A-11E8-BA89-0ED5F89F718B' % (0xAB700000 + (0xFFF0 & short_uuid)))

    @property
    def shortUuid(self) -> int:
        """
        環境センサーのBLE Characteristicsの短いuuidを返す
        Returns
        -------
        uuid:int
            BLE Characteristicsの短いuuid
        """
        return self._shortUUID

    @property
    def uuid(self) -> UUID:
        """
        環境センサーのBLE Characteristicsのフルuuidを返す
        Returns
        -------
        uuid: UUID
            BLE Characteristicsのフルuuid
        """
        return self._char_uuid

    @property
    def serviceUuid(self) -> UUID:
        """
        環境センサーのBLE Characteristicsの親になっているBLE Serviceのフルuuidを返す
        Returns
        -------
        uuid: UUID
            BLE Characteristicsの親になっているBLE Serviceのフルuuidを返す
        """

        return self._service_uuid

    @abstractmethod
    def parse(self, raw_data: bytes):
        pass

    @abstractmethod
    def to_dict(self) -> dict:
        pass


# noinspection SpellCheckingInspection
class OmronLatestData(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのLatest Dataを扱うクラス
    """
    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5012)
        self.sequence_number = None
        self.temperature = None
        self.humidity = None
        self.light = None
        self.barometric_pressure = None
        self.noise = None
        self.eTVOC = None
        self.eCO2 = None

    def parse(self, raw_data: bytes):
        (seq, temp, humid, light, press, noise,
         eTVOC, eCO2) = struct.unpack('<BhhhIhhh', raw_data)

        self.sequence_number = seq
        self.temperature = temp / 100
        self.humidity = humid / 100
        self.light = light
        self.barometric_pressure = press / 10
        self.noise = noise / 100
        self.eTVOC = eTVOC / 100
        self.eCO2 = eCO2 / 1000

        return self

    def __str__(self):
        tmp = self.to_dict()
        return f'{tmp}'

    def to_dict(self) -> dict:
        return dict(sequence_number=self.sequence_number,
                    temperature=self.temperature,
                    humidity=self.humidity,
                    light=self.light,
                    barometric_pressure=self.barometric_pressure,
                    noise=self.noise,
                    eTVOC=self.eTVOC,
                    eCO2=self.eCO2
                    )

class ReadMemoryIndex(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRead Memory Indexを扱うクラス
    """

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5004)
        self.latest_memory_index = None
        self.last_memory_index = None

    def parse(self, raw_data: bytes):
        (self.latest_memory_index, self.last_memory_index) = struct.unpack('<LL', raw_data)
        return self

    def __str__(self):
        tmp = self.to_dict()
        return f'{tmp}'

    def to_dict(self) -> dict:
        return dict(latest_memory_index=self.latest_memory_index,
                    last_memory_index=self.last_memory_index
                    )


class RequestMemoryIndex(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRequest Memory Indexを扱うクラス
        0-3 Memory Index (Start) UInt32 Range 0x00000001 to 0x7FFFFFFF
        4-7 Memory Index (End)   UInt32 Range 0x00000001 to 0x7FFFFFFF
        8 Data Type              UInt8  0x00: Sensing Data
    """

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5005)

    def parse(self, raw_data: bytes):
        self.start_index = struct.unpack('<L', raw_data[0:4])[0]
        self.end_index = struct.unpack('<L', raw_data[4:8])[0]
        self.data_type = struct.unpack('<B', raw_data[8:9])[0]

    @staticmethod
    def encode_data(start_index: int, end_index: int, data_type: int) -> bytes:
        return struct.pack("<LLB", start_index, end_index, data_type)

    def to_dict(self):
        return dict(start_index=self.start_index,
                    end_index=self.end_index,
                    data_type=self.data_type
                    )
                    

class ReadLatestTimeCounter(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRead Latest Time Counterを扱うクラス
    """

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5201)
        self.time_counter = None

    def parse(self, raw_data: bytes):
        self.time_counter = struct.unpack('<Q', raw_data)[0]
        return self

    def __str__(self):
        tmp = self.to_dict()
        return f'{tmp}'

    def to_dict(self):
        return dict(time_counter=self.time_counter)


class RequestLatestTimeCounter(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRequest Latest Time Counterを扱うクラス
        Range 0x1 to 0xFFFFFFFFFFFFFFFF
    """

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5202)

    def parse(self, raw_data: bytes):
        self.time_setting = struct.unpack('<Q', raw_data)[0]

    @staticmethod
    def encode_data(time_setting: int) -> bytes:
        return struct.pack("<Q", time_setting)

    def to_dict(self):
        return dict()

class RequestMemoryStorageInterval(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRequest Memory Storage Intervalを扱うクラス
        Range 0x0001 to 0x0E10 (1 to 3600 seconds)
    """

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5203)

    def parse(self, raw_data: bytes):
        self.time_interval = struct.unpack('<H', raw_data)[0]

    @staticmethod
    def encode_data(time_interval: int) -> bytes:
        return struct.pack("<H", time_interval)

    def to_dict(self):
        return dict()



class RequestAdvertiseSetting(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRequest Advertise Settingを扱うクラス
        0-1 Advertise Interval   UInt16 Range 0x00A0 to 0x4000 (100 to 16384 milliseconds)
        2 Advertise Mode      UInt8  
    """

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5115)

    def parse(self, raw_data: bytes):
        self.advertise_interval = struct.unpack('<H', raw_data[0:2])[0]
        self.advertise_mode = struct.unpack('<B', raw_data[2:3])[0]
        return self

    @staticmethod
    def encode_data(advertise_interval: int, advertise_mode: int) -> bytes:
        return struct.pack("<HB", advertise_interval, advertise_mode)

    def to_dict(self):
        return dict(advertise_interval=self.advertise_interval,
                    advertise_mode=self.advertise_mode
                    )

class ReadFlashMemoryStatus(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRead Flash Memory Statusを扱うクラス
        0 Flash Memory Status UInt8 0x00: NONE, 0x01: Writing, 0x02: Write Success, 0x03: Write failure, 0x04: Flash memory erasing
"""

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5403)

    def parse(self, raw_data: bytes):
        self.flash_memory_status = struct.unpack('<B', raw_data)[0]
        return self

    def __str__(self):
        tmp = self.to_dict()
        return f'{tmp}'

    def to_dict(self):
        return dict(flash_memory_status=self.flash_memory_status)


class RequestMemoryReset(OmronEnvSensorBLEChara):
    """
        Omron環境センサーのRequest Memory Resetを扱うクラス
        0 Memory Reset UInt8 0x01: Sensing data area
    """

    def __init__(self):
        OmronEnvSensorBLEChara.__init__(self, 0x5116)

    def parse(self, raw_data: bytes):
        self.memory_reset = struct.unpack('<B', raw_data)[0]
        return self

    @staticmethod
    def encode_data(memory_reset: int) -> bytes:
        return struct.pack("<B", memory_reset)

    def to_dict(self):
        return dict(memory_reset=self.memory_reset)
