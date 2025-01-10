import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import TodoList from './ToDoList';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Route for TodoList with optional roomId */}
        <Route path="/todos/:roomId?" element={<TodoList />} />
      </Routes>
    </Router>
  );
};

