import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import SdkButton from '../components/commons/SdkButton';
import SdkWarning from '../components/commons/SdkWarning';
import { styles, getTitleColor, getSubtitleColor } from '../styles';

type Props = {
  darkMode: boolean;
  user: string;
  onLogout: () => void;
  onGoToHome: () => void;
  showError: boolean;
  message: string;
  textColorMessage: string;
};

const DashboardScreen = ({
  darkMode,
  user,
  onLogout,
  onGoToHome,
  showError,
  message,
  textColorMessage
}: Props) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: getTitleColor(darkMode) }]}>
          Dashboard
        </Text>
        <Text style={[styles.subtitle, { color: getSubtitleColor(darkMode) }]}>
          Signed in as {user}
        </Text>

        <SdkWarning stateResult={[showError, message, textColorMessage]} />

        <View style={styles.actions}>
          <SdkButton onPress={onGoToHome} text="Go to Home" />
          <SdkButton onPress={onLogout} text="Logout" />
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
