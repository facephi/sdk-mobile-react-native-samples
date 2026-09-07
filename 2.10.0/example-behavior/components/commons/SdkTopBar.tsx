import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../styles';

const SdkTopBar = (props: any) => {
  const { onPress } = props;
  return (
    <View style={styles.topBarContainer}>
      <Text style={styles.topBarTitle}> Mobile 360 </Text>
      <View style={styles.topBarSettings} testID='Configuration'>
        <TouchableOpacity onPress={ onPress } ><Image source={require('../../assets/images/icons-settings-24.png')}/></TouchableOpacity>
      </View>
    </View>
  );
}

SdkTopBar.propTypes = {
  onPress: PropTypes.func.isRequired,
}

export default SdkTopBar;
