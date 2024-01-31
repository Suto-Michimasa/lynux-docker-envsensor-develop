type Props = {
  noiseValue: number | null;
};

export const getBackgroundColor = ({ noiseValue }: Props): string => {
  if (noiseValue === null) return "bg-slate-400"; // nullの場合の色
  else
  if (noiseValue <= 50) return "bg-lime-300"; // 50以下の場合の色
  else if (noiseValue > 50 && noiseValue <= 70) return "bg-yellow-300"; // 50～70の場合の色
  else if (noiseValue > 70 && noiseValue <= 80) return "bg-orange-300"; // 70～80の場合の色
  else return "bg-red-300"; // 80以上の場合の色
};
