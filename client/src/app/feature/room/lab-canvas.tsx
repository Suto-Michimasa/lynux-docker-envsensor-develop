'use client'
import React from 'react';
import Image from 'next/image'
import { useWindowSize } from "usehooks-ts";
import { SensorPositions, SensorPosition } from "./data/sensor-position"

const LabCanvas: React.FC = () => {

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
        return (
          <div
            className="absolute rounded-full bg-white w-8 h-8"
            key={sensorNumber}
            style={{
              left: sensor.x * labImageSize.width,
              top: sensor.y * labImageSize.height,
            }}
          >
            <p className="absolute  text-center text-xs" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{sensorNumber}</p>
          </div>
        );
      })}
    </div>
  );
}

export default LabCanvas;