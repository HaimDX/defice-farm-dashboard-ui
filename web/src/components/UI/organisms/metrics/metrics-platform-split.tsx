import React from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MetricsPlatformSplit } from "../../../../interfaces/metrics";

ChartJS.register(ArcElement, Tooltip, Legend);

const Card = styled.div`
  background: #13151d;
  border: 1px solid #1f2235;
  border-radius: 10px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #dde1ef;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  align-items: center;
`;

const ChartBox = styled.div`
  width: 180px;
  height: 180px;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #dde1ef;
  padding-bottom: 8px;
  border-bottom: 1px solid #1f2235;
  &:last-child {
    border-bottom: none;
  }
`;

const Dot = styled.span<{ color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.color};
  margin-right: 8px;
`;

const COLORS = ["#5b7fff", "#2dd975", "#e8c14a", "#f45858", "#a06bff"];

export default function MetricsPlatformSplitView({
  data,
}: {
  data: MetricsPlatformSplit[];
}) {
  if (!data.length) {
    return (
      <Card>
        <Title>Platform split</Title>
        <div style={{ color: "#8892a8", fontSize: 12 }}>No data</div>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => d.platform),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: "#0c0d12",
        borderWidth: 2,
      },
    ],
  };
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(12, 13, 18, 0.95)",
        borderColor: "#1f2235",
        borderWidth: 1,
        titleColor: "#dde1ef",
        bodyColor: "#dde1ef",
      },
    },
  };

  return (
    <Card>
      <Title>Platform split</Title>
      <Body>
        <ChartBox>
          <Doughnut data={chartData} options={options} />
        </ChartBox>
        <Stats>
          {data.map((d, i) => (
            <Row key={d.platform}>
              <span>
                <Dot color={COLORS[i % COLORS.length]} />
                {d.platform}
              </span>
              <span style={{ color: "#8892a8" }}>
                {d.total} · {d.pass_rate.toFixed(1)}% pass
              </span>
            </Row>
          ))}
        </Stats>
      </Body>
    </Card>
  );
}
