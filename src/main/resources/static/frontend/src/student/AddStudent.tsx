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
        border: "1px solid #dbeafe",
        background: "linear-gradient(145deg, #ffffff, #edf5ff)",
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} color="#0f172a">
            Add or update a student
          </Typography>
          <Typography color="#475569">
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
            sx={{ borderColor: "#bfdbfe", color: "#0f172a", ":hover": { borderColor: "#60a5fa" } }}
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
