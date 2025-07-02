import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blocked from "./pages/Blocked";
import Navbar from "./pages/Navbar";
import NoFound from "./pages/NoFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/admin/Dashboard";
import CreateTemplate from "./components/template/CreateTemplate";
import TemplateList from "./components/template/TemplateList";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./util/i18";
import EditTemplate from "./components/template/EditTemplate";
import VictorinaList from "./components/victorina/VictorinaList";
import Victorina from "./components/victorina/Victorina";


function App() {
  return (
    <div className="App">
      {console.log(process.env.REACT_APP_BASE_URL)}
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/victorinalist" element={<VictorinaList />} />
              <Route path="/victorina/:id" element={<Victorina />} />



              <Route path="/user/createtemplate" element={<CreateTemplate />} />
              <Route path="/user/templatelist" element={<TemplateList />} />
              <Route path="/user/edittemplate/:id" element={<EditTemplate />} />

              <Route path="/blocked" element={<Blocked />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NoFound />} />

            </Routes>
          </BrowserRouter>
        </I18nextProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
