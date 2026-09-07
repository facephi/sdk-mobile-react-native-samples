import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { styles } from '../../styles';

const SdkWarning = (props: any) => 
{
  const { stateResult } = props;
  return (
    <Text 
      style={[
        styles.warningText,
        { color: stateResult[2], display: stateResult[0] ? 'flex' : 'none' },
      ]}>
      {stateResult[1]}
    </Text>
  );
};

SdkWarning.propTypes = {
  stateResult: PropTypes.any.isRequired
};

export default SdkWarning;
