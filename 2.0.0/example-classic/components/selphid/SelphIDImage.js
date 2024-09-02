import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
  selphIDImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    height: 120,
    width: '70%',
    backgroundColor: '#e8e6e6',
    borderRadius: 5,

  },
  selphIDImage: {
    height: '95%',
    width: '90%',
    borderRadius: 5,
  },
});

const SelphIDImage = ({image, widthImage}) => {
  const newSelphIDImageContainer = StyleSheet.flatten([
    styles.selphIDImageContainer,
    {width: widthImage},
  ]);
  return (
    image ? <View style={newSelphIDImageContainer}>
      <Image
        style={styles.selphIDImage}
        resizeMode={'contain'}
        source={{
          uri: 'data:image/jpeg;base64,' + image,
        }}
      />
    </View> : null
  );
};

SelphIDImage.propTypes = {
  image: PropTypes.string,
  widthImage: PropTypes.string.isRequired,
};

export default SelphIDImage;
