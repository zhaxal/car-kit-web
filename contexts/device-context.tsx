import { createContext, ReactNode, useContext, useState } from "react";
import { useTripDoc } from "../components/hooks/trip";
import { Avl, Device } from "../firebase/models/Device";
import { Trip } from "../firebase/models/Trip";

type DeviceProviderProps = {
  children: ReactNode;
  lastPacket: Avl;
  device: Device;
  IMEI: string;
  trips: Trip[];
};

const DeviceContext = createContext({
  lastPacket: {} as Avl,
  device: {} as Device,
  trips: {} as Trip[],
  trip: {} as Trip | null,
  IMEI: {} as string,
  packets: [] as Avl[],
  updateTrip: (trip: Trip | null) => {},
});

export const useDeviceContext = () => {
  return useContext(DeviceContext);
};

export const DeviceProvider = ({
  children,
  lastPacket,
  IMEI,
  device,
  trips,
}: DeviceProviderProps) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const { packets } = useTripDoc(trip?.id as string, IMEI as string);

  const updateTrip = (trip: Trip | null) => {
    setTrip(trip);
  };

  const value = {
    lastPacket,
    device,
    IMEI,
    trips,
    trip,
    updateTrip,
    packets,
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};
