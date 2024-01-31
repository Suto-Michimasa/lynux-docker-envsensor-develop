export type SensorPosition = {
  x: number;
  y: number;
  number: number; // センサ番号
};

type Option = {
  deltaX: number; // 横方向の差分
  count: number; // 個数
  x1: number; // xの初期値
  y: number; // yの値
  sensorPositionNumber: number; // sensorPositionNumberの初期値
};

const createSensorPositions = ({ count, deltaX, sensorPositionNumber, x1, y }: Option): SensorPosition[] => {
  const sensorPositions: SensorPosition[] = [];
  for (let i = 0; i < count; i++) {
    sensorPositions.push({
      number: sensorPositionNumber + i,
      x: x1 + deltaX * i,
      y: y,
    });
  }
  return sensorPositions;
};

/** センサ情報 */
export const SensorPositions: SensorPosition[] = [
  // センサ番号1-5
  ...createSensorPositions({
    count: 4,
    deltaX: 0.208,
    sensorPositionNumber: 1,
    x1: 0.1,
    y: 0.02,
  }),

  // センサ番号6-10
  ...createSensorPositions({
    count: 7,
    deltaX: 0.178,
    sensorPositionNumber: 6,
    x1: 0.045,
    y: 0.28,
  }),
  
  // センサ番号11-15
  {
    number: 11,
    x: 0.080,
    y: 0.63,
  },

  {
    number: 12,
    x: 0.25,
    y: 0.63,
  },

  {
    number: 13,
    x: 0.376,
    y: 0.63,
  },

  {
    number: 14,
    x: 0.565,
    y: 0.63,
  },
];
