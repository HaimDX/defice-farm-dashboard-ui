import React, { useMemo } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { DEVICE_FILTERS, PLATFORM, STATUS } from "../../../../constants/session";
import { getSessionFilters } from "../../../../store/selectors/ui/filter-selector";
import Button from "../../atoms/button";
import Input from "../../atoms/input";
import Select from "../../atoms/select";
import ParallelLayout, { Column } from "../../layouts/parallel-layout";
import SerialLayout, { Row } from "../../layouts/serial-layout";

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
  platform: "ios" | "android" | undefined;
  onApply: (payload: any) => void;
};

export default function SessionListFilter(props: Propstype) {
  const { onApply,platform } = props;
  const filterState = useSelector(getSessionFilters);
  const [status, setStatus] = useState(filterState.status);
  const [device_udid, setUuid] = useState(filterState.device_udid);
  const [showClearButton, setShowClearButton] = useState(false);
  const [deviceName, setDeviceName] = useState(filterState.deviceName)

  // Memoize available devices based on the platform of the selected build
  const deviceNames = useMemo(() => {
    if (platform && DEVICE_FILTERS[platform]) {
      return Object.keys(DEVICE_FILTERS[platform]);
    }
    return [];
  }, [platform]);

  const apply = useCallback(() => {
    onApply({
      status: status,
      device_udid,
      deviceName,
    });
  }, [status, device_udid,deviceName]);

  const reset = useCallback(() => {
    onApply({
      status: [],
      device_udid: "",
      deviceName : ""
    });
  }, [ status, device_udid,deviceName]);

  useEffect(() => {
    setShowClearButton(
      [ status, device_udid, deviceName].some((val) => !!val));
  }, [status, device_udid, deviceName]);

  return (
    <Container>
      <SerialLayout>

        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>Status:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Select
                  multiple={true}
                  options={STATUS}
                  onChange={(value) => setStatus(value)}
                  selected={status}
                />
              </Control>
            </Column>
          </ParallelLayout>
        </Row>

        {/* Device Filter */}
        {platform && deviceNames.length > 0 ? (
          <Row padding="10px 0px">
            <ParallelLayout>
              <Column grid={6}>
                <Label>Device:</Label>
              </Column>
              <Column grid={6}>
                <Control>
                  <Select
                    options={deviceNames}
                    onChange={(value) => {
                      const selectedDeviceUDID =
                        DEVICE_FILTERS[platform][value];
                      setDeviceName(value);
                      setUuid(selectedDeviceUDID); // Update device UDID when a device is selected
                    }}
                    selected={deviceName}
                  />
                </Control>
              </Column>
            </ParallelLayout>
          </Row>
        ) : platform === undefined ? (
          <Row padding="10px 0px">
            <Label>Select a build first</Label>
          </Row>
        ) : (
          <Row padding="10px 0px">
            <Label>No devices available for this platform</Label>
          </Row>
        )}

        <Row padding="10px 0px">
          <ParallelLayout>
            <Column grid={6}>
              <Label>UDID:</Label>
            </Column>
            <Column grid={6}>
              <Control>
                <Input
                  onChange={(e) => setUuid(e.target.value)}
                  value={device_udid}
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
