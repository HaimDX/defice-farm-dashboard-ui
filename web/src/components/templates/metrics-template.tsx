import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { APP_HEADER_HEIGHT } from "../../constants/ui";
import { Header } from "../UI/organisms/header/header";
import SerialLayout, { Row } from "../UI/layouts/serial-layout";
import MetricsFiltersBar from "../UI/organisms/metrics/metrics-filters";
import MetricsKpiRow from "../UI/organisms/metrics/metrics-kpis";
import {
  PassFailTrend,
  DurationTrend,
} from "../UI/organisms/metrics/metrics-trend-chart";
import MetricsPlatformSplitView from "../UI/organisms/metrics/metrics-platform-split";
import {
  AppVersionTable,
  BuildHealthTable,
  DeviceReliabilityTable,
  TopFailingTestsTable,
} from "../UI/organisms/metrics/metrics-tables";
import Spinner from "../UI/atoms/spinner";
import {
  fetchMetricsInit,
  setMetricsFilter,
} from "../../store/actions/metrics-actions";
import {
  getIsMetricsLoading,
  getMetricsData,
  getMetricsError,
  getMetricsFilter,
} from "../../store/selectors/entities/metrics-selector";
import { MetricsFilter } from "../../interfaces/metrics";

const Page = styled.div`
  height: calc(100vh - ${APP_HEADER_HEIGHT}px);
  overflow-y: auto;
  padding: 28px 32px 64px 32px;
  background: #0c0d12;
`;

const PageHeading = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #dde1ef;
  margin: 0 0 6px 0;
`;

const SubHeading = styled.div`
  font-size: 12px;
  color: #8892a8;
  margin-bottom: 24px;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const FullRow = styled.div`
  margin-bottom: 16px;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
`;

const ErrorBox = styled.div`
  color: #f45858;
  background: rgba(244, 88, 88, 0.08);
  border: 1px solid rgba(244, 88, 88, 0.3);
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 13px;
`;

export default function MetricsTemplate() {
  const dispatch = useDispatch();
  const data = useSelector(getMetricsData);
  const filter = useSelector(getMetricsFilter);
  const isLoading = useSelector(getIsMetricsLoading);
  const error = useSelector(getMetricsError);

  useEffect(() => {
    dispatch(fetchMetricsInit(filter));
  }, []);

  const handleFilterChange = (patch: Partial<MetricsFilter>) => {
    dispatch(setMetricsFilter(patch));
  };

  return (
    <SerialLayout>
      <Row height={`${APP_HEADER_HEIGHT}px`}>
        <Header />
      </Row>
      <Row height={`calc(100vh - ${APP_HEADER_HEIGHT}px)`}>
        <Page>
          <PageHeading>Metrics</PageHeading>
          <SubHeading>
            Analytics and reporting across recent test runs and builds
          </SubHeading>

          <MetricsFiltersBar filter={filter} onChange={handleFilterChange} />

          {error && <ErrorBox>{error}</ErrorBox>}

          {isLoading && !data ? (
            <Center>
              <Spinner />
            </Center>
          ) : data ? (
            <>
              <MetricsKpiRow kpis={data.kpis} />

              <TwoCol>
                <PassFailTrend trend={data.trend} />
                <MetricsPlatformSplitView data={data.platform_split} />
              </TwoCol>

              <FullRow>
                <DurationTrend trend={data.trend} />
              </FullRow>

              <FullRow>
                <BuildHealthTable rows={data.build_health} />
              </FullRow>

              <TwoCol>
                <TopFailingTestsTable rows={data.top_failing_tests} />
                <AppVersionTable rows={data.app_versions} />
              </TwoCol>

              <FullRow>
                <DeviceReliabilityTable rows={data.device_reliability} />
              </FullRow>
            </>
          ) : null}
        </Page>
      </Row>
    </SerialLayout>
  );
}
