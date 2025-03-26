import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  TableContainer,
  TableBody,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  DialogContent,
  TextField,
  Drawer,
  Grid,
  AppBar,
  Toolbar,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  CircularProgress, // Import CircularProgress for loading spinner
} from "@mui/material";
import { Close, Menu, Chat as ChatIcon } from "@mui/icons-material";
import AICopilot from "./AICopilot";
import mockIncidents from "./incidents.json"; // Mock incident data
import SummarizeRCA from "./SummarizeRCA";
import HealthCheck from "./HealthCheck";

export default function MainWorkspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get("id");
  const [incident, setIncident] = useState(null);
  const [relatedIncidents, setRelatedIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // State to handle loading for submit
  const [openModal, setOpenModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCopilot, setOpenCopilot] = useState(false); // State to handle copilot visibility

  useEffect(() => {
    const foundIncident = mockIncidents.find((inc) => inc.id === incidentId);
    setIncident(foundIncident);
  }, [incidentId]);

  const fetchRelatedIncidents = async () => {
    setLoading(true);
    setOpenModal(true);

    try {
      const response = await fetch("http://localhost:5000/get_related_incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incident.title),
      });

      const data = await response.json();
      setRelatedIncidents(data.related_incidents);
    } catch (error) {
      console.error("Error fetching related incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle submit button click
  const handleSubmit = async () => {
    setLoadingSubmit(true); // Show loading spinner

    // Simulate the submission process (e.g., an API call or state change)
    setTimeout(() => {
      setLoadingSubmit(false); // Hide loading spinner after submission
      navigate("/search"); // Navigate to /search
    }, 2000); // Simulate a 2-second delay
  };

  if (!incident) {
    return (
      <Typography variant="h6" style={{ textAlign: "center", marginTop: "50px" }}>
        Incident not found.
      </Typography>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <CssBaseline />
      {/* Top Navigation Bar */}
      <AppBar position="sticky" style={{ backgroundColor: "#b71c1c" }}>
        <Toolbar>
          {/* Hamburger Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            aria-label="menu"
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Incident Management
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List style={{ width: "250px" }}>
          <ListItem button onClick={() => navigate("/search")}>
            <ListItemText primary="Search Incidents" />
          </ListItem>
          {/* <ListItem button onClick={() => navigate("/ai-copilot")}>
            <ListItemText primary="AI Copilot" />
          </ListItem>
          <ListItem button onClick={() => navigate("/automations")}>
            <ListItemText primary="Automations" />
          </ListItem>
          <ListItem button onClick={() => navigate("/settings")}>
            <ListItemText primary="Settings" />
          </ListItem> */}
        </List>
      </Drawer>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {/* Incident Details */}
        <Card style={{ borderLeft: "5px solid #FFD700", marginBottom: "20px" }}>
          <CardHeader title={incident.title} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>ID:</strong></Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{incident.id}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1"><strong>Status:</strong></Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{incident.status}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1"><strong>Priority:</strong></Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{incident.priority}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1"><strong>Description:</strong></Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{incident.description}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Root Cause Analysis (Editable Fields) */}
        <Card style={{ marginBottom: "20px" }}>
          <CardHeader title="Root Cause Analysis" />
          <CardContent>
            {/* Editable Fields for Root Cause, Resolution, and Prevention */}
            <TextField label="Root Cause" variant="outlined" fullWidth margin="normal" />
            <TextField label="Resolution" variant="outlined" fullWidth margin="normal" />
            <TextField label="Prevention" variant="outlined" fullWidth margin="normal" />
            <Button
              variant="contained"
              style={{ backgroundColor: "#FFD700", color: "#000", marginTop: "10px" }}
              onClick={handleSubmit} // Trigger submit
              disabled={loadingSubmit} // Disable button while loading
            >
              {loadingSubmit ? (
                <CircularProgress size={24} style={{ color: "#000" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Copilot Trigger Button */}
        <IconButton
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#FF0000",
            color: "#000",
            borderRadius: "50%",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000
          }}
          onClick={() => setOpenCopilot(true)}
        >
          <ChatIcon style={{ fontSize: "2.5rem" }}/>
        </IconButton>

        {/* AI Copilot Popup (Dialog positioned near the bottom right) */}
        <Dialog
          open={openCopilot}
          onClose={() => setOpenCopilot(false)}
          PaperProps={{
            style: {
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "450px", // Same width as the AI Copilot component
              height: "540px", // Same height as the AI Copilot component
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              overflow: "hidden", // Ensure the content is fixed, no scrolling
            },
          }}
        >
          <DialogContent>
            {/* Only AI Copilot content is rendered */}
            <AICopilot />
          </DialogContent>
        </Dialog>

        {/* AI Copilot & Automation Panels with margin */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>

          {/* Automations Panel */}
          <div style={{ marginBottom: "20px" }}>
            <Card>
              <CardHeader title="Agentic Automations" />
              <CardContent>
                <div>
                  <HealthCheck />
                </div>
                <div>
                  <SummarizeRCA incident={incident} />
                </div>
                <Button
                  fullWidth
                  variant="contained"
                  style={{ backgroundColor: "#FFD700", color: "#000" }}
                  onClick={fetchRelatedIncidents}
                >
                  Get Related Incidents
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Incidents Modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Related Incidents
            <IconButton style={{ position: "absolute", right: 10, top: 10 }} onClick={() => setOpenModal(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <CircularProgress />
                <Typography>Fetching related incidents...</Typography>
              </div>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Title</strong></TableCell>
                      <TableCell><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {relatedIncidents.map((inc) => (
                      <TableRow key={inc.id}>
                        <TableCell>{inc.id}</TableCell>
                        <TableCell>{inc.body}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/incident?id=${inc.id}`)}
                          >
                            View Incident
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


