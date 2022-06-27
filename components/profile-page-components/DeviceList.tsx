import {
  Card,
  CardContent,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDevicesCol } from "../hooks/device";

const DeviceList = () => {
  const router = useRouter();
  const { devices } = useDevicesCol();

  const handleRedirect = (id: string) => {
    return () => router.push(`/device/${id}`);
  };

  if (devices.length === 0) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography>No devices added yet</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
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
            <MenuItem onClick={handleRedirect(device.IMEI)} key={device.IMEI}>
              Car name: {device.name}, IMEI: {device.IMEI}
            </MenuItem>
          );
        })}
      </MenuList>
    </Card>
  );
};

export default DeviceList;
