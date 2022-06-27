import { Box, Button, Container, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const handleStart = () => {
    switch (status) {
      case "authenticated":
        router.push("/profile");
        break;

      case "unauthenticated":
        signIn("google");
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Box
        sx={{
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Car-kit
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            A tool to communicate with your tracker devices
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button onClick={handleStart}>Start working</Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Home;
