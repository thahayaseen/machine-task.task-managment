import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
// import { Toast } from "./components/ui/toast.tsx";
import { Toaster } from "react-hot-toast"; 
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="main dark">
        <Toaster position="top-right" />
        <Navbar />
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
