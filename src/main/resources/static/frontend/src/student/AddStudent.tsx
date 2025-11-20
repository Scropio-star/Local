import React from "react";
import axios from "axios";
import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { EntityModelStudent } from "../api/entityModelStudent.ts";
import { API_ENDPOINT } from "../config";

function AddStudent(props: { update: Function }) {
  const [student, setStudent] = React.useState<EntityModelStudent>({});
  const [error, setError] = React.useState<string>();

  function request() {
    axios
      .post(`${API_ENDPOINT}/students`, student)
      .then(() => {
        props.update();
      })
      .catch((response) => {
        setError(response.message);
      });
  }

  return (
    <Paper
      elevation={0}
      sx={{
        padding: { xs: 2, md: 3 },
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(145deg, rgba(16,185,129,0.12), rgba(74,222,128,0.08))",
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} color="#f8fafc">
            Add or update a student
          </Typography>
          <Typography color="rgba(226,232,240,0.8)">
            Capture identity information and contact details in one place.
          </Typography>
        </Stack>

        <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
          <TextField
            label="Student ID"
            fullWidth
            onChange={(e) => {
              setStudent({ ...student, id: Number(e.target.value) });
            }}
          />
          <TextField
            label="Username"
            fullWidth
            onChange={(e) => {
              setStudent({ ...student, username: e.target.value });
            }}
          />
        </Stack>

        <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            onChange={(e) => {
              setStudent({ ...student, email: e.target.value });
            }}
          />
        </Stack>

        <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
          <TextField
            label="First Name"
            fullWidth
            onChange={(e) => {
              setStudent({ ...student, firstName: e.target.value });
            }}
          />
          <TextField
            label="Last Name"
            fullWidth
            onChange={(e) => {
              setStudent({ ...student, lastName: e.target.value });
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={request}>
            Save student
          </Button>
          <Button
            variant="outlined"
            onClick={() => setStudent({})}
            sx={{ borderColor: "rgba(255,255,255,0.2)", color: "#e2e8f0" }}
          >
            Clear
          </Button>
        </Stack>

        {error && <Alert color="error">{error}</Alert>}
      </Stack>
    </Paper>
  );
}

export default AddStudent;
