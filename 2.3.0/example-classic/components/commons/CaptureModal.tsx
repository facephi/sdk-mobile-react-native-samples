import React, { useState } from "react";
import { Alert, Modal, Text, View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { ActionSheetStyles } from "./ActionSheetStyles";
import { CaptureConfiguration } from "@facephi/sdk-capture-react-native/src";

interface Props {
  modalVisible: any;
  setModalVisible: Function;
  config: CaptureConfiguration;
  setSdkConfig: Function;
  isDarkMode: boolean;
}
const CaptureModal: React.FC<Props> = ({modalVisible, setModalVisible, config, setSdkConfig, isDarkMode}) => 
{
  const cameraShapeList       = ["RECTANGLE_TALL", "CIRCULAR", "SQUARE"];
  const cameraList            = ["BACK", "FRONT"];
  const captureComponentList  = ["QR_READER", "PHACTURAS_READER"];
  const yesNoList             = ["YES", "NO"];

  const [localConfig, setLocalConfig] = useState<CaptureConfiguration>(config!);

  const setSelected = (value: any, option: string) => 
  {
    setLocalConfig({
      extractionTimeout:      localConfig.extractionTimeout,
      maxScannedDocs:         localConfig.maxScannedDocs,
      cameraSelected:         option == "cameraSelected" ? value : localConfig.cameraSelected,
      cameraShape:            option == "cameraShape" ? value : localConfig.cameraShape,
      captureComponent:       option == "captureComponent" ? value : localConfig.captureComponent,
      transparentBackground:  option == "transparentBackground" ? (value == "YES" ? true : false) : localConfig.transparentBackground,
      vibrationEnabled:       option == "vibrationEnabled" ? (value == "YES" ? true : false) : localConfig.vibrationEnabled,
      showDiagnostic:         option == "showDiagnostic" ? (value == "YES" ? true : false) : localConfig.showDiagnostic,
      showStroke:             option == "showStroke" ? (value == "YES" ? true : false) : localConfig.showStroke,
      showPreviousTip:        option == "showPreviousTip" ? (value == "YES" ? true : false) : localConfig.showPreviousTip,
    });
    setSdkConfig(localConfig);
  }

  const handleChange = (key: string, value: any) => 
  {
    setLocalConfig({
      extractionTimeout:      key == "extractionTimeout" ? parseInt(value) : localConfig.extractionTimeout,
      maxScannedDocs:         key == "maxScannedDocs" ? parseInt(value) : localConfig.maxScannedDocs,
      cameraSelected:         localConfig.cameraSelected,
      cameraShape:            localConfig.cameraShape,
      captureComponent:       localConfig.captureComponent,
      transparentBackground:  localConfig.transparentBackground,
      vibrationEnabled:       localConfig.vibrationEnabled,
      showDiagnostic:         localConfig.showDiagnostic,
      showStroke:             localConfig.showStroke,
      showPreviousTip:        localConfig.showPreviousTip,
    });
    setSdkConfig(localConfig);
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
        <View style={Platform.OS === 'ios' ? ActionSheetStyles.centeredView :ActionSheetStyles.centeredViewAndroid}>
            <View style={[ActionSheetStyles.modalView, {backgroundColor: isDarkMode ? "lightgrey" : "white"}]}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>MaxScannedDocs:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="MaxScannedDocs"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='numeric'
                      onChangeText={text => handleChange("maxScannedDocs", text)}
                      value={localConfig.maxScannedDocs === undefined ? "0" : localConfig.maxScannedDocs.toString()}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>ExtractionTimeout:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="ExtractionTimeout"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='numeric'
                      onChangeText={text => handleChange("extractionTimeout", text)}
                      value={localConfig.extractionTimeout === undefined ? "0" : localConfig.extractionTimeout.toString()}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Camera Selected:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.cameraSelected === undefined ? "BACK" : localConfig.cameraSelected}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "cameraSelected")
                    }>
                    {cameraList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.cameraSelected === undefined ? "BACK" : localConfig.cameraSelected}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "cameraSelected")
                    }>
                    {cameraList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>CameraShape:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.cameraShape)}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "cameraShape")
                    }>
                    {cameraShapeList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={(localConfig.cameraShape)}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "cameraShape")
                    }>
                    {cameraShapeList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>DocType:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.captureComponent == undefined ? "QR_READER" : localConfig.captureComponent}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "captureComponent")
                    }>
                    {captureComponentList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.captureComponent == undefined ? "QR_READER" : localConfig.captureComponent}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "captureComponent")
                    }>
                    {captureComponentList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>ShowDiagnostic:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.showDiagnostic === undefined ? false : (localConfig.showDiagnostic ?  "YES" : "NO")}
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
                    selectedValue={localConfig.showDiagnostic ?  "YES" : "NO"}
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
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.showPreviousTip ? "YES" : "NO"}
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
                    selectedValue={localConfig.showPreviousTip ? "YES" : "NO"}
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
                  <Text style={{ width: 90, color: "black" }}>ShowStroke:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.showStroke ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showStroke")
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
                    selectedValue={(localConfig.showStroke ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showStroke")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>TransparentBackground:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.transparentBackground ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "transparentBackground")
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
                    selectedValue={(localConfig.transparentBackground ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "transparentBackground")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>VibrationEnabled:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.vibrationEnabled ?  "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "vibrationEnabled")
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
                    selectedValue={localConfig.vibrationEnabled ?  "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "vibrationEnabled")
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
export default CaptureModal;