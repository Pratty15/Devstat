import { useState } from "react";
import axios from "axios";
import HeatBar from "./components/HeatBar";
import ImpactChart from "./components/ImpactChart";

function App() {
  const [username, setUsername] = useState("");
  const [impact, setImpact] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");
    setImpact("");
    setStats(null);

    try {
      const res = await axios.post("http://localhost:5000/predict", {
        username,
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        const stats = res.data.stats;
        const mlImpact = res.data.impact;

        setStats(stats);

        // ✅ NORMALIZE FIRST
        const stars = normalize(stats.stars, 10000);
        const forks = normalize(stats.forks, 2000);
        const activity = normalize(stats.activity, 5000);

        // ✅ USE SAME VALUES FOR EVERYTHING
        const avg = Math.round((stars + forks + activity) / 3);

        // ✅ DATA-FIRST LOGIC
        let finalImpact;
        if (avg < 25) finalImpact = "LOW";
        else if (avg <= 50) finalImpact = "MEDIUM";
        else finalImpact = "HIGH";

        // ✅ ML REFINEMENT (only adjust)
        if (mlImpact === "HIGH" && avg > 45) finalImpact = "HIGH";
        if (mlImpact === "LOW" && avg < 30) finalImpact = "LOW";

        setImpact(finalImpact);
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  };

  // 🔥 NORMALIZATION (same everywhere)
  const normalize = (value, max) => {
    if (!value || value <= 0) return 0;

    const scaled =
      Math.log10(value + 1) / Math.log10(max + 1);

    return Math.min(Math.round(scaled * 100), 100);
  };

  // 🔥 NORMALIZED DATA (single source of truth)
  const normalized = stats
    ? {
        stars: normalize(stats.stars, 10000),
        forks: normalize(stats.forks, 2000),
        activity: normalize(stats.activity, 5000),
      }
    : { stars: 0, forks: 0, activity: 0 };

  // 🔥 CHART
  const chartData = [
    normalized.stars,
    normalized.forks,
    normalized.activity,
  ];

  // 🔥 OVERALL (NOW CORRECT)
  const overall = Math.round(
    (normalized.stars +
      normalized.forks +
      normalized.activity) /
      3
  );

  const getColor = () => {
    if (impact === "HIGH") return "text-green-500";
    if (impact === "MEDIUM") return "text-yellow-400";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">

      <h1 className="text-5xl font-bold mb-6">DevStat 🚀</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="px-4 py-2 rounded bg-slate-800 border border-slate-600"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />

        <button
          onClick={check}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded mb-4">
          ❌ {error}
        </div>
      )}

      {loading && <p className="text-gray-400">Analyzing...</p>}

      {impact && stats && !loading && !error && (
        <div className="bg-slate-800 p-6 rounded-xl w-[420px] text-center">

          <h2 className="text-xl mb-4">Impact Level</h2>

          {/* Lights */}
          <div className="flex justify-center gap-4 mb-4">
            <div className={`w-6 h-6 rounded-full ${impact === "LOW" ? "bg-red-500" : "bg-gray-600"}`}></div>
            <div className={`w-6 h-6 rounded-full ${impact === "MEDIUM" ? "bg-yellow-400" : "bg-gray-600"}`}></div>
            <div className={`w-6 h-6 rounded-full ${impact === "HIGH" ? "bg-green-500" : "bg-gray-600"}`}></div>
          </div>

          <h3 className={`text-3xl font-bold ${getColor()}`}>
            {impact}
          </h3>

          <p className="text-gray-400 mt-2">
            Overall Score: {overall}
          </p>

          {/* Heatmap */}
          <div className="mt-6 text-left">
            <h4 className="mb-2 text-gray-300">Developer Stats</h4>

            <div className="space-y-3">
              <HeatBar label="Stars" value={normalized.stars} />
              <HeatBar label="Forks" value={normalized.forks} />
              <HeatBar label="Activity" value={normalized.activity} />
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6">
            <h4 className="mb-2 text-gray-300 text-left">
              Performance vs Ideal
            </h4>

            <ImpactChart userData={chartData} />
          </div>

        </div>
      )}
    </div>
  );
}

export default App;