import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { getAvlDate, getAvlTime } from "../../utils/date";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PacketsButton from "../ui/PacketsButton";
import { Trip } from "../../firebase/models/Trip";
import DeleteTripButton from "./DeleteTripButton";
import { useEffect, useState } from "react";
import { useDeviceContext } from "../../contexts/device-context";
import packetToPoint from "../../utils/map";
import { Avl } from "../../firebase/models/Device";

const TripList = () => {
  const { trips, updateTrip, trip: active, packets } = useDeviceContext();
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded === false) {
      updateTrip(null);
    }
  }, [expanded, updateTrip]);

  const handleUpdate = (trip: Trip) => {
    return () => updateTrip(trip);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  const getFuelUsed = (packet: Avl): number => {
    if (!packet) {
      return 0;
    }

    let ml = packet.Elements.find((element) => {
      if (element.Name === "Fuel Used GPS") {
        return element;
      }
    });

    return ml?.Value as number;
  };

  const getTripLength = () => {
    if (!google.maps.geometry) {
      return;
    }

    return Math.trunc(
      google.maps.geometry.spherical.computeLength(
        packets.map((packet) => {
          return packetToPoint(packet);
        })
      )
    );
  };

  const getTripFuel = () => {
    return getFuelUsed(packets[0]) - getFuelUsed(packets[packets.length - 1]);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  if (trips.length === 0) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography>No trips added yet</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Typography
          sx={{ px: 2, pt: 2 }}
          variant="h6"
          gutterBottom
          component="div"
        >
          Trips
        </Typography>
      </Card>
      {trips.map((trip, i) => {
        return (
          <Accordion
            onClick={handleUpdate(trip)}
            expanded={expanded === `panel${i}`}
            onChange={handleChange(`panel${i}`)}
            key={i}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {trip.Status === "inactive" ? (
                <Stack spacing={1} direction="row">
                  <Typography>{getAvlDate(trip.EndTime)}</Typography>
                  <Typography>{getAvlTime(trip.EndTime)}</Typography>
                </Stack>
              ) : (
                <>
                  <Typography>Trip is online</Typography>
                </>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1} direction="row" mb={1}>
                <Typography>Trip distance: {getTripLength()} m</Typography>
                <Typography>Fuel used: {getTripFuel()} ml</Typography>
              </Stack>

              <Stack alignItems="center" direction="row" spacing={1}>
                <DeleteTripButton handleClose={handleClose} tripId={trip.id} />
                <PacketsButton disabled={!active} />
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* <Backdrop>
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </>
  );
};

export default TripList;
