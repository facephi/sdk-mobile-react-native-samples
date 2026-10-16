import React from 'react';
import {Pressable, Text} from 'react-native';
import {styles, type Palette} from '../../App.styles';

type MenuTileProps = {
  colors: Palette;
  danger?: boolean;
  icon: string;
  onPress: () => void;
  title: string;
};

const MenuTile = ({colors, danger, icon, onPress, title}: MenuTileProps) => (
  <Pressable onPress={onPress} style={styles.menuTile}>
    <Text style={[styles.menuIcon, {color: danger ? colors.error : colors.primary}]}>{icon}</Text>
    <Text style={[styles.menuLabel, {color: danger ? colors.error : colors.onSurface}]}>
      {title}
    </Text>
    <Text style={[styles.menuChevron, {color: colors.chevron}]}>›</Text>
  </Pressable>
);

export default MenuTile;
