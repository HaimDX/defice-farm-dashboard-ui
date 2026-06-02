import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import {
  MetricsBuildHealth,
  MetricsDeviceReliability,
  MetricsTopFailingTest,
  MetricsAppVersion,
} from "../../../../interfaces/metrics";
import { getBuildDetailsUrl } from "../../../../constants/routes";

const Card = styled.div`
  background: #13151d;
  border: 1px solid #1f2235;
  border-radius: 10px;
  padding: 18px 20px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #dde1ef;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Table = styled.div`
  display: block;
  width: 100%;
  overflow-x: auto;
`;

const TableInner = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  color: #dde1ef;

  th,
  td {
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid #1f2235;
    white-space: nowrap;
  }

  th {
    font-size: 11px;
    font-weight: 500;
    color: #8892a8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  tbody tr:hover {
    background: #1a1d28;
  }

  tbody tr {
    cursor: default;
  }

  tbody tr.clickable {
    cursor: pointer;
  }
`;

const Pill = styled.span<{ color: string }>`
  color: ${(p) => p.color};
  font-weight: 600;
`;

const Empty = styled.div`
  color: #8892a8;
  font-size: 12px;
  padding: 12px 0;
`;

function passRateColor(rate: number) {
  if (rate >= 90) return "#2dd975";
  if (rate >= 70) return "#e8c14a";
  return "#f45858";
}

function fmtDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "—";
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function TopFailingTestsTable({
  rows,
}: {
  rows: MetricsTopFailingTest[];
}) {
  return (
    <Card>
      <Title>Top failing tests</Title>
      {!rows.length ? (
        <Empty>No failing tests in this window 🎉</Empty>
      ) : (
        <Table>
          <TableInner>
            <thead>
              <tr>
                <th>Test</th>
                <th>Failed</th>
                <th>Passed</th>
                <th>Pass rate</th>
                <th>Last failure</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td title={r.name}>
                    {r.name.length > 70 ? r.name.slice(0, 70) + "…" : r.name}
                  </td>
                  <td>
                    <Pill color="#f45858">{r.failed}</Pill>
                  </td>
                  <td>{r.passed}</td>
                  <td>
                    <Pill color={passRateColor(r.pass_rate)}>
                      {r.pass_rate.toFixed(1)}%
                    </Pill>
                  </td>
                  <td style={{ color: "#8892a8" }}>
                    {r.last_failure_at
                      ? moment(r.last_failure_at).fromNow()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableInner>
        </Table>
      )}
    </Card>
  );
}

export function DeviceReliabilityTable({
  rows,
}: {
  rows: MetricsDeviceReliability[];
}) {
  return (
    <Card>
      <Title>Device reliability</Title>
      {!rows.length ? (
        <Empty>No device data</Empty>
      ) : (
        <Table>
          <TableInner>
            <thead>
              <tr>
                <th>Device</th>
                <th>Platform</th>
                <th>Sessions</th>
                <th>Pass rate</th>
                <th>Avg duration</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.device_name}-${r.udid}`}>
                  <td>
                    <div>{r.device_name}</div>
                    <div style={{ color: "#8892a8", fontSize: 11 }}>
                      {r.udid}
                    </div>
                  </td>
                  <td style={{ color: "#8892a8" }}>{r.platform}</td>
                  <td>{r.total}</td>
                  <td>
                    <Pill color={passRateColor(r.pass_rate)}>
                      {r.pass_rate.toFixed(1)}%
                    </Pill>
                  </td>
                  <td style={{ color: "#8892a8" }}>
                    {fmtDuration(r.avg_duration_sec)}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableInner>
        </Table>
      )}
    </Card>
  );
}

export function BuildHealthTable({ rows }: { rows: MetricsBuildHealth[] }) {
  const history = useHistory();
  return (
    <Card>
      <Title>Recent builds</Title>
      {!rows.length ? (
        <Empty>No builds</Empty>
      ) : (
        <Table>
          <TableInner>
            <thead>
              <tr>
                <th>Build</th>
                <th>User</th>
                <th>Platform</th>
                <th>App version</th>
                <th>Sessions</th>
                <th>Pass rate</th>
                <th>Avg duration</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.build_id}
                  className="clickable"
                  onClick={() => history.push(getBuildDetailsUrl(r.build_id))}
                >
                  <td>{r.build_name || r.build_id}</td>
                  <td style={{ color: "#8892a8" }}>{r.user || "—"}</td>
                  <td style={{ color: "#8892a8" }}>{r.platform || "—"}</td>
                  <td style={{ color: "#8892a8" }}>{r.app_version || "—"}</td>
                  <td>{r.total}</td>
                  <td>
                    <Pill color={passRateColor(r.pass_rate)}>
                      {r.pass_rate.toFixed(1)}%
                    </Pill>
                  </td>
                  <td style={{ color: "#8892a8" }}>
                    {fmtDuration(r.avg_duration_sec)}
                  </td>
                  <td style={{ color: "#8892a8" }}>
                    {r.created_at ? moment(r.created_at).fromNow() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableInner>
        </Table>
      )}
    </Card>
  );
}

export function AppVersionTable({ rows }: { rows: MetricsAppVersion[] }) {
  return (
    <Card>
      <Title>App version breakdown</Title>
      {!rows.length ? (
        <Empty>No version data</Empty>
      ) : (
        <Table>
          <TableInner>
            <thead>
              <tr>
                <th>App version</th>
                <th>Sessions</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Pass rate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.app_version}>
                  <td>{r.app_version}</td>
                  <td>{r.total}</td>
                  <td>{r.passed}</td>
                  <td>
                    <Pill color="#f45858">{r.failed}</Pill>
                  </td>
                  <td>
                    <Pill color={passRateColor(r.pass_rate)}>
                      {r.pass_rate.toFixed(1)}%
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableInner>
        </Table>
      )}
    </Card>
  );
}
