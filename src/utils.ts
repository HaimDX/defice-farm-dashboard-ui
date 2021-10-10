import { SessionInfo } from "./types/session-info";
import fetch from "node-fetch";
const circularjson = require("circular-json");
import { routeToCommandName as _routeToCommandName } from "appium-base-driver";
import { log } from "./logger";

function getSessionDetails(sessionResponse: any): any {
  console.log(sessionResponse.value);
  let [session_id, caps] = sessionResponse.value;
  let sessionInfo: SessionInfo = {
    session_id,
    platform: caps.platform,
    platform_name: caps.platformName.toUpperCase(),
    automation_name: caps.automationName,
    app: caps.app,
    udid: caps.platformName.toLowerCase() == "ios" ? caps.udid : caps.deviceUDID,
    capabilities: {} as any,
  };

  Object.keys(caps)
    .filter((k) => Object.keys(sessionInfo).indexOf(k) == -1)
    .forEach((k: string) => ((sessionInfo.capabilities as any)[k] = caps[k]));

  return sessionInfo;
}

function getDriverEndpoint(driver: any) {
  let { address, port, basePath } = driver.opts;
  return `http://${address}:${port}${basePath != "" ? "/" + basePath : ""}`;
}

async function makePostCall(driver: any, sessionId: string, path: string, body: any): Promise<any> {
  log.info(`enpoint ${getDriverEndpoint(driver)}/session/${sessionId}/${path}`);
  const response = await fetch(`${getDriverEndpoint(driver)}/session/${sessionId}/${path}`, {
    method: "post",
    body: body ? JSON.stringify(body) : "{}",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
}

async function startScreenRecording(driver: any, sessionId: string) {
  return await makePostCall(driver, sessionId, "appium/start_recording_screen", {
    options: {
      videoType: "mpeg4",
    },
  });
}

async function stopScreenRecording(driver: any, sessionId: string) {
  return await makePostCall(driver, sessionId, "appium/stop_recording_screen", {});
}

function interceptProxyResponse(response: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const defaultWrite = response.write;
    const defaultEnd = response.end;
    const chunks: any = [];

    response.write = (...restArgs: any) => {
      chunks.push(Buffer.from(restArgs[0]));
      defaultWrite.apply(response, restArgs);
    };
    response.end = (...restArgs: any) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString("utf8");
      defaultEnd.apply(response, restArgs);
      resolve(JSON.parse(body));
    };
  });
}

function routeToCommand(proxyReqRes: any) {
  return {
    commandName: _routeToCommandName(proxyReqRes[0].originalUrl, proxyReqRes[0].method),
    newargs: [proxyReqRes[0].body, proxyReqRes[proxyReqRes.length - 1]],
  };
}

export { getSessionDetails, startScreenRecording, stopScreenRecording, interceptProxyResponse, routeToCommand };
