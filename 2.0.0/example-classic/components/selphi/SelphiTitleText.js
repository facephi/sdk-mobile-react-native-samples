import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  textContent: {
    flex: 0.25,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  textTitle: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
  },
});

const SelphiTitleText = ({text, textColor}) => {
  const newStyle = StyleSheet.flatten([styles.textTitle, {color: textColor}]);
  return (
    <View style={styles.textContent}>
      <Text style={newStyle}>{text}</Text>
    </View>
  );
};

SelphiTitleText.propTypes = {
  text: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};

export default SelphiTitleText;
