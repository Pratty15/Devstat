import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function ImpactChart({ userData }) {
  const data = {
    labels: ["Stars", "Forks", "Activity"],

    datasets: [
      {
        label: "Ideal (High Impact)",
        data: [100, 100, 100],
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 2,
      },
      {
        label: "User",
        data: userData,
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: "#444" },
        grid: { color: "#444" },
        pointLabels: { color: "#ccc" },
        ticks: {
          backdropColor: "transparent",
          color: "#aaa",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}

export default ImpactChart;