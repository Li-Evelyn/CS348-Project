import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./components/home";
import LoginPage from "./components/login";
import RegisterPage from "./components/register";
import Dashboard from "./components/dashboard";
import DebugPage from "./components/debug";
import ErrorPage from "./components/error_page";
import ReactDOM from 'react-dom/client';
import './index.css';
import './style.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

export default function App() {
  // since this is the parent component, we want to handle all global state here
  // (ex. authentication, user infomation, courses lists) and pass them down to the 
  // children components

  // instead of a student dashboard, maybe have a general dashboard and 
  // render the same kinds of elements with different onClicks?

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="login" element={<LoginPage />}/>
          <Route path="register" element={<RegisterPage />}/>
          <Route path="debug" element={<DebugPage />}/>
          <Route path="student/courses" element={<Dashboard view='c'/>} />
          <Route path="staff/courses" element={<Dashboard view='c'/>} />
          <Route path="student/courses/*" element={<Dashboard view='a'/>} />
          <Route path="staff/courses/*" element={<Dashboard view='a'/>} />
          <Route path="student/assignment/*" element={<Dashboard view='q'/>} /> 
          <Route path="staff/assignment/*" element={<Dashboard view='q'/>} />
          <Route exact path="staff/createAssignment/*" element={<Dashboard view='ca'/>} /> 
          <Route path="staff/grading/*" element={<Dashboard view='g'/>} />
          <Route path="*" element={<ErrorPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
