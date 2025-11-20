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

import App from "./App";

function Home() {
  return (
    <App>
      <Stack spacing={4}>
        <Breadcrumbs>
          <Typography color="rgba(226,232,240,0.9)">Home</Typography>
        </Breadcrumbs>

        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700} color="#f8fafc">
            Modern academic dashboard
          </Typography>
          <Typography color="rgba(226,232,240,0.8)">
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
                  background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardActionArea href={item.href} sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} color="#f8fafc">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="rgba(226,232,240,0.7)"
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
            background: "linear-gradient(145deg, rgba(56,189,248,0.15), rgba(125,211,252,0.05))",
            border: "1px solid rgba(125,211,252,0.25)",
            borderRadius: 3,
            padding: { xs: 2.5, md: 3 },
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#e0f2fe">
            Quick tip
          </Typography>
          <Typography color="rgba(224,242,254,0.8)" sx={{ mt: 1 }}>
            Use the navigation buttons above or the cards to move between sections
            seamlessly.
          </Typography>
        </Box>
      </Stack>
    </App>
  );
}

export default Home;
