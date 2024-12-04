import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

class SdkTopBar extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}> VideoId Example </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 0.5,
    backgroundColor: '#0099af',
    alignItems: 'center',
    width: '100%',
    height: '5.5%',
    justifyContent: 'center', // center, space-around
  },
  textTitle: {
    color:'#ffffff',
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
  },
});

export default SdkTopBar;
