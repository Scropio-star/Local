import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

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
        background: "linear-gradient(135deg, #e6f0ff 0%, #f6faff 50%, #ffffff 100%)",
        padding: { xs: 3, md: 6 },
        color: "#0f172a",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #dbeafe",
            borderRadius: 4,
            boxShadow: "0px 20px 60px rgba(37, 99, 235, 0.12)",
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
                <Typography variant="h4" fontWeight={700} color="#0f172a">
                  Academic Console
                </Typography>
                <Typography
                  variant="body2"
                  color="#475569"
                >
                  Streamlined management for modules, students, and grades.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    component={RouterLink}
                    to={link.href}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#bfdbfe",
                      color: "#0f172a",
                      textTransform: "none",
                      backdropFilter: "blur(4px)",
                      ":hover": {
                        borderColor: "#60a5fa",
                        backgroundColor: "rgba(96, 165, 250, 0.08)",
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Stack>

            <Box sx={{ borderTop: "1px solid #e2e8f0", pt: 3 }}>
              {props.children}
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
