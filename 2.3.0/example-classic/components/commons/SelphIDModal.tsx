import React, { useState } from "react";
import { Alert, Modal, Text, View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { SelphidConfiguration } from "@facephi/sdk-selphid-mbsdr-react-native/src";
import { ActionSheetStyles } from "./ActionSheetStyles";

interface Props {
  modalVisible: any;
  setModalVisible: Function;
  config: SelphidConfiguration;
  setSdkConfig: Function;
  isDarkMode: boolean;
}
const SelphIDModal: React.FC<Props> = ({modalVisible, setModalVisible, config, setSdkConfig, isDarkMode}) => 
{
  const timeoutList       = ["long", "medium", "short", "very_long"];
  const docTypeList       = ["DT_IdCard", "DT_CreditCard", "DT_Custom", "DT_DriverLicense", "DT_ForeignCard", "DT_Passport", "DT_Visa"];
  const scanModeList      = ["generic", "search", "specific"];
  const yesNoList         = ["YES", "NO"];

  const [localConfig, setLocalConfig] = useState<SelphidConfiguration>(config!);

  const setSelected = (value: any, option: string) => 
  {
    setLocalConfig({
      specificData:           localConfig.specificData,
      timeout:                option == "timeout" ? value : localConfig.timeout,
      documentType:           option == "documentType" ? value : localConfig.documentType,
      scanMode:               option == "scanMode" ? value : localConfig.scanMode,
      showResultAfterCapture: option == "showResultAfterCapture" ? (value == "YES" ? true : false) : localConfig.showResultAfterCapture,
      fullscreen:             option == "fullscreen" ? (value == "YES" ? true : false) : localConfig.fullscreen,
      debug:                  option == "debug" ? (value == "YES" ? true : false) : localConfig.debug,
      showTutorial:           option == "showTutorial" ? (value == "YES" ? true : false) : localConfig.showTutorial,
      showPreviousTip:        option == "showPreviousTip" ? (value == "YES" ? true : false) : localConfig.showPreviousTip,
      resourcesPath:          "fphi-selphi-widget-resources-sdk.zip"
    });
    setSdkConfig(localConfig);
  }

  const handleChangeSpecificData = (value: any) => 
  {
    setLocalConfig({
      specificData:           value.toUpperCase(),
      timeout:                localConfig.timeout,
      documentType:           localConfig.documentType,
      scanMode:               localConfig.scanMode,
      showResultAfterCapture: localConfig.showResultAfterCapture,
      fullscreen:             localConfig.fullscreen,
      debug:                  localConfig.debug,
      showTutorial:           localConfig.showTutorial,
      showPreviousTip:        localConfig.showPreviousTip,
      resourcesPath:          "fphi-selphi-widget-resources-sdk.zip"
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
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>Data:</Text>
                  <TextInput
                      autoCapitalize={"characters"}
                      placeholder="SpecificData"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='default'
                      onChangeText={text => handleChangeSpecificData(text)}
                      value={localConfig.specificData === undefined ? "AR|<ALL>" : localConfig.specificData}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Timeout:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.timeout === undefined ? "long" : localConfig.timeout}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "timeout")
                    }>
                    {timeoutList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.timeout === undefined ? "long" : localConfig.timeout}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "timeout")
                    }>
                    {timeoutList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>ShowResult:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.showResultAfterCapture ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showResultAfterCapture")
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
                    selectedValue={(localConfig.showResultAfterCapture ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showResultAfterCapture")
                    }>
                    {yesNoList.map((item, index) => {
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
                    selectedValue={localConfig.documentType == undefined ? "DT_IdCard" : localConfig.documentType}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "documentType")
                    }>
                    {docTypeList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    itemStyle={{ height: 125, color: "black" }}
                    style={{ width: 250, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.documentType == undefined ? "DT_IdCard" : localConfig.documentType}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "documentType")
                    }>
                    {docTypeList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>FullScreen:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.fullscreen === undefined ? false : (localConfig.fullscreen ?  "YES" : "NO")}
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
                    selectedValue={localConfig.fullscreen ?  "YES" : "NO"}
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
                  <Text style={{ width: 90, color: "black" }}>ScanMode:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.scanMode === undefined ? "search" : localConfig.scanMode}
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
                    selectedValue={localConfig.scanMode === undefined ? "search" : localConfig.scanMode}
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
                  <Text style={{ width: 90, color: "black" }}>Debug:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
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
                  <Text style={{ width: 90, color: "black" }}>Show PreviousTips:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.showPreviousTip ?  "YES" : "NO")}
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
                    selectedValue={(localConfig.showPreviousTip ?  "YES" : "NO")}
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
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.showTutorial === undefined ? false : (localConfig.showTutorial ?  "YES" : "NO")}
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
                    selectedValue={localConfig.showTutorial ?  "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showTutorial")
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
export default SelphIDModal;