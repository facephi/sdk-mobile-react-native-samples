import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Text, TouchableHighlight, View } from 'react-native';
import { styles, colors } from '../../styles';

const ActionSheet = (props: any) => {
  const { actionItems, darkMode, setDarkMode } = props;
  const actionSheetItems = [
    ...actionItems,
    {
      id: '#cancel',
      label: 'Close',
      onPress: props?.onCancel
    }
  ]
  console.log(darkMode);
  return (
    <View style={[styles.modalContent]}>
      {
        actionSheetItems.map((actionItem, index) => {
          return (
            <TouchableHighlight
              style={[
                {backgroundColor: darkMode ? "black" : "white"}, styles.actionSheetView,
                index === 0 && {
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                },
                index === actionSheetItems.length - 2 && {
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                },
                index === actionSheetItems.length - 1 && {
                  borderBottomWidth: 0,
                  backgroundColor: darkMode ? "black" : "white",
                  marginTop: 8,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }]}
              underlayColor={'#f7f7f7'}
              key={index} onPress={actionItem.onPress}
            >
                <View style={styles.actionSheetRow}>
                    <Text 
                        style={[
                            { fontWeight: darkMode ? "bold" : "normal" },
                            styles.actionSheetText,
                            props?.actionTextColor && { color: props?.actionTextColor },
                            index === actionSheetItems.length - 1 && { color: colors.actionSheetCancel },
                        ]}>
                        { actionItem.label }
                    </Text>
                    { 
                        actionItem.label == 'Theme Mode' ? 
                        <Switch
                            style={{ marginStart: '5%' }}
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setDarkMode((previousState: boolean) => !previousState)}
                            value={darkMode}
                        /> : null
                    }
                </View>
            </TouchableHighlight>
          )
        })
      }
    </View>
  )
}

ActionSheet.propTypes = {
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      onPress: PropTypes.func
    })
  ).isRequired,
  onCancel: PropTypes.func,
  actionTextColor: PropTypes.string,
  darkMode: PropTypes.bool,
  setDarkMode: PropTypes.func,
}

export default ActionSheet;
