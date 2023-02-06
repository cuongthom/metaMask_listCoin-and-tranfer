import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Page/Home";
import Transfers from "./Page/Transfers";
import "antd/dist/antd.css";
import { useContext } from "react";
import { ThemeContext } from "./useContext/ThemeProvider";



function App() {
  const context = useContext(ThemeContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path={`/Transfers/${context.addressCoin}`} element={<Transfers />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
