import React from "react";
import ReactDOM from "react-dom";
import "./custom.scss";
import { Provider } from "react-redux";
import store from "../Shared/redux/store";
import App from "./app";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
