import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
  selphiImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    height: 130,
    //flex: 5,
    width: '70%',
    backgroundColor: '#e8e6e6',
    borderRadius: 15,
    
  },
  selphiImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
});

const SelphiImage = (props: any) => 
{
  const { image, widthImage } = props;
  const newSelphiImageContainer = StyleSheet.flatten([
    styles.selphiImageContainer,
    {width: widthImage},
  ]);
  return (
    image ? 
    <View style={newSelphiImageContainer}>
      <Image
        style={styles.selphiImage}
        source={{
          uri: 'data:image/jpeg;base64,' + image,
        }}
      />
    </View> : null
  );
};

SelphiImage.propTypes = {
  image: PropTypes.string,
  widthImage: PropTypes.string.isRequired,
};

export default SelphiImage;