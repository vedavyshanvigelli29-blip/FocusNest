
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

/* Global styles */
import "./styles/globals.css";

/* Layout styles */
import "./styles/layout.css";

/* Page styles */
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/tasks.css";
import "./styles/timer.css";
import "./styles/goals.css";
import "./styles/analytics.css";
import "./styles/settings.css";

/* Other styles */
import "./styles/animations.css";
import "./styles/toast.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
