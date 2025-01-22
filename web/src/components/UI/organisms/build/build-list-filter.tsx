import { useSelector } from "react-redux";
import {
  getBuildFilters,
} from "../../../../store/selectors/ui/filter-selector";
import React, { useCallback, useEffect, useState } from "react";
import SerialLayout, { Row } from "../../layouts/serial-layout";
import ParallelLayout, { Column } from "../../layouts/parallel-layout";
import Select from "../../atoms/select";
import { PLATFORM, PROJECT, USER } from "../../../../constants/build-filter-options";
import styled from "styled-components";
import Button from "../../atoms/button";

const Container = styled.div`
  width: 400px;
  padding: 10px;
`;

const Label = styled.div``;

const Control = styled.div``;

const Actions = styled.div``;

const StyledButton = styled(Button)`
  && {
    margin: 0px 10px;
  }
`;

type Propstype = {
  onApply: (payload: any) => void;
};

export default function BuildListFilter(props: Propstype) {
  const { onApply } = props;

  const filterState = useSelector(getBuildFilters);
  const [user,setUser] = useState(filterState.user);
  const [project,setProject] = useState(filterState.project);
  const [platformName,setPlatformName] = useState(filterState.platform_name);
  const [showClearButton, setShowClearButton] = useState(false);

  const apply = useCallback(() => {
    onApply({
      user,
      project,
      platformName
    });
  }, [user, project, platformName]);

  const reset = useCallback(() => {
    onApply({
      user,
      project,
      platformName
    });
  }, [user, project, platformName]);

  useEffect(() => {
    setShowClearButton(
      [user, project, platformName].some((val) => !!val));
  }, [user, project, platformName]);

  return (
    <Container>
      <SerialLayout>
        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>Platform:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Select
                  multiple={true}
                  options={PLATFORM}
                  onChange={(value) => setPlatformName(value)}
                  selected={platformName}
                />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>
        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>Project:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Select
                  multiple={true}
                  options={PROJECT}
                  onChange={(value) => setProject(value)}
                  selected={project}
                />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>

        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>User:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Select
                  multiple={false}
                  options={USER}
                  onChange={(value) => setUser(value)}
                  selected={user}
                />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>

        <Row align="center" padding="20px 0px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Actions>
                <StyledButton onClick={apply}>Apply</StyledButton>
              </Actions>
            </Column>
            {showClearButton ? (
              <Column grid={6}>
                <Actions>
                  <StyledButton onClick={reset}>Clear</StyledButton>
                </Actions>
              </Column>
            ) : (
              <></>
            )}
          </ParallelLayout>
        </Row>
      </SerialLayout>
    </Container>
  );


}