import React from "react";
import styled from "styled-components";
import chroma from "chroma-js";
import { Tooltip } from "@mui/material";
import Spinner from "../../atoms/spinner";
import Icon, { Sizes } from "../../atoms/icon";
import Build from "../../../../interfaces/build";
import CommonUtils from "../../../../utils/common-utils";
import { useHistory } from "react-router-dom";
import {
  getBuildDetailsUrl,
} from "../../../../constants/routes";
import ParallelLayout, { Column } from "../../layouts/parallel-layout";
import SerialLayout, { Row } from "../../layouts/serial-layout";
import Centered from "../../molecules/centered";
import { useDispatch, useSelector } from "react-redux";
import {
  getSessions
} from "../../../../store/selectors/entities/sessions-selector";
import {
  fetchSessionByBuildId,
  fetchSessionInit
} from "../../../../store/actions/session-actions";

const Container = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid
    ${(props) => chroma(props.theme.colors.border).brighten(0.7).hex()};
  cursor: pointer;
  background-color: ${(props) =>
  props.theme.colors.components.session_card_default_bg};

  &:hover {
    background-color: ${(props) => props.theme.colors.greyscale[4]};
  }

  &.active {
    background-color: ${(props) =>
  props.theme.colors.components.session_card_active_bg};
  }
`;

const Name = styled.div`
  font-weight: 400;
  font-size: 13px;
  text-transform: capitalize;
`;

const ExecutionTime = styled.div`
  color: ${(props) => props.theme.colors.greyscale[2]};
`;

type PropsType = {
  build: Build;
  selected: boolean;
};

function getDuration(startDate: Date) {
  return CommonUtils.convertTimeToReadableFormat(
    new Date(startDate),
    new Date(),
  ).split(" ")[0];
}

export default function BuildCard(props: PropsType) {
  const { build } = props;
  const { build_id, build_name , created_at, session } = build;

  const dispatch = useDispatch();
  const formattedStartTime = getDuration(created_at);
  const history = useHistory();

  return (
    <Container
      className={props.selected ? "active" : ""}
      onClick={() => {
        history.push(getBuildDetailsUrl(build_id));
        dispatch(fetchSessionByBuildId(build_id));
      }}
    >
      <ParallelLayout>
        <Column grid={11}>
          <SerialLayout>
            <Row padding="10px 30px 10px 0">
              <Name>{build_name}</Name>
            </Row>
            <Row padding="0 0 5px 0">
              <ParallelLayout>
                <Column grid={12}>
                  <ExecutionTime>{formattedStartTime} ago</ExecutionTime>
                </Column>
              </ParallelLayout>
            </Row>
          </SerialLayout>
        </Column>
        <Column grid={1}>
          <Centered>
            <>{session.total} tests</>
          </Centered>
        </Column>
      </ParallelLayout>
    </Container>
  );
}
