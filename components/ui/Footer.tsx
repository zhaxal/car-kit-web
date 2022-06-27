import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/zhaxal">
        Zhakhangir Anuarbek
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#121212",
        boxShadow:
          "2px 0px 4px -1px rgba(0,0,0,0.2),4px 0px 5px 0px rgba(0,0,0,0.14),1px 0px 10px 0px rgba(0,0,0,0.12)",
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
      }}
    >
      <Container maxWidth="sm">
        <Copyright />
      </Container>
    </Box>
  );
}
