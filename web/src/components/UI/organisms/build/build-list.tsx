import React from "react";
import styled from "styled-components";
import EmptyMessage from "../../molecules/empty-message";
import SerialLayout, { Row } from "../../layouts/serial-layout";
import { useDispatch, useSelector } from "react-redux";

import { useCallback } from "react";
import { useEffect } from "react";
import {
  APP_HEADER_HEIGHT,
  SUB_APP_HEADER_HEIGHT,
} from "../../../../constants/ui";
import { getHeaderStyle } from "../../../../utils/ui";
import Utils from "../../../../utils/common-utils";
import {
  addPollingTask,
  removePollingTask,
} from "../../../../store/actions/polling-actions";
import {
  getBuilds, getSelectedBuild
} from "../../../../store/selectors/entities/builds-selector";
import {
  fetchBuildInit,
  setBuildFilter
} from "../../../../store/actions/build-actions";
import Build from "../../../../interfaces/build";
import BuildCard from "./build-card";

const Container = styled.div`
  border-right: 1px solid #ced8e1;
  width: 100%;
`;

const List = styled.div``;

const Header = styled.div`
  ${(props) => getHeaderStyle(props.theme)};
  padding: 7px 5px;
`;

function getFiltersFromQueryParams(searchQuery: string) {
  const urlParams = new URLSearchParams(searchQuery);

  const allowedFilters: any = {
    name: "",
    os: {
      valid: ["ios", "android"],
    },
    status: {
      valid: ["running", "failed", "passed", "timeout"],
    },
    device_udid: "",
    start_time: {
      valid: (dateString: string) => {
        return !isNaN(new Date(dateString).getDate());
      },
    },
  };

  return Utils.parseJsonSchema(
    allowedFilters,
    Utils.urlParamsToObject(urlParams),
  );
}

export default function BuildList() {
  const dispatch = useDispatch();
  const builds = useSelector(getBuilds);
  const urlFilters = getFiltersFromQueryParams(window.location.search);
  const selectedBuild = useSelector(getSelectedBuild);


  useEffect(() => {
    if (Object.keys(urlFilters).length) {
      setFilter(urlFilters);
    } else {
      dispatch(fetchBuildInit());
    }
  }, []);

  useEffect(() => {
    dispatch(addPollingTask(fetchBuildInit()));

    return () => {
      dispatch(removePollingTask(fetchBuildInit()));
    };
  }, []);

  const setFilter = useCallback((payload) => {
    dispatch(setBuildFilter(payload));

    /* Reset session polling with newly applied filters */
    dispatch(removePollingTask(fetchBuildInit()));
    dispatch(addPollingTask(fetchBuildInit(payload)));
  }, []);

  useEffect(() => {
    if (!selectedBuild) {
      dispatch(fetchBuildInit());
    }
  }, [selectedBuild]);


  /** Add polling for builds **/

  // useEffect(() => {
  //   dispatch(addPollingTask(fetchSessionInit()));
  //
  //   return () => {
  //     dispatch(removePollingTask(fetchSessionInit()));
  //   };
  // }, []);


  return (
    <Container>
      <SerialLayout>
        <Row height={`${SUB_APP_HEADER_HEIGHT}px`}>
          <Header>
            <span>Builds</span>
          </Header>
        </Row>
        <Row
          height={`calc(100vh - ${
            SUB_APP_HEADER_HEIGHT + APP_HEADER_HEIGHT
          }px)`}
          scrollable
        >
          <List>
            {builds.length > 0 ? (
              <>
                {builds.map((build: Build) => (
                 <BuildCard
                   key = {build.build_id}
                   build={build}
                   selected={ selectedBuild?.build_id === build.build_id
                 }/>
                ))}
              </>
            ) : (
              <EmptyMessage>No Builds found for given filter.</EmptyMessage>
            )}
          </List>
        </Row>
      </SerialLayout>
    </Container>
  );
}
