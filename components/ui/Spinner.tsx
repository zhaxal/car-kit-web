import { CircularProgress, Stack } from "@mui/material";

const Spinner = () => {
  return (
    <Stack sx={{ m: 3 }} direction="row" justifyContent="center">
      <CircularProgress />
    </Stack>
  );
};

export default Spinner;
