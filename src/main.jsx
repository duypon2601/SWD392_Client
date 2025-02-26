import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./components/redux/store"; // Import store Redux
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* Bọc toàn bộ ứng dụng trong Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
