import React from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles, type Palette} from '../../App.styles';

type OcrRow = {key: string; value: string};

type OcrSheetProps = {
  colors: Palette;
  onClose: () => void;
  rows: OcrRow[];
  visible: boolean;
};

const OcrSheet = ({colors, onClose, rows, visible}: OcrSheetProps) => 
{
  const insets = useSafeAreaInsets();
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.sheetRoot}>
        <Pressable onPress={onClose} style={styles.sheetBackdrop} />
        <View
          style={[
            styles.sheet,
            {backgroundColor: colors.screen, paddingBottom: Math.max(insets.bottom, 16)},
          ]}>
          <View style={[styles.sheetHandle, {backgroundColor: colors.chevron}]} />
          <Text style={[styles.sheetTitle, {color: colors.onSurface}]}>Datos del documento</Text>
          <ScrollView contentContainerStyle={styles.sheetScroll}>
            {rows.length === 0 ? (
              <Text style={[styles.sheetEmpty, {color: colors.onSurface}]}>No hay datos</Text>
            ) : (
              rows.map(row => (
                <View key={row.key} style={[styles.sheetRow, {borderBottomColor: colors.divider}]}>
                  <Text style={[styles.sheetKey, {color: colors.mutedSoft}]}>{row.key}</Text>
                  <Text style={[styles.sheetValue, {color: colors.onSurface}]}>{row.value}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default OcrSheet;
