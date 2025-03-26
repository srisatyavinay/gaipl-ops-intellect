import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, CircularProgress, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CheckCircle, Error, Warning, Close } from "@mui/icons-material";

export default function HealthCheck() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const fetchHealthCheck = async () => {
    setLoading(true);
    setReport(null);

    try {
      const response = await fetch("http://localhost:5000/run_health_check");
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching health check:", error);
      setReport({ error: "Failed to load health check report." });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (status) => {
    if (status.includes("✅")) return <CheckCircle style={{ color: "green" }} />;
    if (status.includes("⚠️")) return <Warning style={{ color: "orange" }} />;
    if (status.includes("❌")) return <Error style={{ color: "red" }} />;
    return null;
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        style={{ backgroundColor: "#FFD700", color: "#000", marginBottom: "10px" }}
        onClick={() => {
          setOpen(true);
          fetchHealthCheck();
        }}
      >
        Run Health Check
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Health Check Report</DialogTitle>
        <DialogContent>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <CircularProgress />
              <Typography variant="body1" style={{ marginTop: "10px" }}>Processing...</Typography>
            </div>
          ) : report ? (
            <>
              <Typography variant="h6" style={{ marginTop: "10px" }}>🔍 Service Status</Typography>
              <List>
                {Object.entries(report.services).map(([service, status]) => (
                  <ListItem key={service}>
                    <ListItemIcon>{getIcon(status)}</ListItemIcon>
                    <ListItemText primary={`${service}: ${status}`} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" style={{ marginTop: "10px" }}>💾 Resource Utilization</Typography>
              <List>
                {Object.entries(report.resource_utilization).map(([res, status]) => (
                  <ListItem key={res}>
                    <ListItemIcon>{getIcon(status)}</ListItemIcon>
                    <ListItemText primary={`${res}: ${status}`} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" style={{ marginTop: "10px" }}>⚠️ Anomalies</Typography>
              <List>
                {Object.entries(report.anomalies).map(([service, status]) => (
                  <ListItem key={service}>
                    <ListItemIcon>{getIcon(status)}</ListItemIcon>
                    <ListItemText primary={`${service}: ${status}`} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" style={{ marginTop: "10px" }}>🔍 Root Cause Analysis</Typography>
              <List>
                {report.rca_findings.map((incident, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Incident: ${incident.incident} | Service: ${incident.service}`}
                      secondary={`Suggested Action: ${incident.suggested_action}`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="body1" color="error">Failed to load health check report.</Typography>
          )}
          <Button onClick={() => setOpen(false)} variant="contained" color="secondary" style={{ marginTop: "10px" }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
