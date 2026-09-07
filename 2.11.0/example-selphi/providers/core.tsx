
import { CUSTOMER_ID, LICENSE_APIKEY_ANDROID, LICENSE_APIKEY_IOS, LICENSE_URL } from "../constants";
import { closeSession, CoreResult, getExtraData, initOperation, InitOperationConfiguration, initSession, InitSessionConfiguration } from "@facephi/sdk-core-react-native/src";
import { Platform } from "react-native";
import { apiPost } from "../apiRest";
import { SelphiResult } from "@facephi/sdk-selphi-react-native/src";
import { SdkFinishStatus, SdkOperationType } from "@facephi/sdk-core-react-native/src/SdkCoreEnums";

export const callGetExtraData = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    selphiResult: SelphiResult|null
) => { 
    try 
    {
      console.log("Starting getExtraData...");
      return await getExtraData()
      .then(async (result: CoreResult) => 
      {
        console.log("result", result);
        if (result.finishStatus == SdkFinishStatus.Ok && selphiResult != null)
        {
          const params = {'extraData': result.data, 'image': selphiResult.bestImageTemplateRaw};
          
          let r: any = await apiPost('/**/**', params);
          console.log("r", r);
        }
      })
      .finally(()=> {
        console.log("End getExtraData...");
      });
    } 
    catch (error) {
        console.log(error);
    }
};

export const launchCloseSession = async (
    setOperationId: React.Dispatch<React.SetStateAction<string>>,
    setSelphiResult: React.Dispatch<React.SetStateAction<SelphiResult|null>>) => 
{ 
    try 
    {
      console.log("Starting closeSession...");
      return await closeSession()
      .then((result: CoreResult) => 
      {
        console.log("result", result);
      })
      .finally(()=> {
        setOperationId("");
        setSelphiResult(null);
        console.log("End closeSession...");
      });
    } 
    catch (error) {
        console.log(error);
    }
};

const getInitOperationConfiguration = () => 
{
    let config: InitOperationConfiguration = {
      customerId: CUSTOMER_ID,
      type: SdkOperationType.Onboarding,
    };

    return config;
};

export const startInitOperation = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    setOperationId: React.Dispatch<React.SetStateAction<string>>
) => { 
    try 
    {
      console.log("Starting startInitOperation...");

      return await initOperation(getInitOperationConfiguration())
      .then((result: CoreResult) => 
      {
        console.log("result", result);
        switch (result.finishStatus) 
        {
          case SdkFinishStatus.Ok: // OK
            setShowError(false);
            setOperationId(result.data!);
            break;
    
          case SdkFinishStatus.Error: // Error
            drawError(setMessage, setTextColorMessage, setShowError, result);
            break;
        }
      })
      .finally(()=> {
        console.log("End startInitOperation...");
      });
    } 
    catch (error) {
        console.log(error);
    }
};

export const launchInitSession = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
    setShowError: React.Dispatch<React.SetStateAction<boolean>>) => 
{ 
    try 
    {
      console.log("Starting initSession...");
      setShowError(false);
      let config: InitSessionConfiguration = {
        //license: Platform.OS === 'ios' ? LICENSE_IOS_NEW : LICENSE_ANDROID_NEW,
        licenseUrl: LICENSE_URL,
        licenseApiKey: Platform.OS === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID,
        enableTracking: true,
      };

      return await initSession(config)
      .then((result: CoreResult) => 
      {
        console.log("result", result);
        switch (result.finishStatus) 
        {
          case SdkFinishStatus.Ok: // OK
            setShowError(false);
            break;

          case SdkFinishStatus.Error: // Error
            drawError(setMessage, setTextColorMessage, setShowError, result);
            break;
        }
      })
      .finally(()=> {
        console.log("End initSession...");
      });
    } 
    catch (error) {
        console.log(error);
    }
};

export const drawError = (
    setMessage: React.Dispatch<React.SetStateAction<string>>, 
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>, 
    result: any) =>
{
    setTextColorMessage('#DE2222');
    setShowError(true);
    setMessage(result['errorType'].replace(/_/g, ' '));
}