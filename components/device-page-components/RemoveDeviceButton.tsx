import {
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDeviceContext } from "../../contexts/device-context";
import { useDialog } from "../../contexts/dialog-context";
import { useDevice } from "../hooks/device";

const RemoveDeviceButton = () => {
  const { updateDialog, onClose } = useDialog();
  const { device, IMEI } = useDeviceContext();
  const { deleteDevice } = useDevice();
  const router = useRouter();

  const handleDialog = () => {
    let content = (
      <>
        <DialogTitle>Remove device</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure that you want to remove your device ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Remove</Button>
        </DialogActions>
      </>
    );

    updateDialog(true, content);
  };

  const handleDelete = () => {
    deleteDevice(IMEI);
    onClose();
    router.replace("/profile");
  };

  return (
    <>
      <Button onClick={handleDialog} color="error" variant="outlined">
        Remove device
      </Button>
    </>
  );
};

export default RemoveDeviceButton;
