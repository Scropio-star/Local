import React from "react";
import axios from "axios";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddGradeBody,
  EntityModelStudent,
  EntityModelModule,
} from "../api/index";
import { API_ENDPOINT } from "../config";

function AddGrade(props: { update: Function }) {
  const [grade, setGrade] = React.useState<AddGradeBody>({});
  const [students, setStudents] = React.useState<EntityModelStudent[]>([]);
  const [modules, setModules] = React.useState<EntityModelModule[]>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => {
        setStudents(response.data._embedded.students);
      })
      .catch((response) => setError(response.message));

    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => setModules(response.data._embedded.modules))
      .catch((response) => setError(response.message));
  }, []);

  function request() {
    axios
      .post(`${API_ENDPOINT}/grades/addGrade`, grade)
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
        background: "linear-gradient(145deg, rgba(14,165,233,0.12), rgba(59,130,246,0.08))",
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} color="#f8fafc">
            Add a grade
          </Typography>
          <Typography color="rgba(226,232,240,0.8)">
            Pair a student with a module and record the associated score.
          </Typography>
        </Stack>

        <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
          <Select
            fullWidth
            value={grade.student_id ?? ""}
            onChange={(e) => setGrade({ ...grade, student_id: e.target.value })}
            displayEmpty
          >
            <MenuItem disabled value="">
              Select student
            </MenuItem>
            {students &&
              students.map((s) => {
                return (
                  <MenuItem
                    key={s.id}
                    value={s.id}
                  >{`${s.firstName} ${s.lastName} (${s.id})`}</MenuItem>
                );
              })}
          </Select>

          <Select
            fullWidth
            value={grade.module_code ?? ""}
            onChange={(e) => setGrade({ ...grade, module_code: e.target.value })}
            displayEmpty
          >
            <MenuItem disabled value="">
              Select module
            </MenuItem>
            {modules &&
              modules.map((m) => {
                return (
                  <MenuItem key={m.code} value={m.code}>{`${m.code} ${m.name}`}</MenuItem>
                );
              })}
          </Select>
        </Stack>

        <TextField
          label="Score"
          type="number"
          value={grade.score ?? ""}
          onChange={(e) => setGrade({ ...grade, score: e.target.value })}
        />

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={request}>
            Save grade
          </Button>
          <Button
            variant="outlined"
            onClick={() => setGrade({})}
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

export default AddGrade;
