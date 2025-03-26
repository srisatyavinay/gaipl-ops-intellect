import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchIncidents from "./SearchIncidents";
import MainWorkspace from "./MainWorkspace";
import AICopilot from "./AICopilot";
import Automations from "./Automation";
import Settings from "./Settings";
import LoginPage from "./LoginPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchIncidents />} />
        <Route path="/incident" element={<MainWorkspace />} />
        <Route path="/ai-copilot" element={<AICopilot />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

// import React from 'react';
// import Chatbot from './components/chatbot'; // ✅ lowercase file, uppercase component!

// function App() {
//   return (
//     <div className="App">
//       <h1>Welcome to My Website</h1>
//       <Chatbot />
//     </div>
//   );
// }

// export default App;
