import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

const SelphIDWarning = ({stateResult}) => {
  return (
    <Text 
      style={
        { fontSize: 18, color: stateResult[2], display: stateResult[0] ? 'flex' : 'none', marginTop: '3%' }
      }>
      {stateResult[1]}
    </Text>
  );
};

SelphIDWarning.propTypes = {
  stateResult: PropTypes.any.isRequired
};

export default SelphIDWarning;