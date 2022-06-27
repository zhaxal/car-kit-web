import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { SyntheticEvent, useRef, useState } from "react";
import { Device } from "../../firebase/models/Device";
import formToJSON from "../../utils/forms";
import { useDevice } from "../hooks/device";

const AddDeviceButton = () => {
  const [open, setOpen] = useState(false);
  const { addDevice } = useDevice();

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let event = formToJSON(data) as Device;
    addDevice(event);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} variant="outlined">
        Add device
      </Button>

      <Dialog onClose={onClose} open={open}>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Add device</DialogTitle>
          <DialogContent>
            <Stack>
              <TextField margin="normal" required name="IMEI" label="IMEI" />
              <TextField
                margin="normal"
                required
                name="name"
                label="Car name"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

const DeviceControls = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/devices");
  };

  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Stack spacing={1} direction="row">
          <AddDeviceButton />
          <Button onClick={handleRedirect} variant="outlined">
            Show all devices
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DeviceControls;
