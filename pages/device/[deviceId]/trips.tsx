import { Container, Typography, Divider, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useTrips } from "../../../components/hooks/trip";
import TripList from "../../../components/trip-page-components/TripList";
import TripMap from "../../../components/trip-page-components/TripMap";
import { DeviceProvider } from "../../../contexts/device-context";
import { Avl, Device } from "../../../firebase/models/Device";

const TripsPage = () => {
  const router = useRouter();
  const { deviceId } = router.query;
  const { trips } = useTrips(deviceId as string);

  return (
    <DeviceProvider
      IMEI={deviceId as string}
      lastPacket={{} as Avl}
      device={{} as Device}
      trips={trips}
    >
      <Container maxWidth="xl" sx={{ marginTop: 2, marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom component="div">
          Device IMEI: {deviceId}
        </Typography>

        <Divider />

        <Grid sx={{ my: 2 }} container spacing={2}>
          <Grid item md={6} xs={12}>
            <TripMap />
          </Grid>
          <Grid item md={6} xs={12}>
            <TripList />
          </Grid>
        </Grid>
      </Container>
    </DeviceProvider>
  );
};

export default TripsPage;
