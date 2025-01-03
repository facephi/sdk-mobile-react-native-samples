import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  textContent: {
    alignItems: 'center',
    height: 25,
    width: '100%',
    justifyContent: 'center',
  },
  textTitle: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
    color: '#777777',
  },
});

const SdkTitleText = (props: any) => 
{
  const { text } = props;
  return (
    <View style={styles.textContent}>
      <Text style={styles.textTitle}>{text}</Text>
    </View>
  );
};

SdkTitleText.propTypes = {
  text: PropTypes.string.isRequired
};

export default SdkTitleText;
