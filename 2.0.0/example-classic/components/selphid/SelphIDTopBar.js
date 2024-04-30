import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

class SelphIDTopBar extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}> SelphID </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#764bbb',
    alignItems: 'center',
    width: '100%',
    height: '7%',
    justifyContent: 'center', // center, space-around
  },
  textTitle: {
    color: '#ffffff',
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
  },
});

export default SelphIDTopBar;
