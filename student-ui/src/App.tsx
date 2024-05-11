import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CodeChallenge from "./pages/(challenges)/CodeChallenge";
import QuizChallenge from "./pages/(challenges)/QuizChallenge";
import LandingPage from "./pages/(marketing)/LandingPage";
import Login from "./pages/(auth)/Login";
import StyleGuide from "./pages/StyleGuide";
import SentEmail from "./pages/(auth)/SentEmail";
import Register from "./pages/(auth)/Register";
import NetworkToast from "./components/toasts/NetworkToast";
import RootLayout from "./pages/(root)/RootLayout";
import Courses from "./pages/(root)/Courses";
import Learn from "./pages/(root)/Learn";
import VerifyEmail from "./pages/(auth)/VerifyEmail";
import Lesson from "./pages/(challenges)/Lesson";
import Result from "./pages/(challenges)/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<RootLayout/>}>
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/learn/:id" element={<Learn/>}/>
          <Route path="/profile/:username"/>
          <Route path="/quests"/>
          <Route path="/leaderboard"/>
        </Route>
        <Route path="/challenge/:courseId/level/:levelId">
        <Route path="code"  element={<CodeChallenge />} />
        <Route path="quiz" element={<QuizChallenge />} />
        <Route path="lesson" element={<Lesson/>}/>
        <Route path="result" element={<Result/>}/>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password">
          <Route index />
          <Route path=":token" />
        </Route>
        <Route path="/sent-email" element={<SentEmail />} />
        <Route path="/verify-email/:email" element={<VerifyEmail/>} />
        <Route path="/style-guide" element={<StyleGuide />} />
      </Routes>
      <NetworkToast />
    </BrowserRouter>
  );
}

export default App;
