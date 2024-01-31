'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { useWindowSize } from "usehooks-ts";
import { SensorPositions, SensorPosition } from "./data/sensor-position"
import { AddressAndNumber } from "./data/address"
import { ref, child, get } from "firebase/database";
import { db } from "@/lib/firebase/firebase";
import { getBackgroundColor, checkOnline } from "./logic";

interface SensorData {
  [address: string]: {
    noise: number;
    time: string;
  };
}

const LabCanvas: React.FC = () => {
  const [data, setData] = useState<SensorData>({});

  useEffect(() => {
    const fetchData = () => {
      const dbRef = ref(db);
      get(child(dbRef, 'sensor_data')).then((snapshot) => {
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
            className={`absolute rounded-full bg-white  ${backgroundColorClass} w-10 h-10`}
            key={sensorNumber}
            style={{
              left: sensor.x * labImageSize.width,
              top: sensor.y * labImageSize.height,
            }}
          >
            <p className="absolute  text-center text-xs" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{noise}</p>
            <div
              className={`absolute ${circleColorClass} rounded-full`}
              style={{ width: '12px', height: '12px', right: '-1px', top: '-1px' }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}

export default LabCanvas;