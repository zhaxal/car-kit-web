/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import {
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSnackbar } from "../../contexts/snackbar-context";
import { devicesCol, packetsCol } from "../../firebase/client";

import { Avl, Device } from "../../firebase/models/Device";

const useDevice = () => {
  const { data: session } = useSession();
  const { updateSnackbar } = useSnackbar();

  const deleteDevice = (deviceId: string) => {
    if (!session) {
      return;
    }

    const userId = session.user.id;

    axios
      .delete(`/api/user/${userId}/device/${deviceId}`)
      .then((res) => {
        updateSnackbar(true, "success", res.data);
      })
      .catch((err) => {
        if (err.response) {
          updateSnackbar(true, "error", err.response.data);
        } else {
          updateSnackbar(true, "error", err.message);
        }
      });
  };

  const addDevice = (data: Device) => {
    if (!session) {
      return;
    }

    const userId = session.user.id;
    axios
      .post(`/api/user/${userId}/device`, data)
      .then((res) => {
        updateSnackbar(true, "success", res.data);
      })
      .catch((err) => {
        if (err.response) {
          updateSnackbar(true, "error", err.response.data);
        } else {
          updateSnackbar(true, "error", err.message);
        }
      });
  };

  return { deleteDevice, addDevice };
};

const useDevicesCol = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      return;
    }

    const unsubscribe = onSnapshot(devicesCol, (docs) => {
      const devices: Device[] = [];

      docs.forEach((doc) => {
        const device = doc.data();

        if (!device.owner) {
          return;
        }

        if (device?.owner.includes(session.user.id)) {
          devices.push(device);
        }
      });

      setDevices(devices);
    });

    return function cleanup() {
      unsubscribe();
    };
  }, [session]);

  return { devices };
};

const useDeviceDoc = (deviceId: string) => {
  const [device, setDevice] = useState<Device>({} as Device);
  const [packets, setPackets] = useState<Avl[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !deviceId) {
      return;
    }

    const unsubscribeDevice = onSnapshot(doc(devicesCol, deviceId), (doc) => {
      if (!doc.exists) {
        return;
      }
      const device = doc.data();

      if (!device!.owner) {
        return;
      }

      if (device?.owner.includes(session.user.id)) {
        setDevice(device);
      }
    });

    const q = query(packetsCol(deviceId), orderBy("Time", "desc"), limit(1));

    const unsubscribePackets = onSnapshot(q, (docs) => {
      const packets: Avl[] = [];

      docs.forEach((doc) => {
        let packet = doc.data();

        packets.push(packet);
      });

      setPackets(packets);
    });

    return function cleanup() {
      unsubscribeDevice();
      unsubscribePackets();
    };
  }, [session, deviceId]);

  return { device, packets };
};

const useDevicePackets = (deviceId: string) => {
  const [loading, setLoading] = useState(false);
  const [packets, setPackets] = useState<Avl[]>([]);
  const [key, setKey] = useState<QueryDocumentSnapshot<Avl>>();

  const loadPackets = async () => {
    setLoading(true);
    const packets: Avl[] = [];

    const packetDocs = await getDocs(
      query(packetsCol(deviceId), orderBy("Time", "desc"), limit(25))
    );

    setKey(packetDocs.docs[packetDocs.docs.length - 1]);

    packetDocs.forEach((doc) => {
      let packet = doc.data();
      packets.push(packet);
    });

    setPackets(packets);
    setLoading(false);
  };

  const loadNewPackets = async () => {
    if (!key) {
      return;
    }
    setLoading(true);
    const newPackets: Avl[] = [];

    const packetDocs = await getDocs(
      query(
        packetsCol(deviceId),
        orderBy("Time", "desc"),
        startAfter(key),
        limit(25)
      )
    );

    setKey(packetDocs.docs[packetDocs.docs.length - 1]);

    packetDocs.forEach((doc) => {
      let packet = doc.data();
      newPackets.push(packet);
    });

    setPackets(packets.concat(newPackets));
    setLoading(false);
  };

  return { packets, loadNewPackets, loadPackets, loading };
};

export { useDevice, useDevicesCol, useDeviceDoc, useDevicePackets };
