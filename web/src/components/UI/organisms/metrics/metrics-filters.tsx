import React from "react";
import styled from "styled-components";
import { MetricsFilter } from "../../../../interfaces/metrics";

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8892a8;
  margin-right: 4px;
`;

const Group = styled.div`
  display: inline-flex;
  background: #13151d;
  border: 1px solid #1f2235;
  border-radius: 8px;
  overflow: hidden;
`;

const Chip = styled.button<{ active?: boolean }>`
  background: ${(p) => (p.active ? "rgba(91, 127, 255, 0.2)" : "transparent")};
  color: ${(p) => (p.active ? "#dde1ef" : "#8892a8")};
  border: none;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    color: #dde1ef;
    background: rgba(91, 127, 255, 0.1);
  }

  & + & {
    border-left: 1px solid #1f2235;
  }
`;

const Input = styled.input`
  background: #13151d;
  border: 1px solid #1f2235;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 12px;
  color: #dde1ef;
  outline: none;
  min-width: 140px;

  &::placeholder {
    color: #4a5068;
  }

  &:focus {
    border-color: #5b7fff;
  }
`;

type Props = {
  filter: MetricsFilter;
  onChange: (patch: Partial<MetricsFilter>) => void;
};

const RANGES: { label: string; days: number }[] = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

const PLATFORMS = ["ANDROID", "IOS"];

export default function MetricsFiltersBar({ filter, onChange }: Props) {
  const platformSet = new Set(
    (filter.platform || "").split(",").filter(Boolean)
  );

  const togglePlatform = (p: string) => {
    if (platformSet.has(p)) platformSet.delete(p);
    else platformSet.add(p);
    const next = Array.from(platformSet).join(",");
    onChange({ platform: next || undefined });
  };

  return (
    <Bar>
      <Label>Range</Label>
      <Group>
        {RANGES.map((r) => (
          <Chip
            key={r.days}
            active={filter.days === r.days}
            onClick={() => onChange({ days: r.days })}
          >
            {r.label}
          </Chip>
        ))}
      </Group>

      <Label>Platform</Label>
      <Group>
        {PLATFORMS.map((p) => (
          <Chip
            key={p}
            active={platformSet.has(p)}
            onClick={() => togglePlatform(p)}
          >
            {p}
          </Chip>
        ))}
      </Group>

      <Input
        placeholder="App version"
        value={filter.app_version || ""}
        onChange={(e) =>
          onChange({ app_version: e.target.value || undefined })
        }
      />
      <Input
        placeholder="User"
        value={filter.user || ""}
        onChange={(e) => onChange({ user: e.target.value || undefined })}
      />
    </Bar>
  );
}
