import React, { useState } from "react";
import { Alert, Modal, Text, View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { SelphiConfiguration } from "@facephi/sdk-selphi-react-native/src";
import { ActionSheetStyles } from "./ActionSheetStyles";

interface Props {
  modalVisible: boolean;
  setModalVisible: Function;
  config: SelphiConfiguration; 
  setSdkConfig: Function;
  isDarkMode: boolean;
}

const SelphiModal: React.FC<Props> = ({modalVisible, setModalVisible, config, setSdkConfig, isDarkMode}) => 
{
  const scanModeList  = ["PASSIVE", "MOVE", "NONE"];
  const yesNoList     = ["YES", "NO"];

  const [localConfig, setLocalConfig] = useState<SelphiConfiguration>(config!);

  const setSelected = (value: any, option: string) => 
  {
    let newConfig: SelphiConfiguration = {
      jpgQuality:                 localConfig.jpgQuality,
      resourcesPath:              localConfig.resourcesPath,
      livenessMode:               option == "scanMode" ? value : localConfig.livenessMode,
      cameraFlashEnabled:         option == "cameraFlashEnabled" ? (value == "YES" ? true : false) : localConfig.cameraFlashEnabled,
      debug:                      option == "debug" ? (value == "YES" ? true : false) : localConfig.debug,
      fullscreen:                 option == "fullscreen" ? (value == "YES" ? true : false) : localConfig.fullscreen,
      enableGenerateTemplateRaw:  option == "enableGenerateTemplateRaw" ? (value == "YES" ? true : false) : localConfig.enableGenerateTemplateRaw,
      showPreviousTip:            option == "showPreviousTip" ? (value == "YES" ? true : false) : localConfig.showPreviousTip,
      showTutorial:               option == "showTutorial" ? (value == "YES" ? true : false) : localConfig.showTutorial,
      logImages:                  option == "logImages" ? (value == "YES" ? true : false) : localConfig.logImages,
      showDiagnostic:             option == "showDiagnostic" ? (value == "YES" ? true : false) : localConfig.showDiagnostic,
      qrMode:                     option == "qrMode" ? (value == "YES" ? true : false) : localConfig.qrMode

    }
    
    setLocalConfig(newConfig);
    setSdkConfig(newConfig);

  }

  const handleChange = (key: string, value: any) => 
  {
    let newConfig: SelphiConfiguration = 
    {
      jpgQuality: (key == "jpgQuality") ? parseFloat(value) : localConfig.jpgQuality,
      resourcesPath: (key == "resourcesPath") ? value.toString() : localConfig.resourcesPath,
      cameraFlashEnabled: localConfig.cameraFlashEnabled,
      debug: localConfig.debug,
      fullscreen: localConfig.fullscreen,
      livenessMode: localConfig.livenessMode,
      enableGenerateTemplateRaw: localConfig.enableGenerateTemplateRaw,
      showPreviousTip: localConfig.showPreviousTip,
      showTutorial: localConfig.showTutorial,
      showDiagnostic: localConfig.showDiagnostic,
      qrMode: localConfig.qrMode
    }
    
    setLocalConfig(newConfig);
    setSdkConfig(newConfig);
  }

  return (
    <Modal
        presentationStyle="overFullScreen"
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
          }
        }
    >
        <View style={Platform.OS === 'ios' ? ActionSheetStyles.centeredView : ActionSheetStyles.centeredViewAndroid}>
            <View style={[ActionSheetStyles.modalView, {backgroundColor: isDarkMode ? "lightgrey" : "white"}]}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>JPG Quality:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="JPG Quality"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='numeric'
                      onChangeText={text => handleChange("jpgQuality", text)}
                      value={localConfig.jpgQuality === undefined ? "0.95" : localConfig.jpgQuality.toString()}
                      maxLength={4}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black"}}>Resources:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      testID="Resources"
                      placeholder="Resources"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='default'
                      onChangeText={text => handleChange("resourcesPath", text)}
                      value={localConfig.resourcesPath === undefined ? "fphi-selphi-widget-resources-sdk.zip" : localConfig.resourcesPath}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Mode:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="LivenessModeDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.livenessMode === undefined ? "PASSIVE" : localConfig.livenessMode}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "scanMode")
                    }>
                    {scanModeList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.livenessMode === undefined ? "PASSIVE" : localConfig.livenessMode}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "scanMode")
                    }>
                    {scanModeList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>FullScreen:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="FullScreenDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.fullscreen === undefined ? "NO" : (localConfig.fullscreen ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "fullscreen")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.fullscreen === undefined ? "NO" : (localConfig.fullscreen ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "fullscreen")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Debug:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="DebugDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.debug ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "debug")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={(localConfig.debug ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "debug")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>QrMode:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="QrModeDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.qrMode === undefined ? "NO" : (localConfig.qrMode ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "qrMode")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.qrMode === undefined ? "NO" : (localConfig.qrMode ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "qrMode")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>ShowDiagnostic:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="ShowDiagnosticDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.showDiagnostic === undefined ? "YES" : (localConfig.showDiagnostic ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showDiagnostic")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.showDiagnostic === undefined ? "YES" : (localConfig.showDiagnostic ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showDiagnostic")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>ShowPreviousTip:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="ShowPreviousTipDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.showPreviousTip === undefined ? "YES" : (localConfig.showPreviousTip ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showPreviousTip")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.showPreviousTip === undefined ? "YES" : (localConfig.showPreviousTip ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showPreviousTip")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>ShowTutorial:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="ShowTutorialDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.showTutorial === undefined ? "YES" : (localConfig.showTutorial ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showTutorial")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.showTutorial === undefined ? "YES" : (localConfig.showTutorial ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showTutorial")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Generate TemplateRaw:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="GenerateTemplateDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.enableGenerateTemplateRaw === undefined ? "YES" : (localConfig.enableGenerateTemplateRaw ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "enableGenerateTemplateRaw")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.enableGenerateTemplateRaw === undefined ? "YES" : (localConfig.enableGenerateTemplateRaw ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "enableGenerateTemplateRaw")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Enable Images:</Text>
                  {Platform.OS === 'android' ?
                  <Picker
                    testID="EnableImagesDropdown"
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.logImages === undefined ? "NO" : (localConfig.logImages ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "logImages")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.logImages === undefined ? "NO" : (localConfig.logImages ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "logImages")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <TouchableOpacity style={[ActionSheetStyles.button, ActionSheetStyles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={ActionSheetStyles.textStyle}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );
};
export default SelphiModal;