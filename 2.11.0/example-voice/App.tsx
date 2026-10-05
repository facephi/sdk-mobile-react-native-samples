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
import { NativeModules, StatusBar, Platform, View, Modal, Appearance, NativeEventEmitter, ScrollView } from 'react-native';
import { CUSTOMER_ID, LICENSE_URL, LICENSE_APIKEY_IOS, LICENSE_APIKEY_ANDROID, LICENSE_ANDROID_NEW, LICENSE_IOS_NEW, TRACKING_ERROR_LISTENER } from './constants';
import SdkTopBar from './components/commons/SdkTopBar';
import ActionSheet from './components/commons/CustomActionSheet';
import SdkButton from './components/commons/SdkButton';
import { SdkFinishStatus, SdkOperationType, closeSession, CoreResult, initOperation, InitOperationConfiguration, initSession, InitSessionConfiguration } from '@facephi/sdk-core-react-native';
import { voice, VoiceConfiguration, VoiceResult } from '@facephi/sdk-voice-react-native';
import { LogBox } from 'react-native';
import SdkWarning from './components/commons/SdkWarning';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => 
{
  const [message, setMessage]                       = useState("");
  const [showError, setShowError]                   = useState(false);
  const [textColorMessage, setTextColorMessage]     = useState('#777777');
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
  
  const backgroundStyle = { backgroundColor: darkMode ? "dark-content" : "light-content" };
  const trackingEmitter = new NativeEventEmitter(NativeModules.SdkMobileCore); // Optional: For iOS events
  
  /* init listener */
  let trackingListener = trackingEmitter.addListener(
    TRACKING_ERROR_LISTENER,
    (res: any) => console.log("TRACKING_ERROR_LISTENER", res)
  );
  /* end listener */

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme(); //identify the theme of your default system light/dark
    setDarkMode(colorScheme === 'dark' ? true : false);
    console.log("dark mode:", darkMode);

    launchInitSession();
  }
  ,[])

  const launchVoice = async () => 
  { 
    console.log("Starting launchVoice...", getVoiceConfiguration());
    return await voice(getVoiceConfiguration())
    .then((result: VoiceResult) => 
    {
      console.log("result", result);
      if (result.finishStatus == SdkFinishStatus.Error) {
        drawError(setMessage, setTextColorMessage, setShowError, result);
      }
    })
    .catch((error: any) => 
    {
      console.log(error);
    })
    .finally(()=> {
      console.log("End launchVoice...");
    });
  };

  const getVoiceConfiguration = () => 
  {
    const sdkConfiguration: VoiceConfiguration = {
      phrases: "hola que tal|hola que tal prueba",
      showTutorial: true,
      vibrationEnabled: true,
      returnAudios: true,
      returnTokenizedAudios: true
    };
    return sdkConfiguration;
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
    console.log("Starting initSession...");
    setShowError(false);
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
        drawError(setMessage, setTextColorMessage, setShowError, result);
      }
    })
    .catch((error: any) => 
    {
      console.log(error);
    })
    .finally(()=> {
      console.log("End initSession...");
    });
  };

  const launchCloseSession = async () => 
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
      trackingListener.remove();
      console.log("End closeSession...");
    });
  };

  const startInitOperation = async () => 
  { 
    console.log("Starting startInitOperation...");
    setShowError(false);
    return await initOperation(getInitOperationConfiguration())
    .then((result: CoreResult) => 
    {
      console.log("result", result);
      if (result.finishStatus == SdkFinishStatus.Error) {
        drawError(setMessage, setTextColorMessage, setShowError, result);
      }
    })
    .catch((error: any) => 
    {
      console.log(error);
    })
    .finally(()=> {
      console.log("End startInitOperation...");
    });
  };

  const bodyComponent = () => 
    <View style={{ alignItems: 'center' }}></View>;

  const headerComponent = () => 
    <View style={{ alignItems: 'center' }}>
      <SdkWarning stateResult={[showError, message, textColorMessage]} />
    </View>;

  const footerComponent = () => 
    <View style={{ alignItems: 'center', width: '100%' }}>
      <SdkButton onPress={launchVoice} text="Voice" />
      <SdkButton onPress={startInitOperation} text="Init Operation" />
      <SdkButton onPress={launchInitSession} text="Init Session" />
      <SdkButton onPress={launchCloseSession} text="Close Session" />
    </View>;

  const actionSheetComponent = () =>
    <Modal
      transparent={true}
      visible={actionSheet}
      style={[{ margin: 0, justifyContent: 'flex-end' }]}
    >
      <ActionSheet
        actionItems={actionItems}
        onCancel={() => setActionSheet(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode} />
    </Modal>;

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={darkMode ? 'dark-content' : 'light-content'} 
      />
      <SafeAreaView style={[{flex: 1}, backgroundStyle]}>
        <SdkTopBar 
          onPress={() => setActionSheet(true)}
        />
        { actionSheetComponent() }
        <ScrollView
          contentContainerStyle={{ width: '100%', flexGrow: 1, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
          >
            { headerComponent() }
            { bodyComponent() }
            { footerComponent() }
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;

const drawError = (
  setMessage: React.Dispatch<React.SetStateAction<string>>, 
  setTextColorMessage: React.Dispatch<React.SetStateAction<string>>, 
  setShowError: React.Dispatch<React.SetStateAction<boolean>>, 
  result: any) =>
{
  setTextColorMessage('#FF0000');
  setShowError(true);
  setMessage(result['errorType'].replace(/_/g, ' '));
}
