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
import {
  EntityModelGrade,
  EntityModelStudent,
  EntityModelModule,
} from "../api/index";
import { API_ENDPOINT } from "../config";
import AddGrade from "./AddGrade";

function GradeRow(props: { grade: EntityModelGrade }) {
  const { grade } = props;
  const [student, setStudent] = React.useState<EntityModelStudent>();
  const [module, setModule] = React.useState<EntityModelModule>();

  React.useEffect(() => {
    axios
      .get(grade._links!.module!.href!)
      .then((response) => setModule(response.data));

    axios
      .get(grade._links!.student!.href!)
      .then((response) => setStudent(response.data));
  }, [grade]);

  return (
    <Box
      key={grade.id}
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
        <Grid item xs={4}>
          <Typography color="rgba(226,232,240,0.9)">
            {student && `${student.firstName} ${student.lastName} (${student.id})`}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="rgba(226,232,240,0.9)">
            {module && `${module.code} ${module.name}`}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography fontWeight={700} color="#38bdf8">
            {grade.score}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

function Grades() {
  const [grades, setGrades] = React.useState<EntityModelGrade[]>([]);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    updateGrades();
  }, []);

  function updateGrades() {
    axios
      .get(`${API_ENDPOINT}/grades`)
      .then((response) => {
        setGrades(response.data._embedded.grades);
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
          <Typography color="rgba(226,232,240,0.9)">Grades</Typography>
        </Breadcrumbs>

        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={700} color="#f8fafc">
            Performance tracker
          </Typography>
          <Typography color="rgba(226,232,240,0.8)">
            Monitor scores by pairing students with their registered modules.
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
          {!error && grades.length < 1 && <Alert color="warning">No grades</Alert>}
          {grades.length > 0 && (
            <Stack spacing={1.5}>
              <Grid container sx={{ color: "rgba(226,232,240,0.8)" }}>
                <Grid item xs={4}>
                  <Typography fontWeight={700}>Student</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight={700}>Module</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight={700}>Score</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
              {grades.map((g) => {
                return <GradeRow key={g.id} grade={g} />;
              })}
            </Stack>
          )}
        </Paper>

        <AddGrade update={updateGrades} />
      </Stack>
    </App>
  );
}

export default Grades;
