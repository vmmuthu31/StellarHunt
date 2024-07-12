import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Lobby from "./Components/Lobby";
import Home from "./Components/Home";
import SlideApp from "./Components/SlideApp";
import Options from "./Components/Options";
import StoreOptions from "./Components/StoreOption";
import Result from "./Components/Result";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import WaitlistForm from "./Components/waitlist";
import ProtectedRoute from "./Components/ProtectedRoute";

const huddleClient = new HuddleClient({
  projectId: "yn1GSFecK63Bm7pRiiuBuUUQQhWmpJM3",
  options: {
    activeSpeakers: {
      size: 12,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HuddleProvider key="huddle01-provider" client={huddleClient}>
            <Router>
              <Provider store={store}>
                <Routes>
                  <Route path="/" exact element={<Home />} />
                  <Route path="/lobby" exact element={<Lobby />} />
                  <Route
                    path="/game"
                    exact
                    element={<ProtectedRoute element={<App />} />}
                  />
                  <Route
                    path="/result"
                    exact
                    element={<ProtectedRoute element={<Result />} />}
                  />
                  <Route
                    path="/Character"
                    exact
                    element={<SlideApp data={"1"} />}
                  />
                  <Route path="/Guns" exact element={<SlideApp data={"2"} />} />
                  <Route path="/Car" exact element={<SlideApp data={"3"} />} />
                  <Route path="/options" exact element={<Options />} />
                  <Route path="/optstore" exact element={<StoreOptions />} />
                  <Route path="/Waitlist" exact element={<WaitlistForm />} />
                </Routes>
              </Provider>
            </Router>
          </HuddleProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
