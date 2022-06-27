import { Avl } from "../firebase/models/Device";

const packetToPoint = (packet: Avl) => {
  return { lat: packet.Lat / 10000000, lng: packet.Lng / 10000000 };
};

export default packetToPoint;
