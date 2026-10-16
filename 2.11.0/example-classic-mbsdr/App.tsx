/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';
import { Appearance, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {SelphiConfiguration, SelphiResult} from '@facephi/sdk-selphi-iad-react-native';
import {SelphidConfiguration, SelphidResult} from '@facephi/sdk-selphid-mbsdr-react-native';
import { callGetExtraData, launchCloseSession, launchFlow, launchInitSession, startInitOperation } from './providers/core';
import {defaultSelphiConfiguration, startSelphi} from './providers/selphi';
import {defaultSelphidConfiguration, startSelphid} from './providers/selphid';
import {dark, light, styles} from './App.styles';
import ActionCard from './components/commons/ActionCard';
import MenuTile from './components/commons/MenuTile';
import OcrSheet from './components/commons/OcrSheet';
import ResultImage from './components/commons/ResultImage';
import Section from './components/commons/Section';
import SelphiConfigSheet from './components/commons/SelphiConfigSheet';
import SelphidConfigSheet from './components/commons/SelphidConfigSheet';

const URI_JPEG_HEADER = 'data:image/jpeg;base64,';

const filledImage = (value?: string | null) => {
  if (!value) {
    return false;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === URI_JPEG_HEADER) {
    return false;
  }
  if (trimmed.endsWith('undefined') || trimmed.endsWith('null')) {
    return false;
  }
  if (trimmed.includes('image_no_available')) {
    return false;
  }
  return true;
};

const imageUri = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  return value.startsWith('data:') ? value : URI_JPEG_HEADER + value;
};

const documentEntries = (data: unknown) => {
  if (data == null) {
    return [];
  }
  let record: Record<string, unknown> | null = null;
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed) {
      return [];
    }
    try {
      record = JSON.parse(trimmed);
    } catch {
      return [];
    }
  } else if (typeof data === 'object') {
    record = data as Record<string, unknown>;
  }
  if (!record) {
    return [];
  }
  return Object.entries(record).map(([key, value]) => ({
    key,
    value:
      value == null
        ? ''
        : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value),
  }));
};

const App = () => {
  const [, setOperationId]                = useState<string>('');
  const [message, setMessage]             = useState<string>('');
  const [showError, setShowError]         = useState<boolean>(true);
  const [, setTextColorMessage]           = useState<string>('#777777');
  const [darkMode, setDarkMode]           = useState<boolean>(true);
  const [ocrOpen, setOcrOpen]             = useState<boolean>(false);
  const [selphiConfigOpen, setSelphiConfigOpen]   = useState<boolean>(false);
  const [selphiConfig, setSelphiConfig]           = useState<SelphiConfiguration>(defaultSelphiConfiguration);
  const [selphidConfigOpen, setSelphidConfigOpen] = useState<boolean>(false);
  const [selphidConfig, setSelphidConfig]         = useState<SelphidConfiguration>(defaultSelphidConfiguration);
  const [selphiResult, setSelphiResult]           = useState<SelphiResult | null>(null);
  const [selphidResult, setSelphidResult]         = useState<SelphidResult | null>(null);

  const colors = darkMode ? dark : light;
  const ocrRows = documentEntries(selphidResult?.documentData);
  const selphidDone =
    filledImage(selphidResult?.frontDocumentImage) ||
    filledImage(selphidResult?.backDocumentImage);
  const hasResults =
    filledImage(selphiResult?.bestImageCropped) ||
    filledImage(selphidResult?.frontDocumentImage) ||
    filledImage(selphidResult?.backDocumentImage) ||
    filledImage(selphidResult?.faceImage) ||
    ocrRows.length > 0;
  const extraDataEnabled =
    filledImage(selphiResult?.bestImageCropped) &&
    (selphidResult?.tokenFaceImage?.trim().length ?? 0) > 0;

  useEffect(() => {
    setDarkMode(Appearance.getColorScheme() === 'dark');
    launchInitSession(setMessage, setTextColorMessage, setShowError);
  }, []);

  const clearStatus = () => {
    setMessage('');
    setShowError(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={[styles.screen, {backgroundColor: colors.screen}]}>
        <View style={styles.appBar}>
          <Text style={[styles.appTitle, {color: colors.onSurface}]}>Onboarding</Text>
          <Pressable
            accessibilityLabel={darkMode ? 'Tema claro' : 'Tema oscuro'}
            onPress={() => setDarkMode(value => !value)}
            style={styles.themeButton}>
            <Text style={[styles.themeIcon, {color: colors.onSurface}]}>
              {darkMode ? '☀' : '☾'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.page}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, {backgroundColor: colors.hero}]}>
            <Text style={styles.heroKicker}>Identidad</Text>
            <Text style={styles.heroTitle}>Verifica en un momento</Text>
            <Text style={styles.heroBody}>Rostro, documento y datos extra, en ese orden.</Text>
          </View>

          {showError && message ? (
            <View style={[styles.banner, {backgroundColor: colors.errorContainer}]}>
              <Text style={[styles.bannerIcon, {color: colors.onErrorContainer}]}>!</Text>
              <Text style={[styles.bannerText, {color: colors.onErrorContainer}]}>{message}</Text>
            </View>
          ) : null}

          <Section
            colors={colors}
            subtitle="Elige el paso que quieres lanzar."
            title="Captura"
          />
          <ActionCard
            colors={colors}
            done={filledImage(selphiResult?.bestImageCropped)}
            icon="☺"
            onLongPress={() => setSelphiConfigOpen(true)}
            onPress={() => {
              clearStatus();
              startSelphi(
                setMessage,
                setTextColorMessage,
                setShowError,
                setSelphiResult,
                selphiConfig,
              );
            }}
            subtitle={'Captura facial y prueba de vida.\n(Long press para configurar)'}
            testID="selphiBtn"
            title="Selphi"
          />
          <ActionCard
            colors={colors}
            done={selphidDone}
            icon="▭"
            onLongPress={() => setSelphidConfigOpen(true)}
            onPress={() => {
              clearStatus();
              setOcrOpen(false);
              startSelphid(
                setMessage,
                setSelphidResult,
                setTextColorMessage,
                setShowError,
                selphidConfig,
              );
            }}
            subtitle={'Anverso, reverso y lectura del documento.\n(Long press para configurar)'}
            title="SelphID"
          />
          <Pressable
            disabled={!extraDataEnabled}
            onPress={() => {
              clearStatus();
              callGetExtraData(setMessage, selphidResult, selphiResult);
            }}
            style={[
              styles.filledButton,
              {backgroundColor: extraDataEnabled ? colors.primary : colors.disabledBg},
            ]}>
            <Text
              style={[
                styles.filledIcon,
                {color: extraDataEnabled ? colors.onPrimary : colors.disabledFg},
              ]}>
              ▤
            </Text>
            <Text
              style={[
                styles.filledLabel,
                {color: extraDataEnabled ? colors.onPrimary : colors.disabledFg},
              ]}>
              Get ExtraData
            </Text>
          </Pressable>
          {!extraDataEnabled ? (
            <Text style={[styles.hint, {color: colors.mutedSoft}]}>
              Se activa al tener rostro y documento.
            </Text>
          ) : null}

          {hasResults ? (
            <>
              <Section
                colors={colors}
                gap
                subtitle="Lo que devolvió la última captura."
                title="Resultados"
              />
              <View style={[styles.surface, {borderColor: colors.outline}]}>
                {filledImage(selphiResult?.bestImageCropped) ? (
                  <ResultImage
                    colors={colors}
                    label="Rostro"
                    portrait
                    uri={imageUri(selphiResult?.bestImageCropped)}
                  />
                ) : null}
                {filledImage(selphidResult?.frontDocumentImage) ? (
                  <ResultImage
                    colors={colors}
                    label="Anverso"
                    uri={imageUri(selphidResult?.frontDocumentImage)}
                  />
                ) : null}
                {filledImage(selphidResult?.backDocumentImage) ? (
                  <ResultImage
                    colors={colors}
                    label="Reverso"
                    uri={imageUri(selphidResult?.backDocumentImage)}
                  />
                ) : null}
                {filledImage(selphidResult?.faceImage) ? (
                  <ResultImage
                    colors={colors}
                    label="Foto"
                    square
                    uri={imageUri(selphidResult?.faceImage)}
                  />
                ) : null}
                {ocrRows.length > 0 ? (
                  <Pressable
                    onPress={() => setOcrOpen(true)}
                    style={[styles.outlineButton, {borderColor: colors.outlineStrong}]}>
                    <Text style={[styles.outlineIcon, {color: colors.primary}]}>☰</Text>
                    <Text style={[styles.outlineLabel, {color: colors.primary}]}>
                      Datos del documento
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </>
          ) : null}

          <Section
            colors={colors}
            gap
            subtitle="La sesión se abre sola al entrar."
            title="Sesión"
          />
          <View style={[styles.surfaceFlush, {borderColor: colors.outline}]}>
            <MenuTile
              colors={colors}
              icon="▶"
              onPress={() => {
                clearStatus();
                launchInitSession(setMessage, setTextColorMessage, setShowError);
              }}
              title="Init Session"
            />
            <View style={[styles.menuDivider, {backgroundColor: colors.divider}]} />
            <MenuTile
              colors={colors}
              icon="⚑"
              onPress={() => {
                clearStatus();
                startInitOperation(
                  setMessage,
                  setTextColorMessage,
                  setShowError,
                  setOperationId,
                );
              }}
              title="Init Operation"
            />
            <View style={[styles.menuDivider, {backgroundColor: colors.divider}]} />
            <MenuTile
              colors={colors}
              danger
              icon="↩"
              onPress={() => {
                clearStatus();
                launchCloseSession(setOperationId, setSelphiResult, setSelphidResult);
              }}
              title="Close Session"
            />
          </View>

          <Section
            colors={colors}
            gap
            subtitle="O lanza un flujo ya configurado."
            title="Flujos"
          />
          <View style={[styles.surfaceFlush, {borderColor: colors.outline}]}>
            <MenuTile
              colors={colors}
              icon="⚡"
              onPress={() => {
                clearStatus();
                launchFlow(setMessage);
              }}
              title="Launch Flow"
            />
          </View>
        </ScrollView>

        <OcrSheet
          colors={colors}
          onClose={() => setOcrOpen(false)}
          rows={ocrRows}
          visible={ocrOpen}
        />
        <SelphiConfigSheet
          colors={colors}
          config={selphiConfig}
          onChange={setSelphiConfig}
          onClose={() => setSelphiConfigOpen(false)}
          visible={selphiConfigOpen}
        />
        <SelphidConfigSheet
          colors={colors}
          config={selphidConfig}
          onChange={setSelphidConfig}
          onClose={() => setSelphidConfigOpen(false)}
          visible={selphidConfigOpen}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
