import { Card } from "@mui/material";
import { useDeviceContext } from "../../contexts/device-context";
import packetToPoint from "../../utils/map";
import { Map, Marker, Polyline } from "../ui/Map";

const TripMap = () => {

  const { trip, packets } = useDeviceContext();

  return (
    <Card>
      <Map
        zoom={trip && packets.length > 0 ? 14 : 2}
        center={
          packets.length > 0 ? packetToPoint(packets[0]) : { lat: 0, lng: 0 }
        }
      >
        {trip && packets.length > 0 ? (
          <Polyline
            strokeColor="#FF0000"
            strokeOpacity={1.0}
            strokeWeight={2}
            geodesic={true}
            path={packets.map((packet) => {
              return packetToPoint(packet);
            })}
          />
        ) : null}

        {trip && packets.length > 0 ? (
          <Marker
            label="B"
            position={packetToPoint(packets[0]) as google.maps.LatLngLiteral}
          />
        ) : null}

        {trip && packets.length > 0 ? (
          <Marker
            label="A"
            position={
              packetToPoint(
                packets[packets.length - 1]
              ) as google.maps.LatLngLiteral
            }
          />
        ) : null}
      </Map>
    </Card>
  );
};

export default TripMap;
