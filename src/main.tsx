import "./normalize.scss";
import "./globals.scss";
import "./colors.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { DataProvider } from "./Reducers/dataContexReducer.tsx";
import { ActionProvider } from "./Reducers/actionContexReducer.tsx";
import { ActiveProvider } from "./Reducers/activeContextReducer.tsx";
import { TaskProvider } from "./Reducers/taskContexReducer.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataProvider>
      <ActionProvider>
        <ActiveProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </ActiveProvider>
      </ActionProvider>
    </DataProvider>
  </React.StrictMode>
);
