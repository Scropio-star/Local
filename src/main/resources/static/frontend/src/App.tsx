import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Modules", href: "/modules" },
  { label: "Students", href: "/students" },
  { label: "Grades", href: "/grades" },
];

function App(props: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 10% 20%, #1f2937, #0b1223 45%, #070b14)",
        padding: { xs: 3, md: 6 },
        color: "#e2e8f0",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 4,
            boxShadow: "0px 25px 80px rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(10px)",
            padding: { xs: 3, md: 4 },
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack spacing={0.5}>
                <Typography variant="h4" fontWeight={700} color="#f8fafc">
                  Academic Console
                </Typography>
                <Typography
                  variant="body2"
                  color="rgba(226,232,240,0.75)"
                >
                  Streamlined management for modules, students, and grades.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    href={link.href}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "#e2e8f0",
                      textTransform: "none",
                      backdropFilter: "blur(4px)",
                      ":hover": {
                        borderColor: "rgba(255,255,255,0.35)",
                        backgroundColor: "rgba(255,255,255,0.04)",
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Stack>

            <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", pt: 3 }}>
              {props.children}
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
