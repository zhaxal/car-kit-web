import {
  AppBar,
  Avatar,
  Box,
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDialog } from "../../contexts/dialog-context";
import { useRouter } from "next/router";
import logo from "../../public/car-kit.svg";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { updateDialog } = useDialog();
  const router = useRouter();

  const handleLogin = () => {
    let content = (
      <>
        <DialogTitle textAlign="center">Login</DialogTitle>
        <DialogContent>
          <Stack alignContent="center">
            <Button onClick={() => signIn("google")} variant="contained">
              Sign in with Google
            </Button>
          </Stack>
        </DialogContent>
      </>
    );

    updateDialog(true, content);
  };

  const showProfileHandler = () => {
    router.push(`/profile`);
  };

  const showHomeHandler = () => {
    router.push(`/`);
  };

  let user = session?.user!;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Stack
            spacing={1}
            sx={{ flexGrow: 1 }}
            direction="row"
            component="a"
            onClick={showHomeHandler}
            alignItems="center"
          >
            <Image src={logo} alt="car-kit" />
            <Typography sx={{ height: 28 }} variant="h6" component="div">
              Car-kit
            </Typography>
          </Stack>

          {status === "authenticated" ? (
            <Stack alignItems="center" direction="row" spacing={1}>
              <IconButton onClick={showProfileHandler} color="inherit">
                <Avatar alt={user.name!} src={user.image!} />
              </IconButton>
            </Stack>
          ) : (
            <>
              <IconButton
                disabled={status === "loading"}
                onClick={handleLogin}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
