import React from 'react';
import {Modal, Pressable, ScrollView, Switch, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  SelphiCamera,
  SdkCompressFormat,
  SelphiConfiguration,
  SdkLivenessMode,
} from '@facephi/sdk-selphi-iad-react-native';
import {styles, type Palette} from '../../App.styles';

const livenessModes = [
  SdkLivenessMode.None,
  SdkLivenessMode.PassiveMode,
  SdkLivenessMode.Move
];

const compressFormats = [SdkCompressFormat.JPEG, SdkCompressFormat.PNG];
const cameras = [SelphiCamera.FRONT, SelphiCamera.BACK];

type SelphiConfigSheetProps = {
  colors: Palette;
  config: SelphiConfiguration;
  onChange: (config: SelphiConfiguration) => void;
  onClose: () => void;
  visible: boolean;
};

const nextValue = <T,>(values: T[], current: T | undefined) => {
  const index = values.indexOf(current as T);
  return values[(index + 1) % values.length];
};

const clampJpgQuality = (value: number) =>
  Math.round(Math.min(1, Math.max(0.1, value)) * 100) / 100;

const SelphiConfigSheet = ({
  colors,
  config,
  onChange,
  onClose,
  visible,
}: SelphiConfigSheetProps) => {
  const insets = useSafeAreaInsets();
  const rowBorder = {borderBottomColor: colors.divider};
  const [jpgQualityText, setJpgQualityText] = React.useState(String(config.jpgQuality ?? ''));

  React.useEffect(() => {
    if (visible) {
      setJpgQualityText(String(config.jpgQuality ?? ''));
    }
    // Solo al abrir: mientras se escribe, el texto local manda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.sheetRoot}>
        <Pressable onPress={onClose} style={styles.sheetBackdrop} />
        <View
          style={[
            styles.sheet,
            styles.sheetTall,
            {backgroundColor: colors.screen, paddingBottom: Math.max(insets.bottom, 16)},
          ]}>
          <View style={[styles.sheetHandle, {backgroundColor: colors.chevron}]} />
          <Text style={[styles.sheetTitle, {color: colors.onSurface}]}>Selphi</Text>
          <ScrollView contentContainerStyle={styles.sheetScroll} keyboardShouldPersistTaps="handled">
            <Pressable
              onPress={() =>
                onChange({...config, livenessMode: nextValue(livenessModes, config.livenessMode)})
              }
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>livenessMode</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>{config.livenessMode}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                onChange({
                  ...config,
                  compressFormat: nextValue(compressFormats, config.compressFormat),
                })
              }
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>compressFormat</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>{config.compressFormat}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                onChange({
                  ...config,
                  cameraPreferred: nextValue(cameras, config.cameraPreferred),
                })
              }
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>cameraPreferred</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>{config.cameraPreferred}</Text>
            </Pressable>
            <View style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>jpgQuality</Text>
              <TextInput
                keyboardType="decimal-pad"
                maxLength={4}
                onChangeText={text => {
                  const normalized = text.replace(',', '.').replace(/[^0-9.]/g, '');
                  const singleDot = normalized.replace(/^(\d*\.?\d*).*$/, '$1');
                  setJpgQualityText(singleDot);
                  const value = Number(singleDot);
                  if (singleDot !== '' && !singleDot.endsWith('.') && value >= 0.1 && value <= 1) {
                    onChange({...config, jpgQuality: value});
                  }
                }}
                onEndEditing={() => {
                  const value = Number(jpgQualityText);
                  if (!jpgQualityText || Number.isNaN(value)) {
                    setJpgQualityText(String(config.jpgQuality ?? ''));
                    return;
                  }
                  const clamped = clampJpgQuality(value);
                  setJpgQualityText(String(clamped));
                  onChange({...config, jpgQuality: clamped});
                }}
                style={[styles.configInput, {borderColor: colors.outline, color: colors.onSurface}]}
                value={jpgQualityText}
              />
            </View>
            <ConfigSwitch
              colors={colors}
              label="enableGenerateTemplateRaw"
              onValueChange={value => onChange({...config, enableGenerateTemplateRaw: value})}
              value={config.enableGenerateTemplateRaw === true}
            />
            <ConfigSwitch
              colors={colors}
              label="showResultAfterCapture"
              onValueChange={value => onChange({...config, showResultAfterCapture: value})}
              value={config.showResultAfterCapture === true}
            />
            <ConfigSwitch
              colors={colors}
              label="showDiagnostic"
              onValueChange={value => onChange({...config, showDiagnostic: value})}
              value={config.showDiagnostic === true}
            />
            <ConfigSwitch
              colors={colors}
              label="showTutorial"
              onValueChange={value => onChange({...config, showTutorial: value})}
              value={config.showTutorial === true}
            />
            <ConfigSwitch
              colors={colors}
              label="showPreviousTip"
              onValueChange={value => onChange({...config, showPreviousTip: value})}
              value={config.showPreviousTip === true}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const ConfigSwitch = ({
  colors,
  label,
  onValueChange,
  value,
}: {
  colors: Palette;
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) => (
  <View style={[styles.sheetRow, styles.configRow, {borderBottomColor: colors.divider}]}>
    <Text style={[styles.configLabel, {color: colors.onSurface}]}>{label}</Text>
    <Switch
      onValueChange={onValueChange}
      thumbColor={colors.onPrimary}
      trackColor={{false: colors.outline, true: colors.primary}}
      value={value}
    />
  </View>
);

export default SelphiConfigSheet;
