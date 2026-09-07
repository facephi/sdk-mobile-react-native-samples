/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect } from 'react';
import { StatusBar, Modal, Appearance, LogBox, NativeEventEmitter, NativeModules } from 'react-native';
import SdkTopBar from './components/commons/SdkTopBar';
import ActionSheet from './components/commons/CustomActionSheet';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { launchInitialize, launchSetPosition, launchSetUserId } from './providers/behavior';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import { BehaviorResult } from '@fip360/widget-behavior-react-native';

type Screen = 'login' | 'home' | 'dashboard';

const App = () => {
  const [message, setMessage]                   = useState('');
  const [showError, setShowError]               = useState(false);
  const [textColorMessage, setTextColorMessage] = useState('#777777');
  const [actionSheet, setActionSheet]           = useState(false);
  const [darkMode, setDarkMode]                 = useState(false);
  const [screen, setScreen]                     = useState<Screen>('login');
  const [user, setUser]                         = useState('');
  const [session, setSession]                   = useState<string>('');

  const eventsEmitter = new NativeEventEmitter(NativeModules.WgtBehavior); // Optional: For iOS events
  
  /* init listener events */
  const eventsListener = eventsEmitter.addListener(
    "behavior.events.listener",
    (res: BehaviorResult) => console.log("WGT_BEHAVIOR_EVENTS", res)
  );

  const actionItems = [
    {
      id: 1,
      label: 'Theme Mode',
      onPress: () => {},
    },
  ];

  LogBox.ignoreLogs(['new NativeEventEmitter']);
  LogBox.ignoreAllLogs();

  const backgroundStyle = { backgroundColor: darkMode ? '#000000' : '#ffffff' };

  useEffect(() => 
  {
    const colorScheme = Appearance.getColorScheme();
    setDarkMode(colorScheme === 'dark');

    launchInitialize(setMessage, setTextColorMessage, setShowError, setSession);
  }, []);

  const handleLogin = (user: string) => {
    setUser(user);
    setScreen('home'); // SETEA LAS VISTAS.
    launchSetUserId(setMessage, setTextColorMessage, setShowError, user);
    launchSetPosition(setMessage, setTextColorMessage, setShowError, 'Home');
  };

  const handleDashboard = () => {
    setUser('');
    setScreen('dashboard');
    launchSetPosition(setMessage, setTextColorMessage, setShowError, 'Dashboard');
  };

  const handleLogout = () => {
    setUser('');
    setScreen('login');
    launchSetPosition(setMessage, setTextColorMessage, setShowError, 'Login');
  };

  const handleHome = () => {
    setScreen('home');
    launchSetPosition(setMessage, setTextColorMessage, setShowError, 'Home');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={[{ flex: 1 }, backgroundStyle]}>
        <SdkTopBar onPress={() => setActionSheet(true)} />

        <Modal
          transparent={true}
          visible={actionSheet}
          style={[{ margin: 0, justifyContent: 'flex-end' }]}
        >
          <ActionSheet
            actionItems={actionItems}
            onCancel={() => setActionSheet(false)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </Modal>

        {screen === 'login' && (
          <LoginScreen
            darkMode={darkMode}
            setSession={setSession}
            session={session}
            onLogin={handleLogin}
            showError={showError}
            setMessage={setMessage}
            setTextColorMessage={setTextColorMessage}
            setShowError={setShowError}
            message={message}
            textColorMessage={textColorMessage}
          />
        )}

        {screen === 'home' && (
          <HomeScreen
            darkMode={darkMode}
            user={user}
            onGoToDashboard={handleDashboard}
            onLogout={handleLogout}
          />
        )}

        {screen === 'dashboard' && (
          <DashboardScreen
            darkMode={darkMode}
            user={user}
            onLogout={handleLogout}
            onGoToHome={handleHome}
            showError={showError}
            message={message}
            textColorMessage={textColorMessage}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
