import DeviceControls from "../../components/profile-page-components/DeviceControls";
import ProfileControls from "../../components/profile-page-components/ProfileControls";
import { Container, Divider, Grid, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Spinner from "../../components/ui/Spinner";
import DeviceList from "../../components/profile-page-components/DeviceList";
import { useRouter } from "next/router";
import ProfileDetails from "../../components/profile-page-components/ProfileDetails";

const Profile = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return <Spinner />;
  }

  if (session === null) {
    router.push("/");
    return <Spinner />;
  }

  return (
    <Container maxWidth="xl" sx={{ marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h4" gutterBottom component="div">
        Profile
      </Typography>

      <Divider />

      <Grid sx={{ my: 2 }} container spacing={2}>
        <Grid item md={4} xs={12}>
          <ProfileDetails session={session} />
        </Grid>

        <Grid item md={4} xs={12}>
          <ProfileControls />
        </Grid>

        <Grid item md={4} xs={12}>
          <DeviceControls />
        </Grid>

        <Grid item xs={12}>
          <DeviceList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
