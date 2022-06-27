import { Card } from "@mui/material";
import { getPosition, Map, Marker, Position } from "../ui/Map";
import { useEffect, useState } from "react";
import { useDeviceContext } from "../../contexts/device-context";

const MapCard = () => {
  const { lastPacket: packet } = useDeviceContext();

  const anchor = { x: 12, y: 20 } as google.maps.Point;

  const [position, setPosition] = useState<Position>(getPosition(packet));

  useEffect(() => {
    setPosition(getPosition(packet));
  }, [packet]);

  const svgMarker = {
    path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    fillColor: "red",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: anchor,
  };

  return (
    <Card>
      <Map zoom={15} center={position}>
        <Marker
          icon={svgMarker}
          position={position as google.maps.LatLngLiteral}
        />
      </Map>
    </Card>
  );
};

export default MapCard;
