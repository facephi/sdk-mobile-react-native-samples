import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import SdkButton from '../components/commons/SdkButton';
import { styles, getTitleColor, getSubtitleColor } from '../styles';

type Props = {
  darkMode: boolean;
  user: string;
  onGoToDashboard: () => void;
  onLogout: () => void;
};

const HomeScreen = ({ darkMode, user, onGoToDashboard, onLogout }: Props) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: getTitleColor(darkMode) }]}>
          Home
        </Text>
        <Text style={[styles.subtitle, { color: getSubtitleColor(darkMode) }]}>
          Welcome, {user}
        </Text>

        <View style={styles.actions}>
          <SdkButton onPress={onGoToDashboard} text="Go to Dashboard" />
          <SdkButton onPress={onLogout} text="Logout" />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
