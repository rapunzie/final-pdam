import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import CommentTable from "./CommentTable";
import SummaryPage from "./SummaryPage";
import ChartsPage from "./Charts";
import SentimentAnalyzer from "./SentimentAnalyzer"; 

// import SummaryPage from "./SummaryPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<CommentTable />} />
          <Route path="charts" element={<ChartsPage />} />
          <Route path="/analyzer" element={<SentimentAnalyzer />} />
          <Route path="summary" element={<SummaryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}