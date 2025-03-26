import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, CircularProgress, Typography } from "@mui/material";

export default function SummarizeRCA({ incident }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("http://localhost:5000/summarize_rca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incident.title),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching RCA summary:", error);
      setSummary("Failed to load summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        style={{ backgroundColor: "#FFD700", color: "#000", marginBottom: "10px" }}
        onClick={() => {
          setOpen(true);
          fetchSummary();
        }}
      >
        Summarize RCA
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Root Cause Summary</DialogTitle>
        <DialogContent>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <CircularProgress />
              <Typography variant="body1" style={{ marginTop: "10px" }}>Processing...</Typography>
            </div>
          ) : (
            <Typography variant="body1">{summary}</Typography>
          )}
          <Button onClick={() => setOpen(false)} variant="contained" color="secondary" style={{ marginTop: "10px" }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
