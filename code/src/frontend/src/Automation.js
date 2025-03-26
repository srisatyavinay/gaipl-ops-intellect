import { Card, CardContent, CardHeader, Button } from "@mui/material";

export default function Automations() {
  return (
    <Card style={{ margin: "20px", padding: "20px" }}>
      <CardHeader title="Automations" />
      <CardContent>
        <Button fullWidth variant="contained" style={{ backgroundColor: "#FFD700", color: "#000", marginBottom: "10px" }}>
          Run Health Check
        </Button>
        <Button fullWidth variant="contained" style={{ backgroundColor: "#FFD700", color: "#000" }}>
          Summarize RCA
        </Button>
      </CardContent>
    </Card>
  );
}
