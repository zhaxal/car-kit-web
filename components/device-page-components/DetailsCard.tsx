import {
  Stack,
  Alert,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDeviceContext } from "../../contexts/device-context";
import { getAvlDate, getAvlTime } from "../../utils/date";
import PacketsButton from "../ui/PacketsButton";
import RemoveDeviceButton from "./RemoveDeviceButton";

const DetailsCard = () => {
  const { lastPacket, device, IMEI } = useDeviceContext();
  const elements = lastPacket.Elements;
  const router = useRouter();

  const handleRedirectTrip = () => {
    router.push(`/device/${IMEI}/trips`);
  };

  return (
    <Stack sx={{ height: "100%" }} spacing={2}>
      <Alert severity="info">
        Last packet was sent on{" "}
        <Stack spacing={1} direction="row">
          <Typography>{getAvlDate(lastPacket.Time)}</Typography>
          <Typography>{getAvlTime(lastPacket.Time)}</Typography>
        </Stack>
      </Alert>

      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Parameters from {device.name}
          </Typography>

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

          <Stack mt={3} direction="row" spacing={1}>
            <Button onClick={handleRedirectTrip} variant="outlined">
              Show trips
            </Button>
            <PacketsButton disabled={false} />
            <RemoveDeviceButton />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default DetailsCard;
