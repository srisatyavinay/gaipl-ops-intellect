import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Grid,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Backdrop,
  InputLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import mockIncidents from "./incidents.json"; // Import mock incident data

export default function SearchIncidents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor
  const [selectedComponent, setSelectedComponent] = useState(""); // State for dropdown
  const incidentsPerPage = 5;

  useEffect(() => {
    setIncidents(mockIncidents); // Load mock data
  }, []);

  // Filtering logic to only show incidents with ID starting with 'INC-1'
  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.id.toLowerCase().startsWith("inc-1") &&
      incident.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastIncident = currentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = filteredIncidents.slice(
    indexOfFirstIncident,
    indexOfLastIncident
  );

  const [enterpriseData, setEnterpriseData] = useState(0);

  // Get enterprise data from local storage else default to 0
  useEffect(() => {
    const storedEnterpriseData = localStorage.getItem("enterprise_data");
    if (storedEnterpriseData) {
      setEnterpriseData(storedEnterpriseData);
    }
  }
  , []);
  
  // Set enterprise data in local storage
  useEffect(() => {
    localStorage.setItem("enterprise_data", enterpriseData);
  }, [enterpriseData]);
  // Loading state for the dropdown

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (event) => {
    const value = event.target.value;
    setEnterpriseData(value);
    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        "http://localhost:5000/change_enterprise_data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enterprise_data: value }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update enterprise data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleIncidentClick = (incidentId) => {
    window.location.href = `/incident?id=${incidentId}`;
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget); // Open menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close menu
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
    handleMenuClose();

    // Show loading indicator
    const loadingElement = document.createElement("div");
    loadingElement.textContent = "Logging out...";
    loadingElement.style.position = "fixed";
    loadingElement.style.top = "50%";
    loadingElement.style.left = "50%";
    loadingElement.style.transform = "translate(-50%, -50%)";
    loadingElement.style.backgroundColor = "#fff";
    loadingElement.style.padding = "20px";
    loadingElement.style.borderRadius = "8px";
    loadingElement.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    document.body.appendChild(loadingElement);

    // Simulate logout process
    setTimeout(() => {
      document.body.removeChild(loadingElement);
      window.location.href = "/"; // Redirect to LoginPage
    }, 1000);
  };

  return (
    <>
      <Backdrop open={isLoading} sx={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ backgroundColor: "#f4f5f7", minHeight: "100vh" }}>
        <AppBar position="static" sx={{ backgroundColor: "rgb(183, 28, 28)" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={(event) => setAnchorEl(event.currentTarget)} // Open menu on click
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Incident Management
            </Typography>
            <Avatar
              sx={{
                bgcolor: "#ffffff",
                color: "rgb(183, 28, 28)",
                cursor: "pointer",
              }}
              onClick={handleAvatarClick}
            >
              LC
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              <MenuItem onClick={() => console.log("Profile clicked")}>
                Profile
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ padding: "20px" }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Card
                sx={{ padding: "20px", boxShadow: 3, borderRadius: "12px" }}
              >
                <FormControl fullWidth>
                  <InputLabel id="component-select-label">
                    Select Component
                  </InputLabel>
                  <Select
                    labelId="component-select-label"
                    value={selectedComponent || "CCSPARK"}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                    label="Select Component"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="CCSPARK">CCSPARK</MenuItem>
                    <MenuItem value="CCDASH" disabled>
                      CCDASH
                    </MenuItem>
                    <MenuItem value="CCREVERT" disabled>
                      CCREVERT
                    </MenuItem>
                  </Select>
                </FormControl>
              </Card>
            </Grid>

            {/* <Grid item xs={6}>
              <Card
                sx={{ padding: "20px", boxShadow: 3, borderRadius: "12px" }}
              >
                <FormControl fullWidth>
                  <InputLabel id="enterprise-data-label">
                    Enterprise Data
                  </InputLabel>
                  <Select
                    labelId="enterprise-data-label"
                    value={enterpriseData}
                    onChange={(e) => setEnterpriseData(e.target.value)}
                    label="Enterprise Data"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  >
                    <MenuItem value={0}>Jira</MenuItem>
                    <MenuItem value={1}>ServiceNow</MenuItem>
                  </Select>
                </FormControl>
              </Card>
            </Grid> */}

            <Grid item xs={6}>
              <Card
                sx={{ padding: "20px", boxShadow: 3, borderRadius: "12px" }}
              >
                <FormControl fullWidth>
                  <InputLabel id="enterprise-data-label">
                    Enterprise Data
                  </InputLabel>
                  <Select
                    labelId="enterprise-data-label"
                    value={enterpriseData}
                    onChange={handleChange}
                    label="Enterprise Data"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    disabled={isLoading} // Disable dropdown when loading
                  >
                    <MenuItem value={0}>Jira</MenuItem>
                    <MenuItem value={1}>ServiceNow</MenuItem>
                  </Select>
                </FormControl>
              </Card>
            </Grid>

            {/* Search Bar */}
            <Grid item xs={12}>
              <Card
                sx={{ padding: "20px", boxShadow: 3, borderRadius: "12px" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SearchIcon sx={{ marginRight: "10px", color: "#757575" }} />
                  <TextField
                    fullWidth
                    label="Search Incidents"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3, borderRadius: "12px" }}>
                <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "rgb(183, 28, 28)" }}>
                        <TableCell
                          sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                        >
                          Title
                        </TableCell>
                        <TableCell
                          sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                        >
                          Priority
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentIncidents.map((incident) => (
                        <TableRow
                          key={incident.id}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            },
                            transition:
                              "background-color 0.3s, box-shadow 0.3s",
                          }}
                          onClick={() => handleIncidentClick(incident.id)}
                        >
                          <TableCell>{incident.id}</TableCell>
                          <TableCell>{incident.title}</TableCell>
                          <TableCell>{incident.status}</TableCell>
                          <TableCell>{incident.priority}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            {/* Pagination */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Pagination
                  count={Math.ceil(filteredIncidents.length / incidentsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
