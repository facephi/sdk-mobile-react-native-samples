import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  sdkButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 7,
  },
  sdkButtonTouchable: {
    width: '70%',          // 👈 70% del ancho de pantalla
    height: 45,            // 👈 todos iguales
    borderRadius: 10,
    backgroundColor: '#0099af',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  sdkButtonText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
    color: '#ffffff',
    textTransform: 'capitalize',
  },
});

const SdkButton = (props: any) => {
  const { onPress, text } = props;
  return (
    <View style={styles.sdkButtonContainer}>
      <TouchableOpacity style={styles.sdkButtonTouchable} onPress={onPress}>
        <Text style={styles.sdkButtonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

SdkButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
}

export default SdkButton;