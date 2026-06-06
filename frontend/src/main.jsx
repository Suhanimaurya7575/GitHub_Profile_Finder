import React from "react";
import ReactDom from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import "./index.css";


ReactDom.createRoot(document.getElementById("root")).render(

  <BrowserRouter>
  <App/>
  </BrowserRouter>
  
);