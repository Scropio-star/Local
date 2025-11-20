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
          <Typography color="#1e293b">Students</Typography>
        </Breadcrumbs>

        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={700} color="#0f172a">
            Student roster
          </Typography>
          <Typography color="#475569">
            Review student identities and their key account information.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            padding: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "1px solid #dbeafe",
            background: "linear-gradient(145deg, #ffffff, #f3f8ff)",
          }}
        >
          {error && <Alert color="error">{error}</Alert>}
          {!error && students.length < 1 && (
            <Alert color="warning">No students</Alert>
          )}
          {students.length > 0 && (
            <Stack spacing={1.5}>
              <Grid container sx={{ color: "#1e293b" }}>
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
              <Divider sx={{ borderColor: "#e2e8f0" }} />
              {students.map((s) => {
                return (
                  <Box
                    key={s.id}
                    sx={{
                      padding: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#f8fbff",
                      "&:hover": {
                        backgroundColor: "#edf5ff",
                      },
                    }}
                  >
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={2}>
                        <Typography fontWeight={600}>{s.id}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography color="#1e293b">
                          {s.firstName}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography color="#1e293b">
                          {s.lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography color="#1e293b">
                          {s.username}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography color="#1e293b">
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
