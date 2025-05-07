import { StyleSheet } from "react-native";

export const ActionSheetStyles = StyleSheet.create({
    centeredViewAndroid: {
        flex: 0.8,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22
    },
    centeredView: {
      flex: 0.99,
      //justifyContent: "center",
      //alignItems: "center",
      //marginTop: 22
    },
    modalView: {
      flex: 1,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
      //marginTop: "5%"
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
});