import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "../contexts/snackbar-context";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Navbar from "../components/ui/Navbar";
import { DialogProvider } from "../contexts/dialog-context";
import Footer from "../components/ui/Footer";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#222222",
      },
      primary: {
        main: "#90ee90",
      },
    },
  });

  const style = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <DialogProvider>
          <SessionProvider session={session}>
            <Box sx={style}>
              <Head>
                <meta charSet="utf-8" />
                <title>Car-kit</title>
              </Head>
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </Box>
          </SessionProvider>
        </DialogProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default MyApp;
