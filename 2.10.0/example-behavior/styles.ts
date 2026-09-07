import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#0099af',
  white: '#ffffff',
  black: '#000000',
  titleLight: '#111111',
  titleDark: '#ffffff',
  subtitleLight: '#666666',
  subtitleDark: '#aaaaaa',
  inputBgLight: '#f5f5f5',
  inputBgDark: '#1a1a1a',
  inputBorderLight: '#cccccc',
  inputBorderDark: '#555555',
  placeholderLight: '#999999',
  placeholderDark: '#888888',
  actionSheetPrimary: 'rgb(0,98,255)',
  actionSheetBorder: '#DBDBDB',
  actionSheetCancel: '#fa1616',
};

export const getTitleColor = (darkMode: boolean) =>
  darkMode ? colors.titleDark : colors.titleLight;

export const getSubtitleColor = (darkMode: boolean) =>
  darkMode ? colors.subtitleDark : colors.subtitleLight;

export const getPlaceholderColor = (darkMode: boolean) =>
  darkMode ? colors.placeholderDark : colors.placeholderLight;

export const getInputThemeStyle = (darkMode: boolean): TextStyle => ({
  color: darkMode ? colors.white : colors.black,
  borderColor: darkMode ? colors.inputBorderDark : colors.inputBorderLight,
  backgroundColor: darkMode ? colors.inputBgDark : colors.inputBgLight,
});

export const styles = StyleSheet.create({
  // Screens
  scroll: {
    width: '100%',
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: '70%',
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginVertical: 7,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,

  // SdkButton
  sdkButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 7,
  },
  sdkButtonTouchable: {
    width: '70%',
    height: 45,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  sdkButtonText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
    color: colors.white,
    textTransform: 'capitalize',
  },

  // SdkTopBar
  topBarContainer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    width: '100%',
    height: '7.5%',
    justifyContent: 'center',
  },
  topBarTitle: {
    color: colors.white,
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
  },
  topBarSettings: {
    position: 'absolute',
    right: 10,
  },

  // SdkWarning
  warningText: {
    fontSize: 18,
    marginTop: '3%',
  },

  // ActionSheet
  modalContent: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
    width: '95%',
    position: 'absolute',
    bottom: 0,
  },
  actionSheetText: {
    fontSize: 18,
    color: colors.actionSheetPrimary,
  },
  actionSheetView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.actionSheetBorder,
  },
  actionSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
