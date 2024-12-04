import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

const SdkTopBar = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}> Sdk Mobile </Text>
      <View style={{ position: "absolute", right: 10 }}>
        <TouchableOpacity onPress={ onPress } ><Image source={require('../../assets/images/icons-settings-24.png')}/></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 0.5,
    backgroundColor: '#0099af',
    alignItems: 'center',
    width: '100%',
    height: '7.5%',
    justifyContent: 'center', // center, space-around
  },
  textTitle: {
    color:'#ffffff',
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
  },
});

SdkTopBar.propTypes = {
  onPress: PropTypes.func
};

export default SdkTopBar;
