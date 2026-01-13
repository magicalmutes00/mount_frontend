
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import { ScrollToTop } from "./app/components/ScrollToTop.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
  