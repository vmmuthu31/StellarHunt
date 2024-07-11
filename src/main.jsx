import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import "./styles/result.css";
import { store, persistor } from "../store/index.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Lobby from "./components/Lobby.jsx";
import Result from "./components/Result.jsx";
import Options from "./components/Options.jsx";
import { HuddleClient, HuddleProvider } from "@huddle01/react";

const huddleClient = new HuddleClient({
  projectId: "64oMGEVTnuPWGxDY-MGTKlLQe7xLje4f",
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <HuddleProvider key="huddle01-provider" client={huddleClient}>
          <Router>
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/lobby" exact element={<Lobby />} />
              <Route path="/game" exact element={<App />} />{" "}
              <Route path="/result" exact element={<Result />} />
              <Route path="/options" exact element={<Options />} />
              {/* 
            <Route path="/Character" exact element={<SlideApp data={"1"} />} />
            <Route path="/Guns" exact element={<SlideApp data={"2"} />} />
            <Route path="/Car" exact element={<SlideApp data={"3"} />} />
           
            <Route path="/optstore" exact element={<StoreOptions />} /> */}
            </Routes>
          </Router>
        </HuddleProvider>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
