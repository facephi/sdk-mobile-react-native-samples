import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableHighlight, View } from 'react-native';

const PRIMARY_COLOR = 'rgb(0,98,255)';
const BORDER_COLOR = '#DBDBDB';

const ActionSheet = (props: any) => {
  const { actionItems, darkMode, setDarkMode } = props;
  const actionSheetItems = [
    ...actionItems,
    {
      id: '#cancel',
      label: 'Cancel',
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text 
                        style={[
                            { fontWeight: darkMode ? "bold" : "normal" },
                            styles.actionSheetText,
                            props?.actionTextColor && { color: props?.actionTextColor },
                            index === actionSheetItems.length - 1 && { color: '#fa1616' },
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
                            onValueChange={() => setDarkMode((previousState: any) => !previousState)}
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

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
    width: '95%', // needed for bottom position
    position: 'absolute', // needed for bottom position
    bottom: 0 // needed for bottom position
  },
  actionSheetText: {
    fontSize: 18,
    color: PRIMARY_COLOR
  },
  actionSheetView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_COLOR
  }
});

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

/*
ActionSheet.defaultProps = {
  actionItems: [],
  onCancel: () => { },
  actionTextColor: null,
  darkMode: false,
  setDarkMode: () => { }
}
*/

export default ActionSheet;