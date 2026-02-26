
import { CUSTOMER_ID, LICENSE_APIKEY_ANDROID, LICENSE_APIKEY_IOS, LICENSE_URL, MsjError } from "../constants";
import { closeSession, CoreResult, FlowConfiguration, getExtraData, initFlow, initOperation, InitOperationConfiguration, initSession, InitSessionConfiguration, startFlow, getOperationId, getSessionId } from "@facephi/sdk-core-react-native/src";
import { SdkErrorType, SdkFinishStatus, SdkOperationType } from "@facephi/sdk-core-react-native/src/SdkCoreEnums";
import { Platform } from "react-native";
import { apiPost } from "../apiRest";
import { SelphiResult, setSelphiFlow } from "@facephi/sdk-selphi-iad-react-native/src";
import { SelphidResult, setSelphidFlow } from "@facephi/sdk-selphid-mbsdr-react-native/src";

export const callGetExtraData = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    selphidResult: SelphidResult|null,
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
          const params1 = {'extraData': result.data, 'image': selphiResult.bestImageTemplateRaw};
          const params2 = {'documentTemplate': selphidResult?.tokenFaceImage, 'extraData': result.data, 'image1': selphiResult.bestImageTemplateRaw};
          
          let r1: any = await apiPost('/', params1);
          console.log("r1", r1);
          let r2: any = await apiPost('/', params2);
          console.log("r2", r2);
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
    setSelphiResult: React.Dispatch<React.SetStateAction<SelphiResult|null>>,
    setSelphidResult: React.Dispatch<React.SetStateAction<SelphidResult|null>>) => 
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
        setSelphidResult(null);
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

export const getOperationIdInfo = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    setOperationId: React.Dispatch<React.SetStateAction<string>>
) => { 
    try 
    {
      console.log("Starting getOperationIdInfo...");

      return await getOperationId()
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
        console.log("End getOperationIdInfo...");
      });
    } 
    catch (error) {
        console.log(error);
    }
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

export const getSessionIdInfo = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
    setShowError: React.Dispatch<React.SetStateAction<boolean>>) => 
{ 
    try 
    {
      console.log("Starting getSessionIdInfo...");

      return await getSessionId()
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
        console.log("End getSessionIdInfo...");
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
        //enableDebugMode: true
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

const getFlowConfiguration = () => 
{
    const sdkConfiguration: FlowConfiguration = {
      flow: "FLOW_B",
      customerId: CUSTOMER_ID,
    };

    return sdkConfiguration;
};

export const launchFlow = async (setMessage: React.Dispatch<React.SetStateAction<string>>) => 
{ 
    try 
    {
      console.log("Starting launchFlow...", getFlowConfiguration());
      await initFlow(getFlowConfiguration())
      .then((result: CoreResult) => 
      {
        console.log("initFlow result", result);
      })
      .finally(()=> {
        console.log("End launchFlow...");
      });

      await setSelphiFlow().then((result: SelphiResult) => 
      {
        console.log("SelphiResult", result);
      });
      await setSelphidFlow().then((result: SelphidResult) => 
      {
        console.log("SelphidResult", result);
      });
      //await SdkMobilePhingers.setPhingersFlow()
      //await SdkMobileVoice.setVoiceFlow()
      //await SdkMobileCore.setSelphidFlow()

      await startFlow().then((result: CoreResult) => 
      {
        console.log("startFlow result", result);
      })
      .finally(()=> 
      {
        console.log("End startFlow...");
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
    if (result['errorType'] === SdkErrorType.UnknownError) // Unknown Error
    {
        setMessage(MsjError.fphi_str_unknown_error);
    }
    else if (result['errorType'] === SdkErrorType.CameraPermissionDenied) // Camera Permission Denied
    {
        setMessage(MsjError.fphi_str_camera_permission_denied);
    }
    else if (result['errorType'] === SdkErrorType.SettingsPermissionDenied) // Settings Permission Denied
    {
        setMessage(MsjError.fphi_str_settings_permission_denied);
    }
    else if (result['errorType'] === SdkErrorType.HardwareError) // Hardware error
    {
        setMessage(MsjError.fphi_str_hardware_error);
    }
    else if (result['errorType'] === SdkErrorType.ExtractionLicenseError) 
    {
        setMessage(MsjError.fphi_str_generic_extraction_license);
    }
    else if (result['errorType'] === SdkErrorType.UnexpectedCaptureError)
    {
        setMessage(MsjError.fphi_str_generic_unexpected_captured);
    }
    else if (result['errorType'] === SdkErrorType.ControlNotInitializedError) 
    {
        setMessage(MsjError.fphi_str_generic_control_not_initialized);
    }
    else if (result['errorType'] === SdkErrorType.BadExtractorConfiguration) 
    {
        setMessage(MsjError.fphi_str_generic_bad_extractor_conf);
    }
    else if (result['errorType'] === SdkErrorType.CancelByUser) 
    {
        setMessage(MsjError.fphi_str_stopped_manually);
    }
    else if (result['errorType'] === SdkErrorType.Timeout) 
    {
        setMessage(MsjError.fphi_str_timeout);
    }
    else if (result['errorType'] === SdkErrorType.InitProccessError) 
    {
        setMessage(MsjError.fphi_str_init_proccess_error);
    }
    else if (result['errorType'] === SdkErrorType.NfcError) 
    {
        setMessage(MsjError.fphi_str_nfc_error);
    }
    else if (result['errorType'] === SdkErrorType.NetworkConnection) 
    {
        setMessage(MsjError.fphi_str_network_connection);
    }
    else if (result['errorType'] === SdkErrorType.TokenError) 
    {
        setMessage(MsjError.fphi_str_token_error);
    }
    else if (result['errorType'] === SdkErrorType.InitSessionError) 
    {
        setMessage(MsjError.fphi_str_init_session_error);
    }
    else if (result['errorType'] === SdkErrorType.ComponentControllerError) 
    {
        setMessage(MsjError.fphi_str_component_controller_error);
    }
    else if (result['errorType'] === SdkErrorType.LicenseCheckerErrorInvalidLicense) 
    {
        setMessage(MsjError.fphi_str_license_checker_error_invalid_license);
    }
    else if (result['errorType'] === SdkErrorType.LicensingErrorAppIdInvalid) 
    {
        setMessage(MsjError.fphi_str_licensing_error_app_id_invalid);
    }
    else if (result['errorType'] === SdkErrorType.LicensingErrorApiKeyForbidden) 
    {
        setMessage(MsjError.fphi_str_licensing_error_api_key_forbidden);
    }
    else if (result['errorType'] === SdkErrorType.LicensingErrorLicenseNotFound) 
    {
        setMessage(MsjError.fphi_str_licensing_error_license_not_found);
    }
    else if (result['errorType'] === SdkErrorType.LicensingErrorPackageName) 
    {
        setMessage(MsjError.fphi_str_licensing_error_package_name);
    }
    else if (result['errorType'] === SdkErrorType.LicenseCheckerErrorInvalidComponentLicense) 
    {
        setMessage(MsjError.fphi_str_license_checker_error_invalid_component_license);
    }
    else if (result['errorType'] === SdkErrorType.ComponentControllerApplicationError) 
    {
        setMessage(MsjError.fphi_str_component_controller_application_error);
    }
    else if (result['errorType'] === SdkErrorType.NoOperationCreatedError) 
    {
        setMessage(MsjError.fphi_str_no_operation_created_error);
    }
        else if (result['errorType'] === SdkErrorType.LicenseStringError) 
    {
        setMessage(MsjError.fphi_str_license_string_error);
    }
    else if (result['errorType'] === SdkErrorType.SdkNotInitialized) 
    {
        setMessage(MsjError.fphi_str_sdk_not_initialized);
    }
    else 
    {
        setMessage('Internal widget error');
    }
}