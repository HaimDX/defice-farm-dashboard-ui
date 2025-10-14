import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Route,
  Router,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import {
  getBuildDetailsUrl,
  getSessionDetailsUrl
} from "../../constants/routes";
import { APP_HEADER_HEIGHT } from "../../constants/ui";
import { setSelectedSession } from "../../store/actions/session-actions";
import { getSessions } from "../../store/selectors/entities/sessions-selector";
import ParallelLayout, { Column } from "../UI/layouts/parallel-layout";
import SerialLayout, { Row } from "../UI/layouts/serial-layout";
import AppHeader from "../UI/organisms/app-header";
import SessionDetails from "../UI/organisms/session-details";
import SessionList from "../UI/organisms/session-list";
import BuildList from "../UI/organisms/build/build-list";
import { getBuilds } from "../../store/selectors/entities/builds-selector";
import { setSelectedBuild } from "../../store/actions/build-actions";
import { extractBuildIdFromUrl } from "../../utils/utility";

function extractSessionidFromUrl(url: string): string | null {
  const matches = url.match(new RegExp(/dashboard\/session\/(.*)/));
  return matches?.length ? matches[1] : null;
}

export default function DashboardTemplate() {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const sessions = useSelector(getSessions);
  const session_id = extractSessionidFromUrl(location.pathname);

  const builds = useSelector(getBuilds);
  const buildIdFromUrl = extractBuildIdFromUrl(location.pathname);

  useEffect(() => {
    const SelectedSession = !!session_id
      ? sessions.find((d) => d.session_id === session_id) || sessions[0]
      : sessions[0];

    if (SelectedSession) {
      if (session_id && session_id != SelectedSession.session_id) {
        history.push(getSessionDetailsUrl(SelectedSession.session_id));
      }
      dispatch(setSelectedSession(SelectedSession));
    }
  }, [session_id, sessions]);

  useEffect(() => {
    // Only update builds selection if we are on a build page
    if (!location.pathname.includes("/session/")) {
      const selectedBuild = !!buildIdFromUrl
        ? builds.find((d) => d.build_id === buildIdFromUrl) || builds[0]
        : builds[0];

      if (selectedBuild) {
        if (buildIdFromUrl && buildIdFromUrl != selectedBuild.build_id) {
          history.push(getBuildDetailsUrl(selectedBuild.build_id));
        }
        dispatch(setSelectedBuild(selectedBuild));
      }
    }

  }, [buildIdFromUrl, builds]);

  return (
    <SerialLayout>
      <Row height={`${APP_HEADER_HEIGHT}px`}>
        <AppHeader />
      </Row>
      <Row height={`calc(100vh - ${APP_HEADER_HEIGHT}px)`}>
        <ParallelLayout>

          {/** Build List View **/}
          <Column grid={2.5}>
            <BuildList />
          </Column>
          {/** End Build List View **/}


          {/** Sessions List View **/}
          <Column grid={2.5}>
            <SessionList />
          </Column>
          {/** End Session List View **/}


          {/** Session Details View **/}
          <Column grid={7.5}>
            <Router history={history}>
              <Switch>
                <Route>
                  <SessionDetails />
                </Route>
              </Switch>
            </Router>
          </Column>
          {/** End Session Details View **/}


        </ParallelLayout>
      </Row>
    </SerialLayout>
  );
}
