import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import NetworkToast from "./components/toasts/NetworkToast";
import RootLayout from "./pages/(root)/RootLayout";
import { Spinner } from "./components/ui/spinner";
import LandingPage from "./pages/(marketing)/LandingPage";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { LearnLayout } from "./pages/(root)/(learn)/LearnLayout";
import Register from "./pages/(auth)/Register";
import Login from "./pages/(auth)/Login";
// Lazy-loaded component
const CodeSubmissions = lazy(() => import("./pages/(challenges)/CodeSubmissions"));
const CodeChallenge = lazy(() => import("./pages/(challenges)/CodeChallenge"));
const QuizChallenge = lazy(() => import("./pages/(challenges)/QuizChallenge"));
const StyleGuide = lazy(() => import("./pages/StyleGuide"));
const SentEmail = lazy(() => import("./pages/(auth)/SentEmail"));
const Courses = lazy(() => import("./pages/(root)/(learn)/Courses"));
const Learn = lazy(() => import("./pages/(root)/(learn)/Learn"));
const VerifyEmail = lazy(() => import("./pages/(auth)/VerifyEmail"));
const Lesson = lazy(() => import("./pages/(challenges)/Lesson"));
const Result = lazy(() => import("./pages/(challenges)/Result"));
const Leaderboard = lazy(() => import("./pages/(root)/Leaderboard"));
const Profile = lazy(() => import("./pages/(root)/Profile"));
const Quests = lazy(() => import("./pages/(root)/Quests"));
function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Spinner
            variant="round"
            size="md"
            containerType="full"
            containerBackground="blur"
            withContainer
          />
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<ProtectedRoute/>}>   
          <Route element={<RootLayout />}>
          <Route element={<LearnLayout/>}>
            <Route path="/courses" element={<Courses />} />
            <Route path="/learn/:id" element={<Learn />} />
          </Route>
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/quests" element={<Quests/>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="/challenge/:courseId/level/:levelId">
            <Route path="code" element={<CodeChallenge />} />
            <Route path="code-submissions" element={<CodeSubmissions/>}/>
            <Route path="quiz" element={<QuizChallenge />} />
            <Route path="lesson" element={<Lesson />} />
            <Route path="result" element={<Result />} />
          </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password">
            <Route index />
            <Route path=":token" />
          </Route>
          <Route path="/sent-email" element={<SentEmail />} />
          <Route path="/verify-email/:email" element={<VerifyEmail />} />
          <Route path="/style-guide" element={<StyleGuide />} />
        </Routes>
      </Suspense>
      <NetworkToast />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
