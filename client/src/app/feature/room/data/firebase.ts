import { ref, child, get } from "firebase/database";
import { db } from "@/lib/firebase/firebase";
import { isBefore, isWithinInterval, subHours } from "date-fns";

interface NoiseData {
  noise: number;
}

interface FirebaseData {
  [key: string]: NoiseData;
}
export const fetchLastHourData = async (address: string):Promise<FirebaseData>=> {
  const now = new Date();
  const oneHourAgo = subHours(now, 1);
  const dbRef =  ref(db);

  const snapshot = await get(child(dbRef, 'log_data/' + address))
  const data = snapshot.val();
  const filteredData: FirebaseData = {};
  for (const key in data) {
    const isoString = key.replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})\d{3}/, 'T$1:$2:$3.$4');
    // Dateオブジェクトに変換
    const date = new Date(isoString);
    
    if (isWithinInterval(date, { start: oneHourAgo, end: now })) {
      
      filteredData[isoString] = data[key];
    }
  }
  return filteredData
};

interface ChartData {
  time: string;
  noise: number;
}

export const transformData = (data: FirebaseData): ChartData[] => {
  return Object.entries(data).map(([key, value]) => ({
    time: key,
    noise: value.noise
  }));
};