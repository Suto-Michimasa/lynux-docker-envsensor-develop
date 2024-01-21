'use client';

import React, { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { db } from "@/lib/firebase/firebase";

interface SensorData {
  [address: string]: {
    noise: number;
    time: string;
  };
}

const SensorData: React.FC = () => {
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

  return (
    <div>
      {Object.entries(data).map(([address, sensorData]) => (
        <div key={address} style={{ marginBottom: '1rem' }}>
          <h2>{address}</h2>
          <p>Noise: {sensorData.noise}</p>
          <p>Time: {sensorData.time}</p>
        </div>
      ))}
    </div>
  );
};

export default SensorData;
