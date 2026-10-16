import React from 'react';
import {Modal, Pressable, ScrollView, Switch, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  SelphIDCaptureMode,
  SelphIDCompressFormat,
  SelphIDDocumentType,
  SelphIDTimeout,
  SelphidConfiguration,
} from '@facephi/sdk-selphid-react-native';
import {styles, type Palette} from '../../App.styles';

const compressFormats = [SelphIDCompressFormat.jpeg, SelphIDCompressFormat.png];
const timeouts = [
  SelphIDTimeout.Short,
  SelphIDTimeout.Medium,
  SelphIDTimeout.Long,
  SelphIDTimeout.VeryLong,
];
const captureModes = [SelphIDCaptureMode.Front, SelphIDCaptureMode.Standard, SelphIDCaptureMode.Mrz];
const documentTypes = [
  SelphIDDocumentType.IdCard,
  SelphIDDocumentType.Passport,
  SelphIDDocumentType.DriversLicense,
  SelphIDDocumentType.ForeignCard,
  SelphIDDocumentType.CreditCard,
  SelphIDDocumentType.Visa,
  SelphIDDocumentType.Custom,
  SelphIDDocumentType.All,
];

type SelphidConfigSheetProps = {
  colors: Palette;
  config: SelphidConfiguration;
  onChange: (config: SelphidConfiguration) => void;
  onClose: () => void;
  visible: boolean;
};

const nextValue = <T,>(values: T[], current: T | undefined) => {
  const index = values.indexOf(current as T);
  return values[(index + 1) % values.length];
};

const SelphidConfigSheet = ({
  colors,
  config,
  onChange,
  onClose,
  visible,
}: SelphidConfigSheetProps) => {
  const insets = useSafeAreaInsets();
  const rowBorder = {borderBottomColor: colors.divider};

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
          <Text style={[styles.sheetTitle, {color: colors.onSurface}]}>SelphID</Text>
          <ScrollView contentContainerStyle={styles.sheetScroll} keyboardShouldPersistTaps="handled">
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
            <View style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>jpgQuality</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={3}
                onChangeText={text => {
                  const digits = text.replace(/[^0-9]/g, '');
                  if (!digits) {
                    return;
                  }
                  onChange({...config, jpgQuality: Math.min(100, Math.max(1, Number(digits)))});
                }}
                style={[styles.configInput, {borderColor: colors.outline, color: colors.onSurface}]}
                value={String(config.jpgQuality ?? '')}
              />
            </View>
            <Pressable
              onPress={() => onChange({...config, timeout: nextValue(timeouts, config.timeout)})}
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>timeout</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>{config.timeout}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                onChange({...config, captureMode: nextValue(captureModes, config.captureMode)})
              }
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>captureMode</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>{config.captureMode}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                onChange({
                  ...config,
                  defaultDocumentType: nextValue(documentTypes, config.defaultDocumentType),
                })
              }
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>defaultDocumentType</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>
                {config.defaultDocumentType}
              </Text>
            </Pressable>
            <View style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>defaultCountry</Text>
              <TextInput
                autoCapitalize="characters"
                maxLength={3}
                onChangeText={text => {
                  const country = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
                  onChange({...config, defaultCountry: country || undefined});
                }}
                style={[styles.configInput, {borderColor: colors.outline, color: colors.onSurface}]}
                value={config.defaultCountry ?? ''}
              />
            </View>
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

export default SelphidConfigSheet;
