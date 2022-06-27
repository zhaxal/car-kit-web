import {
  useRef,
  useEffect,
  useState,
  ReactNode,
  Children,
  cloneElement,
  isValidElement,
  SyntheticEvent,
} from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Avl } from "../../firebase/models/Device";
import packetToPoint from "../../utils/map";

export type Position = {
  lat: number;
  lng: number;
};

type MapProps = {
  zoom: number;
  center: Position;
  children: ReactNode | undefined | null;
};

type MyMapProps = {
  center: Position;
  zoom: number;
  children: ReactNode | undefined | null;
};

export const getPosition = (packet: Avl): Position => {
  return packetToPoint(packet);
};

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const MyMapComponent = ({ center, zoom, children }: MyMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          zoom,
        })
      );
    }
    map?.setZoom(zoom);
    map?.setCenter(center);
  }, [ref, map, center, zoom]);

  return (
    <>
      <div style={{ height: "100%", width: "100%" }} id="map" ref={ref} />
        {Children.map(children, (child) => {
          
          if (isValidElement(child)) {
            return cloneElement(child, { map });
          }
        })}
    </>
  );
};

const Map = ({ center, zoom, children }: MapProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={
        matches
          ? { display: "flex", height: "650px" }
          : { display: "flex", height: "450px" }
      }
    >
      <Wrapper apiKey="AIzaSyBCETv2vBMX5kYmg4XytzNVgYBpAzRfIsE" render={render}>
        <MyMapComponent zoom={zoom} center={center}>
          {children}
        </MyMapComponent>
      </Wrapper>
    </Box>
  );
};

interface MarkerProps extends google.maps.MarkerOptions {
  onClick?: (e: SyntheticEvent) => void;
}

const Marker: React.FC<MarkerProps> = ({ onClick, ...options }) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  useEffect(() => {
    if (marker) {
      if (onClick) {
        marker.addListener("click", onClick);
      }
    }
  }, [onClick, marker]);

  return null;
};

const Polyline: React.FC<google.maps.PolylineOptions> = (options) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline>();

  useEffect(() => {
    if (!polyline) {
      setPolyline(new google.maps.Polyline());
    }

    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [polyline]);

  useEffect(() => {
    if (polyline) {
      polyline.setOptions(options);
    }
  }, [polyline, options]);

  return null;
};

export { Map, Marker, Polyline };
