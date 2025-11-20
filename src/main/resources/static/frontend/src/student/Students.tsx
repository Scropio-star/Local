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
import { EntityModelStudent } from "../api/index";
import { API_ENDPOINT } from "../config";
import AddStudent from "./AddStudent";

function Students() {
  const [students, setStudents] = React.useState<EntityModelStudent[]>([]);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    updateStudents();
  }, []);

  function updateStudents() {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => {
        setStudents(response.data._embedded.students);
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
          <Typography color="rgba(226,232,240,0.9)">Students</Typography>
        </Breadcrumbs>

        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={700} color="#f8fafc">
            Student roster
          </Typography>
          <Typography color="rgba(226,232,240,0.8)">
            Review student identities and their key account information.
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
          {!error && students.length < 1 && (
            <Alert color="warning">No students</Alert>
          )}
          {students.length > 0 && (
            <Stack spacing={1.5}>
              <Grid container sx={{ color: "rgba(226,232,240,0.8)" }}>
                <Grid item xs={2}>
                  <Typography fontWeight={700}>Student ID</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight={700}>First Name</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight={700}>Last Name</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight={700}>Username</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight={700}>Email</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
              {students.map((s) => {
                return (
                  <Box
                    key={s.id}
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
                        <Typography fontWeight={600}>{s.id}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography color="rgba(226,232,240,0.9)">
                          {s.firstName}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography color="rgba(226,232,240,0.9)">
                          {s.lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography color="rgba(226,232,240,0.9)">
                          {s.username}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography color="rgba(226,232,240,0.9)">
                          {s.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Paper>

        <AddStudent update={updateStudents} />
      </Stack>
    </App>
  );
}

export default Students;
