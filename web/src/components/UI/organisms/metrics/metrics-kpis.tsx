import React from "react";
import styled from "styled-components";
import { MetricsKpis } from "../../../../interfaces/metrics";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: #13151d;
  border: 1px solid #1f2235;
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 11px;
  color: #8892a8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const Value = styled.div<{ accent?: string }>`
  font-size: 24px;
  font-weight: 600;
  color: ${(p) => p.accent || "#dde1ef"};
`;

const Sub = styled.div`
  font-size: 11px;
  color: #8892a8;
`;

function fmtDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "—";
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export default function MetricsKpiRow({ kpis }: { kpis: MetricsKpis }) {
  const passColor = kpis.pass_rate >= 90 ? "#2dd975" : kpis.pass_rate >= 70 ? "#e8c14a" : "#f45858";
  return (
    <Grid>
      <Card>
        <Label>Total sessions</Label>
        <Value>{kpis.total.toLocaleString()}</Value>
        <Sub>
          {kpis.passed} passed · {kpis.failed} failed
          {kpis.timeout ? ` · ${kpis.timeout} timeout` : ""}
          {kpis.running ? ` · ${kpis.running} running` : ""}
        </Sub>
      </Card>
      <Card>
        <Label>Pass rate</Label>
        <Value accent={passColor}>{kpis.pass_rate.toFixed(1)}%</Value>
        <Sub>of completed sessions</Sub>
      </Card>
      <Card>
        <Label>Avg duration</Label>
        <Value>{fmtDuration(kpis.avg_duration_sec)}</Value>
        <Sub>per session</Sub>
      </Card>
      <Card>
        <Label>Flaky tests</Label>
        <Value accent={kpis.flaky_rate > 5 ? "#e8c14a" : "#dde1ef"}>
          {kpis.flaky_tests}
        </Value>
        <Sub>{kpis.flaky_rate.toFixed(1)}% of named tests</Sub>
      </Card>
      <Card>
        <Label>Builds</Label>
        <Value>{kpis.unique_builds}</Value>
        <Sub>tested in window</Sub>
      </Card>
      <Card>
        <Label>App versions</Label>
        <Value>{kpis.unique_app_versions}</Value>
        <Sub>distinct</Sub>
      </Card>
    </Grid>
  );
}
