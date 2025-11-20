import React from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Breadcrumbs,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import App from "../App.tsx";
import { EntityModelModule } from "../api/entityModelModule.ts";
import { API_ENDPOINT } from "../config";
import AddModule from "./AddModule";

function Modules() {
  const [modules, setModules] = React.useState<EntityModelModule[]>([]);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    updateModules();
  }, []);

  function updateModules() {
    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => {
        setModules(response.data._embedded.modules);
      })
      .catch((response) => {
        setError(response.message);
      });
  }

  return (
    <App>
      <Stack spacing={3}>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="rgba(226,232,240,0.9)">Modules</Typography>
        </Breadcrumbs>

        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={700} color="#f8fafc">
            Module library
          </Typography>
          <Typography color="rgba(226,232,240,0.8)">
            Keep track of module identifiers and their availability status.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            padding: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          }}
        >
          {error && <Alert color="error">{error}</Alert>}
          {!error && modules.length < 1 && (
            <Alert color="warning">No modules</Alert>
          )}
          {modules.length > 0 && (
            <Stack spacing={1.5}>
              <Grid container sx={{ color: "rgba(226,232,240,0.8)" }}>
                <Grid item xs={2}>
                  <Typography fontWeight={700}>Module Code</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography fontWeight={700}>Module Name</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight={700}>Is MNC</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
              {modules.map((m) => {
                return (
                  <Box
                    key={m.code}
                    sx={{
                      padding: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.02)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.04)",
                      },
                    }}
                  >
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={2}>
                        <Typography fontWeight={600}>{m.code}</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography color="rgba(226,232,240,0.9)">{m.name}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography color={m.mnc ? "#34d399" : "#fbbf24"}>
                          {m.mnc ? "Yes" : "No"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Paper>

        <AddModule update={updateModules} />
      </Stack>
    </App>
  );
}

export default Modules;
