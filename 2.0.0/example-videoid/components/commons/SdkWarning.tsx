import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

const SdkWarning = (props: any) => {
  const { stateResult } = props;
  return (
    <Text 
      style={
        { fontSize: 18, color: stateResult[2], display: stateResult[0] ? 'flex' : 'none', marginTop: '3%' }
      }>
      {stateResult[1]}
    </Text>
  );
};
SdkWarning.propTypes = {
  stateResult: PropTypes.any.isRequired
}

export default SdkWarning;