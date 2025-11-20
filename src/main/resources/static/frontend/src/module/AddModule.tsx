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
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(145deg, rgba(99,102,241,0.12), rgba(56,189,248,0.08))",
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} color="#f8fafc">
            Add or update a module
          </Typography>
          <Typography color="rgba(226,232,240,0.8)">
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

export default AddModule;
