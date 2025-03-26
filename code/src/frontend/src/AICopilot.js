import { useState } from "react";
import { Card, CardContent, CardHeader, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { sender: "AI", text: "Hello! How can I assist you with your incident?" },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show processing icon
    setIsProcessing(true);

    try {
      // Make API call to chatbot backend
      const response = await fetch("http://localhost:5000/chatbot_text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_message: input }),
      });

      const data = await response.json();

      // Add AI response to chat
      const aiResponse = { sender: "AI", text: data.bot_response || "Sorry, I couldn't process your request." };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      // Handle error
      const errorMessage = { sender: "AI", text: "An error occurred while processing your request." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Hide processing icon
      setIsProcessing(false);
    }
  };

  return (
    <Card style={{ width: "400px", height: "450px", display: "flex", flexDirection: "column" }}>
      <CardHeader title="AI Copilot" style={{ backgroundColor: "#b71c1c", color: "#FFD700", textAlign: "center" }} />
      
      {/* Chat History (Scrollable) */}
      <CardContent style={{ flex: 1, overflowY: "auto", maxHeight: "330px" }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} style={{ textAlign: msg.sender === "You" ? "right" : "left" }}>
              <ListItemText primary={<strong>{msg.sender}</strong>} secondary={msg.text} />
            </ListItem>
          ))}
          {isProcessing && (
            <ListItem style={{ textAlign: "left" }}>
              <CircularProgress size={20} />
            </ListItem>
          )}
        </List>
      </CardContent>

      {/* Input Box & Send Button */}
      <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd", backgroundColor: "#fff" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask AI about this incident..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button 
          variant="contained" 
          style={{ backgroundColor: "#b71c1c", color: "#fff", marginLeft: "10px" }} 
          onClick={handleSendMessage}
        >
          <SendIcon />
        </Button>
      </div>
    </Card>
  );
}