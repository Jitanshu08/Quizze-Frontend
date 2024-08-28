import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import QuizAnalysisPage from "./pages/QuizAnalysisPage";
import LiveQuizInterface from "./pages/LiveQuizInterface";
import QuizCompletionPage from "./pages/QuizCompletionPage";
import PollCompletionPage from "./pages/PollCompletionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/quiz-analysis/:quizId" element={<QuizAnalysisPage />} />
        <Route path="/quiz/:quizId" element={<LiveQuizInterface />} />
        <Route path="/quiz-completion" element={<QuizCompletionPage />} />
        <Route path="/poll-completion" element={<PollCompletionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
