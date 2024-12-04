import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  sdkButtonContainer: {
    alignItems: 'center',
    //flex: 0.55,
    height: 50,
    width: '80%',
    justifyContent: 'center',
  },
  sdkButtonTouchable: {
    alignItems: 'center',
    //flex: 0.55,
    height: '75%',
    width: '80%',
    borderRadius: 20,
    borderColor: '#0099af',
    backgroundColor: '#0099af',
    justifyContent: 'center',
  },
  sdkButtonText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
    color: '#ffffff',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
});

const SdkButton = ({onPress, text}) => {
  return (
    <View style={styles.sdkButtonContainer}>
      <TouchableOpacity style={styles.sdkButtonTouchable} onPress={onPress}>
        <Text style={styles.sdkButtonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SdkButton;
