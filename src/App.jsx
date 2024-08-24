import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import QuizTakerQnAPage from "./pages/QuizTakerQnAPage.jsx";
import QuizTakerPollPage from "./pages/QuizTakerPollPage.jsx";
// import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics/:quizId" element={<AnalyticsPage />} />
        <Route path="/quiz/qna/:quizId" element={<QuizTakerQnAPage />} />
        <Route path="/quiz/poll/:quizId" element={<QuizTakerPollPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
