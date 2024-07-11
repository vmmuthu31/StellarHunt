import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import "./styles/result.css";
import { store, persistor } from "../store/index.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Lobby from "./components/Lobby.jsx";
import Game from "./components/Game.jsx";
=======
import store from "../store/store";
import Lobby from "./Components/Lobby";
import Home from "./Components/Home";
import SlideApp from "./Components/SlideApp";
import Options from "./Components/Options";
import StoreOptions from "./Components/StoreOption";
import Result from "./Components/Result";

import { HuddleClient, HuddleProvider } from "@huddle01/react";
import WaitlistForm from "./Components/waitlist";

const huddleClient = new HuddleClient({
  projectId: "64oMGEVTnuPWGxDY-MGTKlLQe7xLje4f",
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});
>>>>>>> 7d561bf (updated the wailist in our project)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/lobby" exact element={<Lobby />} />
<<<<<<< HEAD
            <Route path="/game" exact element={<App />} />{" "}
            <Route path="/match" exact element={<Game />} />{" "}
=======
            <Route path="/game" exact element={<App />} />
            <Route path="/result" exact element={<Result />} />
            <Route path="/Character" exact element={<SlideApp data={"1"} />} />
            <Route path="/Guns" exact element={<SlideApp data={"2"} />} />
            <Route path="/Car" exact element={<SlideApp data={"3"} />} />
            <Route path="/options" exact element={<Options />} />
            <Route path="/optstore" exact element={<StoreOptions />} />
            <Route path="/Waitlist" exact element={<WaitlistForm />} />
>>>>>>> 7d561bf (updated the wailist in our project)
          </Routes>
        </Router>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
