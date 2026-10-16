import React from 'react';
import {Modal, Pressable, ScrollView, Switch, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  SdkCompressFormat,
  SdkDocumentSide,
  SdkDocumentType,
  SdkTimeout,
  SelphidConfiguration,
} from '@facephi/sdk-selphid-mbsdr-react-native';
import {styles, type Palette} from '../../App.styles';

const compressFormats = [SdkCompressFormat.JPEG, SdkCompressFormat.PNG];
const timeouts = [
  SdkTimeout.Short,
  SdkTimeout.Medium,
  SdkTimeout.Long,
  SdkTimeout.VeryLong,
];
const documentSides = [SdkDocumentSide.Front, SdkDocumentSide.Back];
const documentTypes = [
  SdkDocumentType.IdCard,
  SdkDocumentType.Passport,
  SdkDocumentType.DriversLicense,
  SdkDocumentType.ForeignCard,
  SdkDocumentType.CreditCard,
  SdkDocumentType.Visa,
  SdkDocumentType.Custom
];
const selectorDocumentTypes = [
  'ID_CARD',
  'PASSPORT',
  'DRIVERS_LICENSE',
  'FOREIGN_CARD',
  'CREDIT_CARD',
  'CUSTOM',
  'VISA',
] as const satisfies ReadonlyArray<
  NonNullable<SelphidConfiguration['enabledDocumentTypes']>[number]
>;

type SelectorDocumentType = (typeof selectorDocumentTypes)[number];

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

const parseCountries = (text: string) => {
  const countries = text
    .toUpperCase()
    .split(/[^A-Z]+/)
    .filter(code => code.length > 0);
  return countries.length > 0 ? countries : undefined;
};

const toggleDocumentType = (
  current: SelphidConfiguration['enabledDocumentTypes'],
  type: SelectorDocumentType,
) => {
  const selected = current ?? [];
  const next = selected.includes(type)
    ? selected.filter(item => item !== type)
    : [...selected, type];
  return next.length > 0 ? next : undefined;
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
  const [countriesText, setCountriesText] = React.useState((config.enabledCountries ?? []).join(', '));

  React.useEffect(() => {
    if (visible) {
      setCountriesText((config.enabledCountries ?? []).join(', '));
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
                onChange({...config, documentSide: nextValue(documentSides, config.documentSide)})
              }
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>documentSide</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>{config.documentSide}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                onChange({
                  ...config,
                  documentType: nextValue(documentTypes, config.documentType),
                })
              }
              style={[styles.sheetRow, styles.configRow, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>documentType</Text>
              <Text style={[styles.configValue, {color: colors.primary}]}>{config.documentType}</Text>
            </Pressable>
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
            <ConfigSwitch
              colors={colors}
              label="encodedDataFocusEnabled"
              onValueChange={value => onChange({...config, encodedDataFocusEnabled: value})}
              value={config.encodedDataFocusEnabled === true}
            />
            <ConfigSwitch
              colors={colors}
              label="showDocumentSelector"
              onValueChange={value => onChange({...config, showDocumentSelector: value})}
              value={config.showDocumentSelector === true}
            />
            <View style={[styles.configBlock, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>enabledCountries</Text>
              <TextInput
                autoCapitalize="characters"
                autoCorrect={false}
                onChangeText={text => {
                  const normalized = text.toUpperCase();
                  setCountriesText(normalized);
                  onChange({...config, enabledCountries: parseCountries(normalized)});
                }}
                placeholder="ES, MX, AR"
                placeholderTextColor={colors.chevron}
                style={[styles.configWideInput, {borderColor: colors.outline, color: colors.onSurface}]}
                value={countriesText}
              />
            </View>
            <View style={[styles.configBlock, rowBorder]}>
              <Text style={[styles.configLabel, {color: colors.onSurface}]}>enabledDocumentTypes</Text>
              <View style={styles.chipRow}>
                {selectorDocumentTypes.map(type => {
                  const selected = config.enabledDocumentTypes?.includes(type) === true;
                  return (
                    <Pressable
                      key={type}
                      onPress={() =>
                        onChange({
                          ...config,
                          enabledDocumentTypes: toggleDocumentType(config.enabledDocumentTypes, type),
                        })
                      }
                      style={[
                        styles.chip,
                        {
                          backgroundColor: selected ? colors.primary : 'transparent',
                          borderColor: selected ? colors.primary : colors.outline,
                        },
                      ]}>
                      <Text style={[styles.chipLabel, {color: selected ? colors.onPrimary : colors.onSurface}]}>
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <ConfigSwitch
              colors={colors}
              label="wizardMode"
              onValueChange={value => onChange({...config, wizardMode: value})}
              value={config.wizardMode === true}
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
