import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {styles, type Palette} from '../../App.styles';

type ActionCardProps = {
  colors: Palette;
  done: boolean;
  icon: string;
  onLongPress?: () => void;
  onPress: () => void;
  subtitle: string;
  testID?: string;
  title: string;
};

const ActionCard = ({
  colors,
  done,
  icon,
  onLongPress,
  onPress,
  subtitle,
  testID,
  title,
}: ActionCardProps) => (
  <Pressable
    delayLongPress={400}
    onLongPress={onLongPress}
    onPress={onPress}
    style={[styles.actionCard, {borderColor: colors.outline, backgroundColor: colors.screen}]}
    testID={testID}>
    <View style={[styles.actionIcon, {backgroundColor: colors.primarySoft}]}>
      <Text style={[styles.actionIconText, {color: colors.primary}]}>{icon}</Text>
    </View>
    <View style={styles.actionCopy}>
      <Text style={[styles.actionTitle, {color: colors.onSurface}]}>{title}</Text>
      <Text style={[styles.actionSubtitle, {color: colors.muted}]}>{subtitle}</Text>
    </View>
    <Text style={[styles.actionStatus, {color: done ? colors.primary : colors.chevron}]}>
      {done ? '✓' : '→'}
    </Text>
  </Pressable>
);

export default ActionCard;
