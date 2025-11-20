import React from "react";
import axios from "axios";
import {
  Alert,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { EntityModelModule } from "../api/entityModelModule.ts";
import { API_ENDPOINT } from "../config";

function AddModule(props: { update: Function }) {
  const [module, setModule] = React.useState<EntityModelModule>({});
  const [error, setError] = React.useState<string>();

  function request() {
    axios
      .post(`${API_ENDPOINT}/modules`, module)
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
            Add or update a module
          </Typography>
          <Typography color="#475569">
            Define the code, name, and whether the module is mandatory.
          </Typography>
        </Stack>

        <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
          <TextField
            label="Module Code"
            fullWidth
            onChange={(e) => {
              setModule({ ...module, code: e.target.value.toUpperCase() });
            }}
          />
          <TextField
            label="Module Name"
            fullWidth
            onChange={(e) => {
              setModule({ ...module, name: e.target.value });
            }}
          />
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={module.mnc ?? false}
              onChange={(e) => {
                setModule({ ...module, mnc: e.target.checked });
              }}
            />
          }
          label="Mandatory module"
        />

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={request}>
            Save module
          </Button>
          <Button
            variant="outlined"
            onClick={() => setModule({})}
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

export default AddModule;
