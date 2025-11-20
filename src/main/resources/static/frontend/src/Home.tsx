import {
  Box,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import App from "./App";

function Home() {
  return (
    <App>
      <Stack spacing={4}>
        <Breadcrumbs>
          <Typography color="#1e293b">Home</Typography>
        </Breadcrumbs>

        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700} color="#0f172a">
            Modern academic dashboard
          </Typography>
          <Typography color="#475569">
            Navigate through modules, students, and grades in a clean and cohesive
            interface.
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {[{
            title: "Modules",
            description: "Browse and manage module codes and their details.",
            href: "/modules",
          },
          {
            title: "Students",
            description: "Oversee student records and account information.",
            href: "/students",
          },
          {
            title: "Grades",
            description: "Record assessment results with minimal effort.",
            href: "/grades",
          }].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card
                elevation={0}
                sx={{
                  background: "linear-gradient(145deg, #ffffff, #f0f6ff)",
                  border: "1px solid #dbeafe",
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardActionArea
                  component={RouterLink}
                  to={item.href}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} color="#0f172a">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#475569"
                      sx={{ mt: 1.5, lineHeight: 1.6 }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            background: "linear-gradient(145deg, #e0f2fe, #f5faff)",
            border: "1px solid #bfdbfe",
            borderRadius: 3,
            padding: { xs: 2.5, md: 3 },
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#0f172a">
            Quick tip
          </Typography>
          <Typography color="#1e3a8a" sx={{ mt: 1 }}>
            Use the navigation buttons above or the cards to move between sections
            seamlessly.
          </Typography>
        </Box>
      </Stack>
    </App>
  );
}

export default Home;
