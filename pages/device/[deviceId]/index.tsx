import { Container, Typography, Divider, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDeviceDoc } from "../../../components/hooks/device";
import Spinner from "../../../components/ui/Spinner";
import MapCard from "../../../components/device-page-components/MapCard";

import DetailsCard from "../../../components/device-page-components/DetailsCard";
import { DeviceProvider } from "../../../contexts/device-context";

import { Trip } from "../../../firebase/models/Trip";

const Device = () => {
  const router = useRouter();
  const { deviceId } = router.query;
  const { packets, device } = useDeviceDoc(deviceId as string);

  const { data: session } = useSession();
  const lastPacket = packets[0];

  if (session === null) {
    router.push("/");
    return <Spinner />;
  }

  if (packets.length === 0) {
    return <Spinner />;
  }

  if (!device.owner?.includes(session.user.id)) {
    router.replace("/profile");
    return <Spinner />;
  }

  return (
    <DeviceProvider
      IMEI={device.IMEI}
      lastPacket={lastPacket}
      device={device}
      trips={[] as Trip[]}
    >
      <Container maxWidth="xl" sx={{ marginTop: 2, marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom component="div">
          Device IMEI: {deviceId}
        </Typography>

        <Divider />

        <Grid sx={{ my: 2 }} container spacing={2}>
          <Grid item md={6} xs={12}>
            <MapCard />
          </Grid>
          <Grid item md={6} xs={12}>
            <DetailsCard />
          </Grid>
        </Grid>
      </Container>
    </DeviceProvider>
  );
};

export default Device;
