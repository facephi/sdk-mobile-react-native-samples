import React, { useState } from "react";
import { Alert, Modal, Text, View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { ActionSheetStyles } from "./ActionSheetStyles";
import { VoiceConfiguration } from "@facephi/sdk-voice-react-native/src";

interface Props {
  modalVisible: boolean;
  setModalVisible: Function;
  config: VoiceConfiguration;
  setSdkConfig: Function;
  isDarkMode: boolean;
}

const VoiceModal: React.FC<Props> = ({modalVisible, setModalVisible, config, setSdkConfig, isDarkMode}) => 
{
  const yesNoList = ["YES", "NO"];

  const [localConfig, setLocalConfig] = useState<VoiceConfiguration>(config!);

  const setSelected = (value: any, option: string) => 
  {
    setLocalConfig({
      timeout:                localConfig.timeout,
      phrases:                localConfig.phrases,
      returnAudios:           option == "returnAudios" ? (value == "YES" ? true : false) : localConfig.returnAudios,
      returnTokenizedAudios:  option == "returnTokenizedAudios" ? (value == "YES" ? true : false) : localConfig.returnTokenizedAudios,
      showDiagnostic:         option == "showDiagnostic" ? (value == "YES" ? true : false) : localConfig.showDiagnostic,
      showPreviousTip:        option == "showPreviousTip" ? (value == "YES" ? true : false) : localConfig.showPreviousTip,
      showTutorial:           option == "showTutorial" ? (value == "YES" ? true : false) : localConfig.showTutorial,
      vibrationEnabled:       option == "vibrationEnabled" ? (value == "YES" ? true : false) : localConfig.vibrationEnabled
    });
    setSdkConfig(localConfig);
  }

  const handle = (key: string, value: any) => 
  {
    setLocalConfig({
      timeout:                key == "timeout" ? parseInt(value) : localConfig.timeout,
      phrases:                key == "phrases" ? value.toString() : localConfig.phrases,
      returnAudios:           localConfig.returnAudios,
      returnTokenizedAudios:  localConfig.returnTokenizedAudios,
      showDiagnostic:         localConfig.showDiagnostic,
      showPreviousTip:        localConfig.showPreviousTip,
      showTutorial:           localConfig.showTutorial,
      vibrationEnabled:       localConfig.vibrationEnabled
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
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>Phrases:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="Phrases"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='default'
                      onChangeText={text => handle("phrases", text)}
                      value={localConfig.phrases=== undefined ? "" : localConfig.phrases.toString()}
                      //maxLength={4}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>Timeout:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="Timeout"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='numeric'
                      onChangeText={text => handle("timeout", text)}
                      value={localConfig.timeout=== undefined ? "0" : localConfig.timeout.toString()}
                      maxLength={8}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Vibration:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.vibrationEnabled ? "YES" : "NO"}
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
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.vibrationEnabled ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "vibrationEnabled")
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
                    selectedValue={localConfig.showTutorial ? "YES" : "NO"}
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
                    selectedValue={localConfig.vibrationEnabled ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "vibrationEnabled")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Enable Diagnostic:</Text>
                  {Platform.OS === 'android' ? 
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
                    selectedValue={localConfig.vibrationEnabled ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "vibrationEnabled")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Enable PreviousTips:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    //mode="dialog"
                    selectedValue={localConfig.showPreviousTip ? "YES" : "NO"}
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
                    selectedValue={localConfig.showPreviousTip ? "YES" : "NO"}
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
                  <Text style={{ width: 90, color: "black" }}>Return Audios:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.returnAudios ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "returnAudios")
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
                    selectedValue={localConfig.returnAudios ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "returnAudios")
                    }>
                    {yesNoList.map((item, index) => {
                        return (<PickerIOS.Item label={item} value={item} key={index}/>) 
                    })}
                  </PickerIOS>
                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Return Tokenized Audios:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.returnTokenizedAudios ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "returnTokenizedAudios")
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
                    selectedValue={localConfig.returnTokenizedAudios ? "YES" : "NO"}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "returnTokenizedAudios")
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
export default VoiceModal;