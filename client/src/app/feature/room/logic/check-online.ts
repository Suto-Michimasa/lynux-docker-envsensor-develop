import { parseISO, differenceInMinutes } from 'date-fns';
type Props = {
  sensorTime: string | null;
};

export const checkOnline = ({ sensorTime }: Props): boolean => {
  if (sensorTime === null) return false;
  const now = new Date();
  const sensorTimeDate = parseISO(sensorTime);
  const diff = differenceInMinutes(now, sensorTimeDate);
  if (diff <= 1) return true;
  else return false;
};