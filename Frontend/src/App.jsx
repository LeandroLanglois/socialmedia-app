import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import AuthorizationRoute from './layouts/authorization';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<AuthorizationRoute />}>
          <Route index element={<Feed />} />
        </Route>
    
      </Routes>
    </Router>
  );
}

export default App;