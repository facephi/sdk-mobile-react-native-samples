import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

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

const SelphIDTitleText = ({text}) => {
  return (
    <View style={styles.textContent}>
      <Text style={styles.textTitle}>{text}</Text>
    </View>
  );
};

export default SelphIDTitleText;
