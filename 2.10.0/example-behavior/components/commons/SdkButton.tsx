import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

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
