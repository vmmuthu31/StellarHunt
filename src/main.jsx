import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import "./styles/result.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store/store";
import Lobby from "./Components/Lobby.jsx";
import Home from "./Components/Home.jsx";
import SlideApp from "./Components/SlideApp.jsx";
import Options from "./Components/Options.jsx";
import StoreOptions from "./Components/StoreOption.jsx";
import Result from "./Components/Result.jsx";

import { HuddleClient, HuddleProvider } from "@huddle01/react";
import WaitlistForm from "./Components/waitlist.jsx";

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
    <React.StrictMode>
      <HuddleProvider client={huddleClient}>
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/lobby" exact element={<Lobby />} />
            <Route path="/game" exact element={<App />} />
            <Route path="/result" exact element={<Result />} />
            <Route path="/Character" exact element={<SlideApp data={"1"} />} />
            <Route path="/Guns" exact element={<SlideApp data={"2"} />} />
            <Route path="/Car" exact element={<SlideApp data={"3"} />} />
            <Route path="/options" exact element={<Options />} />
            <Route path="/optstore" exact element={<StoreOptions />} />
            <Route path="/Waitlist" exact element={<WaitlistForm />} />
          </Routes>
        </Router>
      </HuddleProvider>
    </React.StrictMode>
  </Provider>
);
