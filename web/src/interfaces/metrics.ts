export type MetricsKpis = {
  total: number;
  passed: number;
  failed: number;
  timeout: number;
  running: number;
  pass_rate: number;
  avg_duration_sec: number;
  flaky_tests: number;
  flaky_rate: number;
  unique_builds: number;
  unique_app_versions: number;
};

export type MetricsTrendPoint = {
  day: string;
  total: number;
  passed: number;
  failed: number;
  timeout: number;
  running: number;
  avg_duration_sec: number;
};

export type MetricsPlatformSplit = {
  platform: string;
  total: number;
  passed: number;
  failed: number;
  timeout: number;
  pass_rate: number;
};

export type MetricsTopFailingTest = {
  name: string;
  total: number;
  failed: number;
  passed: number;
  pass_rate: number;
  last_failure_at: string | null;
};

export type MetricsDeviceReliability = {
  device_name: string;
  udid: string;
  platform: string;
  total: number;
  passed: number;
  failed: number;
  timeout: number;
  pass_rate: number;
  avg_duration_sec: number;
};

export type MetricsBuildHealth = {
  build_id: string;
  build_name: string | null;
  user: string | null;
  platform: string;
  app_version: string | null;
  created_at: string | null;
  total: number;
  passed: number;
  failed: number;
  timeout: number;
  pass_rate: number;
  avg_duration_sec: number;
};

export type MetricsAppVersion = {
  app_version: string;
  total: number;
  passed: number;
  failed: number;
  timeout: number;
  pass_rate: number;
};

export type MetricsPayload = {
  range: { start: string; end: string };
  kpis: MetricsKpis;
  trend: MetricsTrendPoint[];
  platform_split: MetricsPlatformSplit[];
  top_failing_tests: MetricsTopFailingTest[];
  device_reliability: MetricsDeviceReliability[];
  build_health: MetricsBuildHealth[];
  app_versions: MetricsAppVersion[];
};

export type MetricsFilter = {
  days?: number;
  start?: string;
  end?: string;
  platform?: string;
  app_version?: string;
  user?: string;
};