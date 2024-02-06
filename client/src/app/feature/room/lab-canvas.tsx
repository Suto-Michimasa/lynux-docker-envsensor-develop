'use client'
import React, { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import Image from 'next/image'
import { useWindowSize } from "usehooks-ts";
import { format, parseISO } from 'date-fns';

import { db } from "@/lib/firebase/firebase";
import { SensorPositions, SensorPosition } from "./data/sensor-position"
import { AddressAndNumber } from "./data/address"
import NoiseChart from "./noise-chart";
import { fetchLastHourData, transformData } from './data/firebase';
import { getBackgroundColor, checkOnline } from "./logic";
import Modal from './modal';

interface SensorData {
  [address: string]: {
    noise: number;
    time: string;
  };
}

const LabCanvas: React.FC = () => {
  const [data, setData] = useState<SensorData>({});
  const [open, setOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<{
    address: string;
    noise: number;
    time: string;
  } | null>(null);
  const [chartData, setChartData] = useState<{ time: string; noise: number }[]>([]);
  // modalを展開した際に詳細データを表示する

  const openModal = async (address: string) => {
    setOpen(true);
    const detail = data[address];
    setSelectedSensor({
      address,
      noise: Number(Number(detail.noise).toFixed(2)),
      time: format(parseISO(detail.time), 'yyyy/MM/dd HH:mm:ss'),
    });

    try {
      const rawData = await fetchLastHourData(address);
      if (rawData) {
        // 取得したデータを変換
        const chartData = transformData(rawData);
        setChartData(chartData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    const fetchData = () => {
      const dbRef = ref(db);
      get(child(dbRef, 'realtime_data')).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setData(data);
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const labImageAspectRatio = 3960 / 2225;
  const { height, width } = useWindowSize();
  // 研究室画像サイズ
  const labImageWidth = labImageAspectRatio * height;
  const labImageHeight = width / labImageAspectRatio;
  const labImageSize = {
    height: labImageWidth > width ? height : labImageHeight,
    width: labImageWidth > width ? labImageWidth : width,
  };
  return (
    <div
      className="select-none overflow-y-hidden relative"
      style={labImageSize}
    >
      <Image
        alt="labImage"
        draggable={false}
        height={labImageSize.height}
        layout="intrinsic"
        loading="eager"
        priority={true}
        src={'/img/lab_v2.webp'}
        width={labImageSize.width}
      />
      {SensorPositions.map((sensor: SensorPosition) => {
        const sensorNumber = sensor.number;
        const address = AddressAndNumber.find((addressAndNumber) => addressAndNumber.number === sensorNumber)?.address || '';
        const noise = data[address] ? Math.floor(data[address]?.noise) : null;
        const time = data[address] ? data[address]?.time : null;
        const backgroundColorClass = getBackgroundColor({ noiseValue: noise });
        const isOnline = checkOnline({ sensorTime: time });
        const circleColorClass = isOnline ? 'bg-green-500' : 'bg-red-500';
        return (
          <div
            className={`absolute rounded-full ${backgroundColorClass} w-10 h-10`}
            key={sensorNumber}
            style={{
              left: sensor.x * labImageSize.width,
              top: sensor.y * labImageSize.height,
            }}
            onClick={() => openModal(address)}
          >
            <p className="absolute  text-center text-xs" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{noise}</p>
            <div
              className={`absolute ${circleColorClass} rounded-full`}
              style={{ width: '12px', height: '12px', right: '-1px', top: '-1px' }}
            ></div>
          </div>
        );
      })}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <p className="text-xl">センサー詳細</p>
          <hr className="border-t-solid border-1 border-grey" />
          {selectedSensor ? (
            <>
              <p className="text-lg">番号: {selectedSensor.address}</p>
              <p className="text-lg">時間: {selectedSensor.time}</p>
              <p className="text-lg">音量: {selectedSensor.noise} (db)</p>
            </>
          ) : (
            <p className="text-lg">No sensor data available.</p>
          )}
          <NoiseChart data={chartData} />
          <hr className="border-t-solid border-1 border-grey" />
          <div className="flex flex-row justify-center">
            <button
              className="border border-sky-300 rounded-lg py-1.5 px-10
               bg-sky-500 hover:bg-sky-600 text-white"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LabCanvas;