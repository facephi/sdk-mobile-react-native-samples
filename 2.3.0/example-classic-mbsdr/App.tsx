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
import { NativeModules, SafeAreaView, StatusBar, FlatList, View, Modal, Appearance, NativeEventEmitter, LogBox } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TRACKING_ERROR_LISTENER } from './constants';

import SelphiImage from './components/selphi/SelphiImage';
import SdkTopBar from './components/commons/SdkTopBar';
import ActionSheet from './components/commons/CustomActionSheet';
import SelphIDImage from './components/selphid/SelphIDImage';
import SelphIDTitleText from './components/selphid/SelphIDTitleText';
import SelphIDButtonAlert from './components/selphid/SelphIDButtonAlert';
import SelphIDWarning from './components/selphid/SelphIDWarning';

import SdkButton from './components/commons/SdkButton';
import { SelphiResult } from '@facephi/sdk-selphi-react-native/src';
import { SelphidResult } from '@facephi/sdk-selphid-mbsdr-react-native/src';
import { callGetExtraData, launchCloseSession, launchFlow, launchInitSession, startInitOperation } from './providers/core'
import { startSelphi } from './providers/selphi';
import { startSelphid } from './providers/selphid';

const App = () => 
{
  const [operationId, setOperationId]               = useState("");
  const [message, setMessage]                       = useState("");
  const [showError, setShowError]                   = useState(false);
  const [textColorMessage, setTextColorMessage]     = useState('#777777');
  const [actionSheet, setActionSheet]               = useState(false);
  const [darkMode, setDarkMode]                     = useState(false);
  const [selphiResult, setSelphiResult]             = useState<SelphiResult|null>(null);
  const [selphidResult, setSelphidResult]           = useState<SelphidResult|null>(null);

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

    launchInitSession(setMessage, setTextColorMessage, setShowError);
  }
  ,[])

  const bodyComponent = () => 
    <View style={{ alignItems: 'center' }}>
      {selphiResult?.bestImage ? <SelphIDTitleText text="BestImage" /> : null}
      <SelphiImage image={selphiResult?.bestImage} widthImage={'55%'} />
      {selphidResult?.frontDocumentImage ? <SelphIDTitleText text="Frente" /> : null}
      <SelphIDImage image={selphidResult?.frontDocumentImage} widthImage={'65%'} />
      {selphidResult?.backDocumentImage ? <SelphIDTitleText text="Dorso" /> : null}
      <SelphIDImage image={selphidResult?.backDocumentImage} widthImage={'65%'} />
      {selphidResult?.faceImage ? <SelphIDTitleText text="Selfie" /> : null}
      <SelphIDImage image={selphidResult?.faceImage} widthImage={'40%'} />
      <SelphIDButtonAlert content={selphidResult?.documentData} darkMode={darkMode} />
    </View>;

  const headerComponent = () => 
    <View style={{ alignItems: 'center' }}>
      <SelphIDWarning stateResult={[showError, message, textColorMessage]} />
    </View>;

  const footerComponent = () => 
    <View style={{ alignItems: 'center' }}>
      <SdkButton onPress={() => startSelphi(operationId, setMessage, setTextColorMessage, setShowError, setSelphiResult)} text="Start Selphi" testID={"selphiBtn"}/>
      <SdkButton onPress={() => startSelphid(operationId, setMessage, setSelphidResult, setTextColorMessage, setShowError)} text="Start SelphID" />
      <SdkButton onPress={() => startInitOperation(setMessage, setTextColorMessage, setShowError, setOperationId)} text="Init Operation" />
      <SdkButton onPress={() => callGetExtraData(setMessage, selphidResult, selphiResult)} text="ExtraData" />
      <SdkButton onPress={() => launchInitSession(setMessage, setTextColorMessage, setShowError)} text="Init Session" />
      <SdkButton onPress={() => launchCloseSession(setOperationId, setSelphiResult, setSelphidResult)} text="Close Session" />
      <SdkButton onPress={() => launchFlow(setMessage)} text="Launch Flow" />
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
        contentContainerStyle={{flex: (selphiResult != null && selphidResult != null) ? 0 : 1, justifyContent: 'center'}}
        data={[1]}
        renderItem={ bodyComponent }
        ListHeaderComponent={ headerComponent }
        ListFooterComponent={ footerComponent }         
      />

    </SafeAreaView>
  );
};

export default App;
