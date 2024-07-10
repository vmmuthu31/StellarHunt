import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Home from "./components/Home.jsx";
import { ThirdwebProvider } from "thirdweb/react";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";

import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
  </React.StrictMode>
);
