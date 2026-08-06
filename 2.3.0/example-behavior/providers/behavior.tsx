
import { BehaviorConfiguration, BehaviorResult, clearSessionData, initialize, setAutoLogoutAction, setPosition, setSessionId, setUserId, WgtFinishStatus } from "@fip360/widget-behavior-react-native";
import { LICENSE_APIKEY_ANDROID, LICENSE_APIKEY_IOS } from "../constants";
import { Platform } from "react-native";
import { getSessionId, getUUID } from "../apiRest";

export const launchInitialize = async (
setMessage: React.Dispatch<React.SetStateAction<string>>, 
setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
setShowError: React.Dispatch<React.SetStateAction<boolean>>, 
setSession: React.Dispatch<React.SetStateAction<string>>) => 
{ 
  console.log("Starting initialize...");
  setShowError(false);
  let config: BehaviorConfiguration = {
    licenseKey: Platform.OS === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID,
    enableSupportLogs: true
  };

  return await initialize(config)
  .then((result: BehaviorResult) => 
  {
    console.log("result", result);
    switch (result.finishStatus) 
    {
      case WgtFinishStatus.Ok: // OK
        setShowError(false);
        launchSetSessionId(setMessage, setTextColorMessage, setShowError, setSession);
        launchSetAutoLogoutAction();
        break;

      case WgtFinishStatus.Error: // Error
        setMessage(result.errorMessage || "Unknown error");
        setTextColorMessage("red");
        break;
    }
  })
  .finally(()=> {
    console.log("End initialize...");
  }).catch((error: any) => {
    console.log("Error initialize", error);
  });
};

export const launchClearSession = async (
  setSession: React.Dispatch<React.SetStateAction<string>>
) => 
{ 
  console.log("Starting launchClearSession...");

  return await clearSessionData()
  .then((result: BehaviorResult) => 
  {
    console.log("result", result);
    setSession('');
  })
  .finally(()=> {
    console.log("End launchClearSession...");
  }).catch((error: any) => {
    console.log("Error launchClearSession", error);
  });
};

export const launchSetAutoLogoutAction = async () => 
{ 
  console.log("Starting setAutoLogoutAction...");

  return await setAutoLogoutAction()
  .then((result: BehaviorResult) => 
  {
    console.log("result", result);
  })
  .finally(()=> {
    console.log("End setAutoLogoutAction...");
  }).catch((error: any) => {
    console.log("Error setAutoLogoutAction", error);
  });
};

export const launchSetUserId = async (
  setMessage: React.Dispatch<React.SetStateAction<string>>, 
  setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
  setShowError: React.Dispatch<React.SetStateAction<boolean>>, 
  user: string) => 
{ 
  console.log("Starting setUserId...");
  setShowError(false);

  return await setUserId(user)
  .then((result: BehaviorResult) => 
  {
    console.log("result", result);
    switch (result.finishStatus) 
    {
      case WgtFinishStatus.Ok: // OK
        setShowError(false);
        break;

      case WgtFinishStatus.Error: // Error
        setMessage(result.errorMessage || "Unknown error");
        setTextColorMessage("red");
        break;
    }
  })
  .finally(()=> {
    console.log("End setUserId...");
  }).catch((error: any) => {
    console.log("Error setUserId", error);
  });
};

export const launchSetSessionId = async (
setMessage: React.Dispatch<React.SetStateAction<string>>, 
setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
setShowError: React.Dispatch<React.SetStateAction<boolean>>, 
setSession: React.Dispatch<React.SetStateAction<string>>) => 
{ 
  console.log("Starting setSessionId...");
  setShowError(false);

  let res = await getSessionId("/api/init", {});
  console.log("getSessionId apiRest", res);

  let sessionId = res == null ? getUUID() : res.sessionId;

  return await setSessionId(sessionId)
  .then((result: BehaviorResult) => 
  {
    console.log("result", result);
    switch (result.finishStatus) 
    {
      case WgtFinishStatus.Ok: // OK
        setShowError(false);
        setSession(sessionId);
        break;

      case WgtFinishStatus.Error: // Error
        setMessage(result.errorMessage || "Unknown error");
        setTextColorMessage("red");
        break;
    }
  })
  .finally(()=> {
    console.log("End setSessionId...");
  }).catch((error: any) => {
    console.log("Error setSessionId", error);
  });
};

export const launchSetPosition = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
    setShowError: React.Dispatch<React.SetStateAction<boolean>>, 
    position: string) => 
{ 
  console.log("Starting setPosition...");
  setShowError(false);

  return await setPosition(position)
  .then((result: BehaviorResult) => 
  {
    console.log("result", result);
    switch (result.finishStatus) 
    {
      case WgtFinishStatus.Ok: // OK
        setShowError(false);
        break;

      case WgtFinishStatus.Error: // Error
        setMessage(result.errorMessage || "Unknown error");
        setTextColorMessage("red");
        break;
    }
  })
  .finally(()=> {
    console.log("End setPosition...");
  }).catch((error: any) => {
    console.log("Error setPosition", error);
  });
};