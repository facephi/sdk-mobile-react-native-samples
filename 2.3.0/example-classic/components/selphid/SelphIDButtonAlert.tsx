import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';

const SelphIDButtonAlert = (props: any) => 
{
  const { content, darkMode } = props;
  const [modalVisible, setModalVisible] = useState(false);
  
  if (content == null) {
    return null;
  } else {
    const contentJSON = JSON.parse(content);

    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}>
          <View style={styles.centeredView}>
            <View style={[{backgroundColor: darkMode ? "black" : "white"}, styles.modalView]}>
              <FlatList
                ItemSeparatorComponent={renderSeparator}
                data={Object.keys(JSON.parse(content))}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <View>
                    <Text style={[{color: darkMode ? '#FFFFFF' : '#333333'}, styles.keyText]}>{item}</Text>
                    <Text style={styles.valueText}>{contentJSON[item]}</Text>
                  </View>
                )}
              />
              <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.textStyle}>Show OCR Results</Text>
        </TouchableHighlight>
      </View>
    );
  }
};

const renderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',
      }}
    />
  );

};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  modalView: {
    width: '90%',
    height: '95%',
    margin: 20,
    //backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    alignItems: 'center',
    width: '65%',
    padding: 6,
    //marginTop: 16,
    borderRadius: 20,
    borderColor: '#e01985',
    backgroundColor: '#e01985',
  },
  textStyle: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
    color: '#ffffff',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  keyText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 15,
    //color: '#333333',
    alignSelf: 'flex-start',
    paddingTop: 5,
  },
  valueText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 12,
    paddingBottom: 5,
    color: '#777777',
    alignSelf: 'flex-end',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

SelphIDButtonAlert.propTypes = {
  content: PropTypes.any,
  darkMode: PropTypes.bool.isRequired,
}

export default SelphIDButtonAlert;
