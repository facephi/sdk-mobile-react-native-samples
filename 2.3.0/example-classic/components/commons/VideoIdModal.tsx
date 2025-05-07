import React, { useState } from "react";
import { Alert, Modal, Text, View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { VideoIdConfiguration } from "@facephi/sdk-videoid-react-native/src";
import { ActionSheetStyles } from "./ActionSheetStyles";

interface Props {
  modalVisible: boolean;
  setModalVisible: Function;
  config: VideoIdConfiguration;
  setSdkConfig: Function;
  isDarkMode: boolean;
}

const VideoIdModal: React.FC<Props> = ({modalVisible, setModalVisible, config, setSdkConfig, isDarkMode}) => 
{
  const videoModeList = ["FACE_DOCUMENT_FRONT", "ONLY_FACE", "FACE_DOCUMENT_FRONT_BACK"];
  const yesNoList     = ["YES", "NO"];

  const [localConfig, setLocalConfig] = useState<VideoIdConfiguration>(config!);

  const setSelected = (value: any, option: string) => 
  {
    setLocalConfig({
      url:            localConfig.url,
      apiKey:         localConfig.apiKey,
      tenantId:       localConfig.tenantId,
      vibration:      option == "vibration" ? value : localConfig.vibration,
      mode:           option == "mode" ? value : localConfig.mode,
      showTutorial:   option == "showTutorial" ? value : localConfig.showTutorial,
    })
    setSdkConfig(config)
  }

  const handleChange = (key: string, value: any) => 
  {
    setLocalConfig({
      url:            key == "url" ? value.toString() : localConfig.url,
      apiKey:         key == "apiKey" ? value.toString() : localConfig.apiKey,
      tenantId:       key == "tenantId" ? value.toString() : localConfig.tenantId,
      vibration:      localConfig.vibration,
      mode:           localConfig.mode,
      showTutorial:   localConfig.showTutorial,
    })
    setSdkConfig(config)
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
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>Url:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="Url"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='default'
                      onChangeText={text => handleChange("url", text)}
                      value={localConfig.url=== undefined ? "" : localConfig.url.toString()}
                      //maxLength={4}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>ApiKey:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="ApiKey"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "black"}}
                      keyboardType='default'
                      onChangeText={text => handleChange("apiKey", text)}
                      value={localConfig.apiKey=== undefined ? "" : localConfig.apiKey.toString()}
                      //maxLength={4}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black", paddingEnd: "3%" }}>TenantId:</Text>
                  <TextInput
                      //autoCapitalize={"characters"}
                      placeholder="TenantId"
                      style={{fontSize: 13, height: 41, width: 150, borderBottomWidth: 0.5, borderBottomColor: "grey", color: "grey"}}
                      keyboardType='default'
                      onChangeText={text => handleChange("tenantId", text)}
                      value={localConfig.tenantId === undefined ? "" : localConfig.tenantId.toString()}
                      //maxLength={4}
                      //onBlur={props.handleBlur('code')}
                  />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Video Mode:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.mode === undefined ? "FACE_DOCUMENT_FRONT" : localConfig.mode}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "mode")
                    }>
                    {videoModeList.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                  </Picker>
                  : 
                  <PickerIOS
                    themeVariant={isDarkMode ? "dark" : "light"}
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
                    //mode="dialog"
                    selectedValue={localConfig.mode === undefined ? "FACE_DOCUMENT_FRONT" : localConfig.mode}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelected(itemValue, "mode")
                    }>
                    {videoModeList.map((item, index) => {
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
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }] }}
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
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                  <Text style={{ width: 90, color: "black" }}>Enable Vibration:</Text>
                  {Platform.OS === 'android' ? 
                  <Picker
                    style={{ height: 50, width: 170, transform: [{ scale: 0.81 }], color: "black" }}
                    mode="dialog"
                    selectedValue={localConfig.vibration === undefined ? false : (localConfig.vibration ?  "YES" : "NO")}
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
                    selectedValue={localConfig.vibration ?  "YES" : "NO"}
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
export default VideoIdModal;