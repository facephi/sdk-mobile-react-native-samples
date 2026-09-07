import React, { useMemo, useState } from 'react';
import { Text, TextInput, View, ScrollView } from 'react-native';
import { handleTypingEvent } from '@fip360/widget-behavior-react-native';
import SdkButton from '../components/commons/SdkButton';
import SdkWarning from '../components/commons/SdkWarning';
import { launchClearSession, launchInitialize } from '../providers/behavior';
import {
  styles,
  getTitleColor,
  getSubtitleColor,
  getPlaceholderColor,
  getInputThemeStyle,
} from '../styles';

type Props = {
  darkMode: boolean;
  setSession: React.Dispatch<React.SetStateAction<string>>;
  session: string;
  onLogin: (userId: string) => void;
  showError: boolean;
  message: string;
  textColorMessage: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setTextColorMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginScreen = ({ darkMode, setSession, session, onLogin, showError, message, textColorMessage, setMessage, setTextColorMessage, setShowError }: Props) => 
{
  const [user, setUser]             = useState('');
  const [localError, setLocalError] = useState('');

  const userField = useMemo(() => handleTypingEvent('user', setUser), []);

  const handleSubmit = () => {
    if (!user.trim()) {
      setLocalError('User is required');
      return;
    }
    setLocalError('');
    onLogin(user.trim());
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: getTitleColor(darkMode) }]}>
          Sign in
        </Text>
        <Text style={[styles.subtitle, { color: getSubtitleColor(darkMode) }]}>
          Behavior 360 sample
        </Text>

        <SdkWarning
          stateResult={[
            showError || !!localError,
            localError || message,
            localError ? 'red' : textColorMessage,
          ]}
        />

        <TextInput
          style={[styles.input, getInputThemeStyle(darkMode)]}
          value={user}
          placeholder="User"
          placeholderTextColor={getPlaceholderColor(darkMode)}
          autoCapitalize="none"
          keyboardType="default"
          autoCorrect={false}
          {...userField.textInputProps}
        />

        { session !== '' && <SdkButton onPress={handleSubmit} text="Login" /> }
        { session === '' && <SdkButton onPress={() => launchInitialize(setMessage, setTextColorMessage, setShowError, setSession)} text="Initialize" /> }
        { session !== '' && <SdkButton onPress={() => launchClearSession(setSession)} text="Clear Session" /> }
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
