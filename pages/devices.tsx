import {
  Container,
  Typography,
  Divider,
  Grid,
  Card,
  MenuItem,
  MenuList,
  DialogTitle,
  DialogContent,
  Stack,
  DialogActions,
  Button,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDevicesCol } from "../components/hooks/device";
import { Map, Marker } from "../components/ui/Map";
import Spinner from "../components/ui/Spinner";
import { useDialog } from "../contexts/dialog-context";

const DevicesPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { devices } = useDevicesCol();
  const { updateDialog, onClose } = useDialog();

  if (session === null) {
    router.push("/");
    return <Spinner />;
  }

  if (devices.length === 0) {
    return <Spinner />;
  }

  const handleRedirect = (id: string) => {
    return () => router.push(`/device/${id}`);
  };

  const handleDialog = (content: JSX.Element) => {
    return () => updateDialog(true, content);
  };

  const handleRedirectMarker = (id: string) => {
    return () => {
      router.push(`/device/${id}`);
      onClose();
    };
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h4" gutterBottom component="div">
        All devices
      </Typography>

      <Divider />

      <Grid sx={{ my: 2 }} container spacing={2}>
        <Grid item md={6} xs={12}>
          <Map zoom={2} center={{ lat: 0, lng: 0 }}>
            {devices.map((device, i) => {
              let lat = (device.Lat! / 10000000) as number;
              let lng = (device.Lng! / 10000000) as number;

              let content = (
                <>
                  <DialogTitle>Device</DialogTitle>
                  <DialogContent>
                    <Stack>
                      <Typography>Name: {device.name}</Typography>
                      <Typography>IMEI: {device.IMEI}</Typography>
                    </Stack>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleRedirectMarker(device.IMEI)}>
                      Open
                    </Button>
                    <Button onClick={onClose}>Close</Button>
                  </DialogActions>
                </>
              );

              return (
                <Marker
                  onClick={handleDialog(content)}
                  key={i}
                  clickable={true}
                  position={
                    {
                      lat,
                      lng,
                    } as google.maps.LatLngLiteral
                  }
                />
              );
            })}
          </Map>
        </Grid>
        <Grid item md={6} xs={12}>
          <Card>
            <Typography
              sx={{ px: 2, pt: 2 }}
              variant="h6"
              gutterBottom
              component="div"
            >
              Devices
            </Typography>

            <MenuList>
              {devices.map((device) => {
                return (
                  <MenuItem
                    onClick={handleRedirect(device.IMEI)}
                    key={device.IMEI}
                  >
                    Car name: {device.name}, IMEI: {device.IMEI}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DevicesPage;
