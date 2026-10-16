import {StyleSheet} from 'react-native';

export const light = {
  screen: '#f7fbfc',
  onSurface: '#171d1e',
  muted: 'rgba(23, 29, 30, 0.62)',
  mutedSoft: 'rgba(23, 29, 30, 0.55)',
  chevron: 'rgba(23, 29, 30, 0.35)',
  primary: '#006874',
  onPrimary: '#ffffff',
  outline: 'rgba(111, 121, 122, 0.28)',
  outlineStrong: 'rgba(111, 121, 122, 0.35)',
  primarySoft: 'rgba(0, 104, 116, 0.12)',
  imageWell: 'rgba(0, 104, 116, 0.06)',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',
  divider: 'rgba(111, 121, 122, 0.2)',
  disabledBg: 'rgba(23, 29, 30, 0.12)',
  disabledFg: 'rgba(23, 29, 30, 0.38)',
  hero: '#007a8c',
};

export const dark = {
  screen: '#0e1415',
  onSurface: '#dee4e5',
  muted: 'rgba(222, 228, 229, 0.62)',
  mutedSoft: 'rgba(222, 228, 229, 0.55)',
  chevron: 'rgba(222, 228, 229, 0.35)',
  primary: '#4fd8ec',
  onPrimary: '#00363d',
  outline: 'rgba(137, 148, 149, 0.28)',
  outlineStrong: 'rgba(137, 148, 149, 0.35)',
  primarySoft: 'rgba(79, 216, 236, 0.12)',
  imageWell: 'rgba(79, 216, 236, 0.06)',
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  divider: 'rgba(137, 148, 149, 0.2)',
  disabledBg: 'rgba(222, 228, 229, 0.12)',
  disabledFg: 'rgba(222, 228, 229, 0.38)',
  hero: '#006e80',
};

export type Palette = typeof light;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 8,
  },
  appTitle: {
    flex: 1,
    fontFamily: 'CircularStd-Bold',
    fontSize: 22,
    fontWeight: '400',
  },
  themeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 22,
  },
  page: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 28,
  },
  hero: {
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    borderRadius: 28,
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'CircularStd-Bold',
    fontSize: 13,
    letterSpacing: 0.4,
  },
  heroTitle: {
    marginTop: 6,
    color: '#ffffff',
    fontFamily: 'CircularStd-Bold',
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 30,
  },
  heroBody: {
    marginTop: 8,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
    lineHeight: 19,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
  },
  bannerIcon: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'CircularStd-Bold',
  },
  bannerText: {
    flex: 1,
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
    lineHeight: 18,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionGap: {
    marginTop: 28,
  },
  sectionHeading: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 16,
    lineHeight: 22,
  },
  sectionSubtitle: {
    marginTop: 2,
    fontFamily: 'CircularStd-Bold',
    fontSize: 12,
    lineHeight: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 20,
  },
  actionIcon: {
    width: 48,
    height: 48,
    marginRight: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    fontSize: 22,
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 16,
    lineHeight: 22,
  },
  actionSubtitle: {
    marginTop: 2,
    fontFamily: 'CircularStd-Bold',
    fontSize: 12,
    lineHeight: 16,
  },
  actionStatus: {
    marginLeft: 8,
    fontSize: 22,
  },
  filledButton: {
    minHeight: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  filledIcon: {
    fontSize: 18,
  },
  filledLabel: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
  },
  hint: {
    marginTop: 8,
    fontFamily: 'CircularStd-Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  surface: {
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
  },
  surfaceFlush: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  resultLabel: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
    lineHeight: 20,
  },
  portraitFrame: {
    width: 164,
    height: 210,
    alignSelf: 'center',
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 28,
  },
  documentFrame: {
    aspectRatio: 1.58,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 16,
  },
  squareFrame: {
    aspectRatio: 1,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  containImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  outlineButton: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineIcon: {
    fontSize: 16,
  },
  outlineLabel: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
  },
  menuTile: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 28,
    marginRight: 12,
    fontSize: 18,
  },
  menuLabel: {
    flex: 1,
    fontFamily: 'CircularStd-Bold',
    fontSize: 16,
  },
  menuChevron: {
    fontSize: 22,
  },
  menuDivider: {
    height: 1,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    maxHeight: '60%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  sheetTitle: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
  },
  sheetScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sheetEmpty: {
    marginVertical: 24,
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
  },
  sheetRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  sheetKey: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 12,
  },
  sheetValue: {
    marginTop: 2,
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
  },
  sheetTall: {
    maxHeight: '85%',
  },
  configRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  configLabel: {
    flex: 1,
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
  },
  configValue: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
  },
  configInput: {
    minWidth: 64,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'right',
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
  },
});

