import React, { useState } from "react";
import { Alert, Modal, Text, View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { ActionSheetStyles } from "./ActionSheetStyles";
import { PhingersConfiguration } from "@facephi/sdk-phingers-react-native/src";

interface Props {
  modalVisible: any;
  setModalVisible: Function;
  config: PhingersConfiguration;
  setSdkConfig: Function;
  isDarkMode: boolean;
}
const PhingersModal: React.FC<Props> = ({modalVisible, setModalVisible, config, setSdkConfig, isDarkMode}) => 
{
  const fingersFilterList       = ["RING_FINGER", "THUMB_FINGER", "INDEX_FINGER", "LITTLE_FINGER", "MIDDLE_FINGER", "SLAP"];
  const reticleOrientationList  = ["LEFT", "RIGHT"];
  const yesNoList               = ["YES", "NO"];

  const [localConfig, setLocalConfig] = useState<PhingersConfiguration>(config!);

  const setSelected = (value: any, option: string) => 
  {
    setLocalConfig({
      extractionTimeout:    localConfig.extractionTimeout,
      fingersFilter:        option == "fingersFilter" ? value : localConfig.fingersFilter,
      reticleOrientation:   option == "reticleOrientation" ? value : localConfig.reticleOrientation,
      showDiagnostic:       option == "showDiagnostic" ? (value == "YES" ? true : false) : localConfig.showDiagnostic,
      showPreviousTip:      option == "showPreviousTip" ? (value == "YES" ? true : false) : localConfig.showPreviousTip,
      showTutorial:         option == "showTutorial" ? (value == "YES" ? true : false) : localConfig.showTutorial,
      vibration:            option == "vibration" ? (value == "YES" ? true : false) : localConfig.vibration,
    });
    setSdkConfig(localConfig);
  }

  const handleChangeExtractionTimeout = (value: any) => 
  {
    setLocalConfig({
      extractionTimeout:    parseInt(value),
      fingersFilter:        localConfig.fingersFilter,
      reticleOrientation:   localConfig.reticleOrientation,
      showDiagnostic:       localConfig.showDiagnostic,
      showPreviousTip:      localConfig.showPreviousTip,
      showTutorial:         localConfig.showTutorial,
      vibration:            localConfig.vibration,
    });
    setSdkConfig(localConfig)
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
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>Extraction Timeout:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="Extraction Timeout"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='numeric'
                      onChangeText={text => handleChangeExtractionTimeout(text)}
                      value={localConfig.extractionTimeout === undefined ? "0" : localConfig.extractionTimeout.toString()}
                      maxLength={8}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Fingers Filter:</Text>
                  {
                  Platform.OS === 'android' ?
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.fingersFilter === undefined ? "SLAP" : localConfig.fingersFilter}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "fingersFilter")
                    }>
                    {fingersFilterList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.fingersFilter === undefined ? "SLAP" : localConfig.fingersFilter}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "fingersFilter")
                    }>
                    {fingersFilterList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Reticle Orientation:</Text>
                  {
                  Platform.OS === 'android' ?
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.reticleOrientation === undefined ? "LEFT" : localConfig.reticleOrientation}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "reticleOrientation")
                    }>
                    {reticleOrientationList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.reticleOrientation === undefined ? "LEFT" : localConfig.reticleOrientation}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "reticleOrientation")
                    }>
                    {reticleOrientationList.map((item, index) => {
                      return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>ShowDiagnostic:</Text>
                  {
                  Platform.OS === 'android' ?
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.showDiagnostic ? "YES" : "NO"}
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
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.showDiagnostic ? "YES" : "NO"}
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
                  <Text style={{ width: 90, color: "black" }}>ShowPreviousTips:</Text>
                  {
                  Platform.OS === 'android' ?
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.showPreviousTip ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showPreviousTips")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={(localConfig.showPreviousTip ?  "YES" : "NO")}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "showPreviousTips")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>ShowTutorial:</Text>
                  {
                  Platform.OS === 'android' ?
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={(localConfig.showTutorial ?  "YES" : "NO")}
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
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={(localConfig.showTutorial ?  "YES" : "NO")}
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
                  <Text style={{ width: 90, color: "black" }}>Enabled Vibration:</Text>
                  {
                  Platform.OS === 'android' ?
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.vibration ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "vibration")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  :
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.vibration ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "vibration")
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
export default PhingersModal;