'use client'
import React, { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { db } from "@/lib/firebase/firebase";
import './sensorData.css';
// Define a type for your Firebase data
interface SensorDataItem {
  noise: number;
  time: string;
}

interface SensorData {
  [address: string]: SensorDataItem;
}

interface AnimatedSensorData extends SensorData {
  [address: string]: SensorDataItem & { animate: boolean };
}

const SensorData: React.FC = () => {
  const [data, setData] = useState<AnimatedSensorData>({});

  useEffect(() => {
    const fetchData = () => {
      const dbRef = ref(db);
      get(child(dbRef, 'sensor_data')).then((snapshot) => {
        if (snapshot.exists()) {
          // Use a type assertion here
          const newData = snapshot.val() as SensorData;
          const animatedData = Object.entries(newData).reduce((acc, [address, sensorData]) => {
            // Check if data has changed to trigger animation
            acc[address] = {
              ...sensorData,
              animate: data[address] && (data[address].noise !== sensorData.noise || data[address].time !== sensorData.time)
            };
            return acc;
          }, {} as AnimatedSensorData);
          setData(animatedData);
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div>
      {Object.entries(data).map(([address, sensorData]) => (
        <div key={address} className={'sensor'}>
          <h2>{address}</h2>
          <p className={sensorData.animate ? 'animate-text-change' : ''}>Noise: {sensorData.noise}</p>
          <p className={sensorData.animate ? 'animate-text-change' : ''}>Time: {sensorData.time}</p>
        </div>
      ))}
    </div>
  );
};

export default SensorData;
