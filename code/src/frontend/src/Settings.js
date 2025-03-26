import { Card, CardContent, CardHeader, Typography } from "@mui/material";

export default function Settings() {
  return (
    <Card style={{ margin: "20px", padding: "20px" }}>
      <CardHeader title="Settings" />
      <CardContent>
        <Typography>Manage your preferences here.</Typography>
      </CardContent>
    </Card>
  );
}
