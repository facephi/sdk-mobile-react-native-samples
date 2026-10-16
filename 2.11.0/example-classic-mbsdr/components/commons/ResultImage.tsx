import React from 'react';
import {Image, Text, View} from 'react-native';
import {styles, type Palette} from '../../App.styles';

type ResultImageProps = {
  colors: Palette;
  label: string;
  portrait?: boolean;
  square?: boolean;
  uri?: string;
};

const ResultImage = ({colors, label, portrait, square, uri}: ResultImageProps) => {
  const frameColors = {
    borderColor: portrait ? colors.outlineStrong : colors.outline,
    backgroundColor: portrait ? 'transparent' : colors.imageWell,
  };
  return (
    <View>
      <Text style={[styles.resultLabel, {color: colors.onSurface}]}>{label}</Text>
      <View
        style={[
          portrait ? styles.portraitFrame : styles.documentFrame,
          square && styles.squareFrame,
          frameColors,
        ]}>
        <Image source={{uri}} style={portrait ? styles.coverImage : styles.containImage} />
      </View>
    </View>
  );
};

export default ResultImage;
