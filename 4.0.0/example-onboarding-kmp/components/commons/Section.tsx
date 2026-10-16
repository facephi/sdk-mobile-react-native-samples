import React from 'react';
import {Text, View} from 'react-native';
import {styles, type Palette} from '../../App.styles';

type SectionProps = {
  colors: Palette;
  gap?: boolean;
  subtitle: string;
  title: string;
};

const Section = ({colors, gap, subtitle, title}: SectionProps) => (
  <View style={[styles.sectionTitle, gap && styles.sectionGap]}>
    <Text style={[styles.sectionHeading, {color: colors.onSurface}]}>{title}</Text>
    <Text style={[styles.sectionSubtitle, {color: colors.muted}]}>{subtitle}</Text>
  </View>
);

export default Section;
