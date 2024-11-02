import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Components/User/Login';
import Register from './Components/User/Register';
import Category from './Components/CRUD/Category';
import Package from './Components/CRUD/Package';
import User from './Components/CRUD/User';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Only include Login and Register routes */}
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/category" element={<Category />} exact="true" />
          <Route path="/package" element={<Package />} exact="true" />
          <Route path="/user" element={<User />} exact="true" />
        </Routes>
      </Router>

      {/* Toast container for notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
