// NoiseChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
interface NoiseData {
  time: string;
  noise: number;
}

// コンポーネントのpropsの型を指定します
interface NoiseChartProps {
  data: NoiseData[];
}
const NoiseChart: React.FC<NoiseChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis dataKey="noise" />
        <Line dataKey="noise" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NoiseChart;
