import React from 'react';
import { Text } from 'react-native';

const SdkWarning = ({stateResult}) => {
  return (
    <Text 
      style={
        { fontSize: 18, color: stateResult[2], display: stateResult[0] ? 'flex' : 'none', marginTop: '3%' }
      }>
      {stateResult[1]}
    </Text>
  );
};

export default SdkWarning;