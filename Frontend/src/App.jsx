import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import AuthorizationRoute from './layouts/authorization';
import NewPost from './components/NewPost';
import Posts from './components/Posts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route element={<AuthorizationRoute />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/post/:id" element={<Posts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
