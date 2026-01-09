import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
  selphiImageContainer: {
    aspectRatio: 1,        // 👈 cuadrada (ajústalo si quieres)
    maxHeight: 300,
    marginVertical: 8,
    backgroundColor: '#e8e6e6',
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
  },
  selphiImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

const SelphiImage = ({ image, widthImage }: any) => {
  if (!image) return null;

  return (
    <View style={[styles.selphiImageContainer, { width: widthImage }]}>
      <Image
        style={styles.selphiImage}
        source={{ uri: `data:image/jpeg;base64,${image}` }}
      />
    </View>
  );
};

SelphiImage.propTypes = {
  image: PropTypes.string,
  widthImage: PropTypes.string.isRequired,
};

export default SelphiImage;