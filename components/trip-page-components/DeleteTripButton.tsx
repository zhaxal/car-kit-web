import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDeviceContext } from "../../contexts/device-context";
import { useDialog } from "../../contexts/dialog-context";

import { useTrip } from "../hooks/trip";

type DeleteTripButtonProps = {
  tripId: string;
  handleClose: () => void;
};

const DeleteTripButton = ({ tripId, handleClose }: DeleteTripButtonProps) => {
  const router = useRouter();
  const { deviceId } = router.query;
  const { deleteTrip } = useTrip(deviceId as string);
  const { updateDialog, onClose } = useDialog();
  const { updateTrip } = useDeviceContext();

  const handleDelete = () => {
    updateTrip(null);
    deleteTrip(tripId);
    handleClose();
    onClose();
  };

  const handleDialog = () => {
    let content = (
      <>
        <DialogTitle>Delete trip</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete trip ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </>
    );

    updateDialog(true, content);
  };

  return (
    <Button variant="outlined" color="error" onClick={handleDialog}>
      Delete trip
    </Button>
  );
};

export default DeleteTripButton;
