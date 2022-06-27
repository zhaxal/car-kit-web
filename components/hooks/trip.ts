import axios from "axios";
import {
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../contexts/snackbar-context";
import { tripsCol, tripsPacketsCol } from "../../firebase/client";
import { Avl } from "../../firebase/models/Device";
import { Trip } from "../../firebase/models/Trip";

const useTrips = (deviceId: string) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (!deviceId) {
      return;
    }

    const q = query(tripsCol(deviceId), orderBy("EndTime", "desc"));

    const unsubscribe = onSnapshot(q, (docs) => {
      const trips: Trip[] = [];

      docs.forEach((doc) => {
        let trip = doc.data();
        trip.id = doc.id;

        trips.push(trip);
      });

      setTrips(trips);
    });

    return function cleanup() {
      unsubscribe();
    };
  }, [deviceId]);

  return { trips };
};

const useTripDoc = (tripId: string, deviceId: string) => {
  const [trip, setTrip] = useState<Trip>({} as Trip);
  const [packets, setPackets] = useState<Avl[]>([]);

  useEffect(() => {
    if (!tripId || !deviceId) {
      return;
    }

    const unsubscribeTrip = onSnapshot(
      doc(tripsCol(deviceId), tripId),
      (doc) => {
        if (!doc.exists) {
          return;
        }

        let trip = doc.data();
        if (!trip) {
          return;
        }
        trip.id = doc.id;
        setTrip(trip);
      }
    );

    const q = query(tripsPacketsCol(deviceId, tripId), orderBy("Time", "desc"));

    const unsubscribePackets = onSnapshot(q, (docs) => {
      const packets: Avl[] = [];

      docs.forEach((doc) => {
        let packet = doc.data();

        packets.push(packet);
      });

      setPackets(packets);
    });

    return function cleanup() {
      unsubscribeTrip();
      unsubscribePackets();
    };
  }, [deviceId, tripId]);

  return { packets, trip };
};

const useTripPackets = (tripId: string, deviceId: string) => {
  const [loading, setLoading] = useState(false);
  const [packets, setPackets] = useState<Avl[]>([]);
  const [key, setKey] = useState<QueryDocumentSnapshot<Avl>>();

  const loadPackets = async () => {
    setLoading(true);
    const packets: Avl[] = [];

    const packetDocs = await getDocs(
      query(
        tripsPacketsCol(deviceId, tripId),
        orderBy("Time", "desc"),
        limit(25)
      )
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
        tripsPacketsCol(deviceId, tripId),
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

const useTrip = (deviceId: string) => {
  const { data: session } = useSession();
  const { updateSnackbar } = useSnackbar();

  const deleteTrip = (tripId: string) => {
    if (!session) {
      return;
    }

    const userId = session.user.id;

    axios
      .delete(`/api/user/${userId}/device/${deviceId}/trip/${tripId}`)
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

  return { deleteTrip };
};

export { useTrips, useTripDoc, useTripPackets, useTrip };
