import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SentimentClassifier from "./components/SentimentClassifier";
import CategoryBrowser from "./components/CategoryBrowser";
import CategoryDetail from "./components/CategoryDetail";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classify" element={<SentimentClassifier />} />
          <Route path="/categories" element={<CategoryBrowser />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
        </Routes>
      </main>
      <footer className="max-w-5xl mx-auto px-6 py-10 border-t border-line mt-10">
        <p className="font-mono text-xs text-inkfade">
          Field Notes — built on a DistilBERT sentiment model, TF-IDF/KMeans
          clustering, and an LLM-generated category summary.
        </p>
      </footer>
    </div>
  );
}
