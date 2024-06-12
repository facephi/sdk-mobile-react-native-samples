import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  selphIDButtonContainer: {
    alignItems: 'center',
    height: '8%',
    width: '80%',
    justifyContent: 'flex-end',
    paddingBottom: '5%',
  },
  selphIDButtonTouchable: {
    alignItems: 'center',
    width: '80%',
    padding: 6,
    borderRadius: 20,
    borderColor: '#764bbb',
    backgroundColor: '#764bbb',
    justifyContent: 'center',
  },
  selphIDButtonText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
    color: '#ffffff', 
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
});

const SelphIDButton = ({onPress, text}) => {
  return (
    <View style={styles.selphIDButtonContainer}>
      <TouchableOpacity style={styles.selphIDButtonTouchable} onPress={onPress}>
        <Text style={styles.selphIDButtonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelphIDButton;
