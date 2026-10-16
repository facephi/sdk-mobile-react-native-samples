import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
  selphIDImageContainer: {
    width: '70%',           // default
    aspectRatio: 4 / 3,     // 👈 documento horizontal
    marginVertical: 8,
    backgroundColor: '#e8e6e6',
    borderRadius: 5,
    overflow: 'hidden',
    flexShrink: 0,
  },
  selphIDImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

const SelphIDImage = (props: any) => 
{
  const { image, widthImage, backgroundColor } = props;
  const viewStyle = StyleSheet.flatten([
    styles.selphIDImageContainer,
    { width: widthImage, backgroundColor },
  ]);
  
  if (!image) return null;
  return (
    <View style={viewStyle}>
      <Image
        style={[styles.selphIDImage]}
        resizeMode={'contain'}
        source={{
          uri: 'data:image/jpeg;base64,' + image,
        }}
      />
    </View>
  );
};

SelphIDImage.propTypes = {
  image: PropTypes.string,
  widthImage: PropTypes.string.isRequired,
};

export default SelphIDImage;
