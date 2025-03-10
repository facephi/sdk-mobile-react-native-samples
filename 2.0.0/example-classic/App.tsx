/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, { useState, useEffect } from 'react';
import { NativeModules, SafeAreaView, StatusBar, Platform, FlatList, View, Modal, Appearance, NativeEventEmitter, LogBox } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { CUSTOMER_ID, MsjError, LICENSE_URL, LICENSE_APIKEY_IOS, LICENSE_APIKEY_ANDROID, LICENSE_ANDROID_NEW, LICENSE_IOS_NEW, TRACKING_ERROR_LISTENER } from './constants';

import SelphiImage from './components/selphi/SelphiImage';
import SdkTopBar from './components/commons/SdkTopBar';
import ActionSheet from './components/commons/CustomActionSheet';
import SelphIDImage from './components/selphid/SelphIDImage';
import SelphIDTitleText from './components/selphid/SelphIDTitleText';
import SelphIDButtonAlert from './components/selphid/SelphIDButtonAlert';
import SelphIDWarning from './components/selphid/SelphIDWarning';

import SdkButton from './components/commons/SdkButton';
import { SdkLivenessMode, SdkCompressFormat } from '@facephi/sdk-selphi-react-native/src/SdkSelphiEnums';
import { SdkErrorType, SdkFinishStatus, SdkOperationType } from '@facephi/sdk-core-react-native/src/SdkCoreEnums';
import { SdkScanMode, SdkDocumentType } from '@facephi/sdk-selphid-react-native/src/SdkSelphidEnums';
import { closeSession, CoreResult, FlowConfiguration, getExtraData, initFlow, initOperation, InitOperationConfiguration, initSession, InitSessionConfiguration, startFlow } from '@facephi/sdk-core-react-native/src';
import { selphi, SelphiConfiguration, SelphiResult, setSelphiFlow } from '@facephi/sdk-selphi-react-native/src';
import { selphid, SelphidConfiguration, SelphidResult, setSelphidFlow } from '@facephi/sdk-selphid-react-native/src';
import { apiPost } from './apiRest';

const App = () => 
{
  const [operationId, setOperationId]               = useState("");
  const [message, setMessage]                       = useState("");
  const [frontDocumentImage, setFrontDocumentImage] = useState(null);
  const [backDocumentImage, setBackDocumentImage]   = useState(null);
  const [faceImage, setFaceImage]                   = useState(null);
  const [tokenFaceImage, setTokenFaceImage]         = useState(null);
  const [showError, setShowError]                   = useState(false);
  const [ocrContent, setOcrContent]                 = useState(null);
  const [textColorMessage, setTextColorMessage]     = useState('#777777');
  const [bestImage, setBestImage]                   = useState(null);
  const [bestImageApi, setBestImageApi]             = useState<string>("");
  const [actionSheet, setActionSheet]               = useState(false);
  const [darkMode, setDarkMode]                     = useState(false);

  const actionItems = [
    {
      id: 1,
      label: 'Theme Mode',
      onPress: () => {}
    }
  ];

  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
  LogBox.ignoreAllLogs();
  
  const backgroundStyle = { backgroundColor: darkMode ? Colors.darker : Colors.lighter };
  
  const flowEmitter     = new NativeEventEmitter(NativeModules.SdkMobileCore); // For listening events
  const trackingEmitter = new NativeEventEmitter(NativeModules.SdkMobileCore); // Optional: For iOS events
  
  /* init listener */
  let trackingListener = trackingEmitter.addListener(
    TRACKING_ERROR_LISTENER,
    (res: any) => console.log("TRACKING_ERROR_LISTENER", res)
  );
  let flowListener = flowEmitter.addListener(
    "core.flow",
    (res: any) => console.log("FLOW_LISTENER", res)
  );
  /* end listener */

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme(); //identify the theme of your default system light/dark
    setDarkMode(colorScheme === 'dark' ? true : false);
    console.log("dark mode:", darkMode);

    launchInitSession();
  }
  ,[])

  const getFlowConfiguration = () => 
  {
    const sdkConfiguration: FlowConfiguration = {
      flow: "FLOW_B",
      customerId: CUSTOMER_ID,
    };

    return sdkConfiguration;
  };

  const launchFlow = async () => 
  { 
    try 
    {
      console.log("Starting launchFlow...", getFlowConfiguration());
      await initFlow(getFlowConfiguration())
      .then((result: CoreResult) => 
      {
        console.log("initFlow result", result);
      })
      .catch((error: any) => 
      {
        console.log(error);
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

      await startFlow()
      .then((result: CoreResult) => 
      {
        console.log("startFlow result", result);
      })
      .catch((error: any) => 
      {
        console.log(error);
      })
      .finally(()=> 
      {
        console.log("End startFlow...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const callGetExtraData = async () => 
  { 
    try 
    {
      console.log("Starting getExtraData...");
      return await getExtraData()
      .then(async (result: CoreResult) => 
      {
        console.log("result", result);
        if (result.finishStatus == SdkFinishStatus.Ok)
        {
          const params1 = {'extraData': result.data, 'image': bestImageApi};
          const params2 = {'documentTemplate': tokenFaceImage, 'extraData': result.data, 'image1': bestImageApi};
          
          let r1: any = await apiPost('/v5/api/v1/selphid/passive-liveness/evaluate', params1);
          console.log("r1", r1);
          let r2: any = await apiPost('/v5/api/v1/selphid/authenticate-facial/document/face-image', params2);
          console.log("r2", r2);
        }
      })
      .catch((error: any) => 
      {
        console.log(error);
      })
      .finally(()=> {
        console.log("End getExtraData...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const getSelphiConfiguration = () => {
    let config: SelphiConfiguration = {
      debug: false,
      fullscreen: true,
      livenessMode: SdkLivenessMode.PassiveMode,
      resourcesPath: "fphi-selphi-widget-resources-sdk.zip",
      enableGenerateTemplateRaw: true,
      showResultAfterCapture: true,
      jpgQuality: 0.95,
      compressFormat: SdkCompressFormat.JPEG,
      showDiagnostic: true
    };
    return config;
  };

  const startSelphi = async () => 
  { 
    try 
    {
      if (operationId == "") {
        console.log("OPERATION ID MUST BE GENERATED FIRST")
        return
      }

      console.log("Starting startSelphi...");
      clearAll();
      
      return await selphi(getSelphiConfiguration())
      .then((result: any) => 
      {
        //console.log("result", result);
        let r = result as SelphiResult
        console.log("result", r)
        processSelphiResult(result);
      })
      .catch((error: any) => 
      {
        console.log(error);
      })
      .finally(()=> {
        console.log("End startSelphi...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const getSelphidConfiguration = () => {
    let config: SelphidConfiguration = {
      debug: false,
      showResultAfterCapture: true,
      showTutorial: false,
      scanMode: SdkScanMode.Search,
      specificData: 'AR|<ALL>',
      documentType: SdkDocumentType.IdCard,
      fullscreen: true,
      locale: '',
      resourcesPath: "fphi-selphid-widget-resources-sdk.zip",
    };
    return config;
  };

  const startSelphid = async () => 
  { 
    try 
    {
      if (operationId == "") {
        console.log("OPERATION ID MUST BE GENERATED FIRST")
        return
      }

      console.log("Starting startSelphid...");
      clearAll();
      console.log(getSelphidConfiguration());
      return await selphid(getSelphidConfiguration())
      .then((result: any) => 
      {
        let r: SelphidResult = result;
        console.log("result parsed", r);

        console.log("result", result);
        processSelphidResult(result);
      })
      .catch((error: any) => 
      {
        console.log(error);
        setMessage(JSON.stringify(error));
        setFrontDocumentImage(null);
        setBackDocumentImage(null);
        setFaceImage(null);
        setTokenFaceImage(null);
        setOcrContent(null);
        setShowError(true);
        setTextColorMessage('#DE2222');
      })
      .finally(()=> {
        console.log("End startSelphid...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
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

  const launchInitSession = async () => 
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
        if (result.finishStatus == SdkFinishStatus.Error) {
          drawError(setMessage, result);
        }
      })
      .catch((error: any) => 
      {
        console.log(error);
      })
      .finally(()=> {
        console.log("End initSession...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const launchCloseSession = async () => 
  { 
    try 
    {
      console.log("Starting closeSession...");
      return await closeSession()
      .then((result: CoreResult) => 
      {
        console.log("result", result);
      })
      .catch((error: any) => 
      {
        console.log(error);
      })
      .finally(()=> {
        setOperationId("");
        trackingListener.remove();
        flowListener.remove();
        console.log("End closeSession...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const startInitOperation = async () => 
  { 
    try 
    {
      console.log("Starting startInitOperation...");
      setShowError(false);
      return await initOperation(getInitOperationConfiguration())
      .then((result: CoreResult) => 
      {
        console.log("result", result);
        if (result.finishStatus == SdkFinishStatus.Error) {
          drawError(setMessage, result);
        }
        if (result.finishStatus == SdkFinishStatus.Ok && result.data !== "") {
          setOperationId(result.data!);
        }
      })
      .catch((error: any) => 
      {
        console.log(error);
      })
      .finally(()=> {
        console.log("End startInitOperation...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const processSelphiResult = (result: any) => 
  {
    let r = result as SelphiResult;
    switch (parseInt(result.finishStatus, 10)) 
    {
      case SdkFinishStatus.Ok: // OK
        setMessage('Preview selfie');
        setBestImage(result.bestImage);
        setBestImageApi((r.bestImageTemplateRaw == null) ? r.bestImage! : r.bestImageTemplateRaw);
        setTextColorMessage('#777777');
        setShowError(false);
        break;

      // Shows the result operation.
      case SdkFinishStatus.Error: // Error
        if (result.errorType) {
          drawError(setMessage, result);
          setBestImage(null);
          setTextColorMessage('#DE2222');
          setShowError(true);
        }
        break;

      default:
        setMessage('Unknown error');
        setBestImage(null);
        setTextColorMessage('#DE2222');
        setShowError(true);
        break;
    }
  };

  const processSelphidResult = (result: any) => 
  {
    switch (parseInt(result.finishStatus, 10)) 
    {
      case SdkFinishStatus.Ok: // OK
          setFrontDocumentImage(result.frontDocumentImage); // encrypted: frontDocumentImage
          setBackDocumentImage(result.backDocumentImage); // encrypted: backDocumentImage
          setFaceImage(result.faceImage); // encrypted: tokenFaceImage
          setTokenFaceImage(result.tokenFaceImage);
          setOcrContent(result.documentData);
          setShowError(false);
          setTextColorMessage('#777777');
        break;

      // Shows the result operation.
      case SdkFinishStatus.Error: // Error
        if (result.errorType) {
            drawError(setMessage, result);
            setOcrContent(null);
            setShowError(true);
            setTextColorMessage('#DE2222');
        }
        break;

      default:
          setMessage('Unknown error');
          setShowError(true);
          setTextColorMessage('#DE2222');
        break;
    }
  };

  const clearAll = () => {
    setBestImage(null);
    setFrontDocumentImage(null);
    setBackDocumentImage(null);
    setFaceImage(null);
    setTokenFaceImage(null);
    setOcrContent(null);
  }

  const bodyComponent = () => 
    <View style={{ alignItems: 'center' }}>
      {bestImage ? <SelphIDTitleText text="BestImage" /> : null}
      <SelphiImage image={bestImage} widthImage={'55%'} />
      {frontDocumentImage ? <SelphIDTitleText text="Frente" /> : null}
      <SelphIDImage image={frontDocumentImage} widthImage={'65%'} />
      {backDocumentImage ? <SelphIDTitleText text="Dorso" /> : null}
      <SelphIDImage image={backDocumentImage} widthImage={'65%'} />
      {faceImage ? <SelphIDTitleText text="Selfie" /> : null}
      <SelphIDImage image={faceImage} widthImage={'40%'} />
      <SelphIDButtonAlert content={ocrContent} darkMode={darkMode} />
    </View>;

  const headerComponent = () => 
    <View style={{ alignItems: 'center' }}>
      <SelphIDWarning stateResult={[showError, message, textColorMessage]} />
    </View>;

  const footerComponent = () => 
    <View style={{ alignItems: 'center' }}>
      <SdkButton onPress={startSelphi} text="Start Selphi" testID={"selphiBtn"}/>
      <SdkButton onPress={startSelphid} text="Start SelphID" />
      <SdkButton onPress={startInitOperation} text="Init Operation" />
      <SdkButton onPress={callGetExtraData} text="ExtraData" />
      <SdkButton onPress={launchInitSession} text="Init Session" />
      <SdkButton onPress={launchCloseSession} text="Close Session" />
      <SdkButton onPress={launchFlow} text="Launch Flow" />
    </View>;

  return (
    <SafeAreaView style={[{flex: 1}, backgroundStyle]}>
      <StatusBar barStyle={darkMode ? 'dark-content' : 'light-content'} />
      <SdkTopBar onPress={() => setActionSheet(true)}/>
      <Modal 
        transparent={ true }
        visible={ actionSheet } 
        style={[{ margin: 0, justifyContent: 'flex-end' }]}
        >
          <ActionSheet actionItems={actionItems} onCancel={() => setActionSheet(false)} darkMode={ darkMode } setDarkMode={ setDarkMode }/>
      </Modal>

      <FlatList
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}
        data={[1]}
        renderItem={ bodyComponent }
        ListHeaderComponent={ headerComponent }
        ListFooterComponent={ footerComponent }         
      />
    </SafeAreaView>
  );
};

export default App;

const drawError = (setMessage: React.Dispatch<React.SetStateAction<string>>, result: any) =>
{
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
