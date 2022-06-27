import { signOut } from "next-auth/react";
import { Button, Card, CardContent, Stack } from "@mui/material";


const ProfileControls = () => {
  const handleLogout = () => {
    signOut();
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
          <Button onClick={handleLogout} variant="outlined">
            Logout
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileControls;
