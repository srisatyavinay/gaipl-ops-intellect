import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Paper, Grid, Typography, TextField, Grid2 } from "@mui/material";
import { mockIncidents } from "./mockIncidents";

export default function IncidentDetails() {
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get("id");
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    const foundIncident = mockIncidents.find((inc) => inc.id === incidentId);
    setIncident(foundIncident);
  }, [incidentId]);

  if (!incident) {
    return <Typography variant="h6" style={{ textAlign: "center", marginTop: "50px" }}>Incident not found.</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px", backgroundColor: "#fff" }}>
      <Typography variant="h6" style={{ fontWeight: "bold", color: "#b71c1c", marginBottom: "10px" }}>
        Incident Details
      </Typography>

      <Grid2 container spacing={2}>
        <Grid2 item xs={6}>
          <TextField 
            label="Incident ID" 
            value={incident.id} 
            fullWidth 
            InputProps={{ readOnly: true }} 
            variant="outlined" 
          />
        </Grid2>
        <Grid2 item xs={6}>
          <TextField 
            label="Status" 
            value={incident.status} 
            fullWidth 
            InputProps={{ readOnly: true }} 
            variant="outlined" 
          />
        </Grid2>
        <Grid2 item xs={6}>
          <TextField 
            label="Priority" 
            value={incident.priority} 
            fullWidth 
            InputProps={{ readOnly: true }} 
            variant="outlined" 
          />
        </Grid2>
        <Grid2 item xs={12}>
          <TextField 
            label="Description" 
            value={incident.description} 
            fullWidth 
            multiline 
            rows={3} 
            InputProps={{ readOnly: true }} 
            variant="outlined" 
          />
        </Grid2>
      </Grid2>
    </Paper>
  );
}
