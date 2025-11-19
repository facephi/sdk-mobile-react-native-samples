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
import { SafeAreaView, StatusBar, Appearance, Platform, FlatList, View, NativeModules } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { CUSTOMER_ID, MsjError, LICENSE_URL, LICENSE_APIKEY_IOS, LICENSE_APIKEY_ANDROID } from './constants';

import SdkTopBar from './components/commons/SdkTopBar';
import SdkWarning from './components/commons/SdkWarning';
import SdkButton from './components/commons/SdkButton';

import { CoreResult, InitSessionConfiguration, InitOperationConfiguration, initSession, closeSession, initOperation } from '@facephi/sdk-core-react-native/src';
import { videoid, VideoIdConfiguration, VideoIdResult } from '@facephi/sdk-videoid-react-native/src';
import { SdkErrorType, SdkFinishStatus, SdkOperationType } from '@facephi/sdk-core-react-native/src/SdkCoreEnums';
//import { VideoMode } from '@facephi/sdk-videoid-react-native/src/VideoIdEnums';

const App = () => 
{
  const [message, setMessage]                   = useState("");
  const [showError, setShowError]               = useState(false);
  const [textColorMessage, setTextColorMessage] = useState('#777777');
  const [darkMode, setDarkMode]                 = useState(false);

  const actionItems = [
    {
      id: 1,
      label: 'Theme Mode',
      onPress: () => {}
    }
  ];

  const backgroundStyle = { backgroundColor: darkMode ? Colors.darker : Colors.lighter };

  useEffect(()=>{
    const colorScheme = Appearance.getColorScheme(); //identify the theme of your default system light/dark
    setDarkMode(colorScheme === 'dark' ? true : false);
    console.log("dark mode:", darkMode);

    launchInitSession();
  }
  ,[])

  const launchVideoId = async () => 
  { 
    try 
    {
      console.log("Starting launchVideoId...");
      return await  NativeModules.SdkMobileVideoid.videoid(getVideoIdConfiguration())
      .then((result: VideoIdResult) => 
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
        console.log("End launchVideoId...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const getVideoIdConfiguration = () => 
  {
    let config: VideoIdConfiguration = {
      sectionTime: 5000,
      //mode: VideoMode.ONLY_FACE,
      showTutorial: true
    };
    return config;
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
      let config: InitSessionConfiguration = {
        //license: Platform.OS === 'ios' ? JSON.stringify(LICENSE_IOS_NEW) : JSON.stringify(LICENSE_ANDROID_NEW),
        licenseUrl: LICENSE_URL,
        licenseApiKey: Platform.OS === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID,
        enableTracking: true
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
        console.log("End closeSession...");
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
        /*if (result.finishStatus == SdkFinishStatus.Error) {
          drawError(setMessage, result);
        }*/
      })
      .catch((error: any) => 
      {
        console.log(error);
      })
      .finally(()=> {
        console.log("End closeSession...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const launchInitOperation = async () => 
  { 
    try 
    {
      console.log("Starting launchInitOperation...");
      return await initOperation(getInitOperationConfiguration())
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
        console.log("End launchInitOperation...");
      });
    } 
    catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  const bodyComponent = () => 
    <View style={{ alignItems: 'center' }}></View>;

  const headerComponent = () => 
    <View style={{ alignItems: 'center' }}>
      <SdkWarning stateResult={[showError, message, textColorMessage]} />
    </View>;

  const footerComponent = () => 
    <View style={{ alignItems: 'center' }}>
      <SdkButton onPress={launchVideoId} text="Start VideoId" />
      <SdkButton onPress={launchInitOperation} text="Init Operation" />
      <SdkButton onPress={launchInitSession} text="Init Session" />
      <SdkButton onPress={launchCloseSession} text="Close Session" />
    </View>;

  return (
    <SafeAreaView style={[{flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}, backgroundStyle]}>
      <StatusBar 
        animated={true}
        barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <SdkTopBar />

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
