/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Element } from "../../firebase/models/Device";
import { getAvlDate, getAvlTime } from "../../utils/date";
import { useDevicePackets } from "../hooks/device";
import { useDeviceContext } from "../../contexts/device-context";
import { useDialog } from "../../contexts/dialog-context";
import { Map, Marker } from "./Map";
import CircularProgress from "@mui/material/CircularProgress";
import packetToPoint from "../../utils/map";
import { useTripPackets } from "../hooks/trip";

type ElementsDialogProps = {
  elements: Element[];
};

type MapDialogProps = {
  position: { lat: number; lng: number };
};

const MapDialogButton = ({ position }: MapDialogProps) => {
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button sx={{ minWidth: "105px" }} onClick={onOpen} variant="outlined">
        Show on map
      </Button>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Position on map</DialogTitle>
        <DialogContent sx={matches ? { width: "600px" } : { width: "300px" }}>
          <Map zoom={15} center={position}>
            <Marker position={position as google.maps.LatLngLiteral} />
          </Map>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ElementsDialogButton = ({ elements }: ElementsDialogProps) => {
  const { updateDialog, onClose } = useDialog();

  const handleDialog = () => {
    let content = (
      <>
        <DialogTitle>IO elements</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {elements.map((element, i) => {
              return (
                <Typography key={i}>
                  {element.Name}: {element.Value} {element.Units}
                </Typography>
              );
            })}

            {elements[0].Value === 0 ? (
              <Alert severity="warning">
                Car is turned off. OBD data is not available
              </Alert>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </>
    );

    updateDialog(true, content);
  };

  return (
    <>
      <Button
        sx={{ minWidth: "105px" }}
        onClick={handleDialog}
        variant="outlined"
      >
        Show Elements
      </Button>
    </>
  );
};

const TripPacketsTable = () => {
  const { IMEI, trip } = useDeviceContext();
  const { packets, loadNewPackets, loading, loadPackets } = useTripPackets(
    trip!.id,
    IMEI
  );

  useEffect(() => {
    loadPackets();
  }, []);

  const onScroll = (e: SyntheticEvent) => {
    if (e.currentTarget) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight === scrollHeight) {
        loadNewPackets();
      }
    }
  };

  // console.log(
  //   packets.map((packet) => {
  //     return {
  //       speed: packet.Speed,
  //       time: getAvlDate(packet.Time),
  //       axis_x: packet.Elements.filter((element) => {
  //         if (element.Name === "Axis X") {
  //           return element.Value;
  //         }
  //       })[0],
  //       axis_y: packet.Elements.filter((element) => {
  //         if (element.Name === "Axis Y") {
  //           return element.Value;
  //         }
  //       })[0],
  //       axis_z: packet.Elements.filter((element) => {
  //         if (element.Name === "Axis Z") {
  //           return element.Value;
  //         }
  //       })[0],
  //       latitude: packet.Lat,
  //       longitude: packet.Lng,
  //       eco_type: packet.Elements.filter((element) => {
  //         if (element.Name === "Green driving type") {
  //           return element.Value;
  //         }
  //       })[0],
  //     };
  //   })
  // );

  return (
    <>
      <TableContainer
        sx={{ overflow: "auto", maxHeight: "85vh" }}
        variant="outlined"
        component={Paper}
        onScroll={onScroll}
      >
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Elements</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Altitude</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packets.map((packet, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{ minWidth: "180px" }}
                  component="th"
                  scope="row"
                >
                  <Stack spacing={1} direction="row">
                    <Typography>{getAvlDate(packet.Time)}</Typography>
                    <Typography>{getAvlTime(packet.Time)}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <ElementsDialogButton elements={packet.Elements} />
                </TableCell>
                <TableCell>
                  <MapDialogButton position={packetToPoint(packet)} />
                </TableCell>
                <TableCell sx={{ minWidth: "100px" }}>
                  {packet.Speed} km/h
                </TableCell>
                <TableCell>{packet.Altitude}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

const PacketsTable = () => {
  const { IMEI } = useDeviceContext();
  const { packets, loadNewPackets, loading, loadPackets } =
    useDevicePackets(IMEI);

  useEffect(() => {
    loadPackets();
  }, []);

  const onScroll = (e: SyntheticEvent) => {
    if (e.currentTarget) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight === scrollHeight) {
        loadNewPackets();
      }
    }
  };

  return (
    <>
      <TableContainer
        sx={{ overflow: "auto", maxHeight: "85vh" }}
        variant="outlined"
        component={Paper}
        onScroll={onScroll}
      >
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Elements</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Altitude</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packets.map((packet, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{ minWidth: "180px" }}
                  component="th"
                  scope="row"
                >
                  <Stack spacing={1} direction="row">
                    <Typography>{getAvlDate(packet.Time)}</Typography>
                    <Typography>{getAvlTime(packet.Time)}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <ElementsDialogButton elements={packet.Elements} />
                </TableCell>
                <TableCell>
                  <MapDialogButton position={packetToPoint(packet)} />
                </TableCell>
                <TableCell sx={{ minWidth: "100px" }}>
                  {packet.Speed} km/h
                </TableCell>
                <TableCell>{packet.Altitude}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

type PacketsButtonProps = {
  disabled: boolean;
};

const PacketsButton = ({ disabled }: PacketsButtonProps) => {
  const [open, setOpen] = useState(false);
  const { trip } = useDeviceContext();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  let style;

  if (!matches) {
    style = {
      overflowX: "auto",
      overflowY: "auto",
      width: "100%",
      height: "70vh",
    };
  } else {
    style = { overflowX: "auto", overflowY: "auto", width: "100%" };
  }

  return (
    <>
      <Button disabled={disabled} onClick={onOpen} variant="outlined">
        See all packets
      </Button>

      <Modal
        sx={{
          position: "fixed",
          height: "100vh",
        }}
        onClose={onClose}
        open={open}
      >
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row">
                <Typography variant="h5">Packets</Typography>
                <Box flexGrow={1} />
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>

              <Box sx={style}>
                {trip ? <TripPacketsTable /> : <PacketsTable />}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
};

export default PacketsButton;
