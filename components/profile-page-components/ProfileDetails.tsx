import { Avatar, Typography, Card, CardContent, Stack } from "@mui/material";
import { Session } from "next-auth";

type ProfileDetailsProps = {
  session: Session;
};

const ProfileDetails = ({ session }: ProfileDetailsProps) => {
  const { name, image, email } = session.user;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          justifyContent="center"
          spacing={2}
          alignItems="center"
          direction="row"
        >
          <Avatar sx={{ height: 62, width: 62 }} alt={name} src={image} />

          <Stack spacing={1}>
            <Typography>{name}</Typography>
            <Typography>{email}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
