// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProposeActivity from "./pages/ProposeActivity";
import Activity from "./pages/Activity";
import Chatbot from "./pages/chatbot/Chatbot";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProposeActivity />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/chatbot" element={<Chatbot />} />
    </Routes>
  );
};

export default App;
