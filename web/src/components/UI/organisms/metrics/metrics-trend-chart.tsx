import React from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { MetricsTrendPoint } from "../../../../interfaces/metrics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Card = styled.div`
  background: #13151d;
  border: 1px solid #1f2235;
  border-radius: 10px;
  padding: 18px 20px;
`;

const Title2 = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #dde1ef;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ChartBox = styled.div`
  height: 240px;
`;

const baseOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "top",
      labels: { color: "#8892a8", usePointStyle: true, boxWidth: 8 },
    },
    tooltip: {
      backgroundColor: "rgba(12, 13, 18, 0.95)",
      borderColor: "#1f2235",
      borderWidth: 1,
      titleColor: "#dde1ef",
      bodyColor: "#dde1ef",
    },
  },
  scales: {
    x: {
      ticks: { color: "#8892a8", maxRotation: 0, autoSkip: true },
      grid: { color: "rgba(31, 34, 53, 0.5)" },
    },
    y: {
      ticks: { color: "#8892a8" },
      grid: { color: "rgba(31, 34, 53, 0.5)" },
      beginAtZero: true,
    },
  },
};

export function PassFailTrend({ trend }: { trend: MetricsTrendPoint[] }) {
  const data = {
    labels: trend.map((d) => d.day.slice(5)),
    datasets: [
      {
        label: "Passed",
        data: trend.map((d) => d.passed),
        backgroundColor: "#2dd975",
        stack: "s",
      },
      {
        label: "Failed",
        data: trend.map((d) => d.failed),
        backgroundColor: "#f45858",
        stack: "s",
      },
      {
        label: "Timeout",
        data: trend.map((d) => d.timeout),
        backgroundColor: "#e8c14a",
        stack: "s",
      },
    ],
  };
  const options = {
    ...baseOptions,
    scales: {
      x: { ...baseOptions.scales.x, stacked: true },
      y: { ...baseOptions.scales.y, stacked: true },
    },
  };
  return (
    <Card>
      <Title2>Sessions per day</Title2>
      <ChartBox>
        <Bar data={data} options={options} />
      </ChartBox>
    </Card>
  );
}

export function DurationTrend({ trend }: { trend: MetricsTrendPoint[] }) {
  const data = {
    labels: trend.map((d) => d.day.slice(5)),
    datasets: [
      {
        label: "Avg duration (s)",
        data: trend.map((d) => d.avg_duration_sec),
        borderColor: "#5b7fff",
        backgroundColor: "rgba(91, 127, 255, 0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };
  return (
    <Card>
      <Title2>Average session duration</Title2>
      <ChartBox>
        <Line data={data} options={baseOptions} />
      </ChartBox>
    </Card>
  );
}
