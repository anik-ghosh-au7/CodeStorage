import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Button,
  Platform,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const App = () => {
  const [singleFile, setSingleFile] = useState<any>('');
  const [fileContent, setFileContent] = useState<any>(null);

  const selectOneFile = async () => {
    try {
      const res: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setSingleFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled from single doc picker');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  console.log('res : ' + JSON.stringify(singleFile));
  console.log('URI : ' + singleFile.uri);
  console.log('Type : ' + singleFile.type);
  console.log('File Name : ' + singleFile.name);
  console.log('File Size : ' + singleFile.size);

  if (singleFile.uri) {
    RNFS.readFile(singleFile.uri, 'base64').then(content => {
      setFileContent(singleFile.name + '-' + content);
      // console.log('content ==>> ', content);
    });
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Example of File Picker in React Native
      </Text>
      <View style={styles.container}>
        {/*To show single file attribute*/}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={selectOneFile}>
          {/*Single file selection button*/}
          <Text style={{marginRight: 10, fontSize: 19}}>
            Click here to pick one file
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={styles.imageIconStyle}
          />
        </TouchableOpacity>
        {/*Showing the data of selected Single file*/}
        <Text style={styles.textStyle}>
          File Name: {singleFile.name ? singleFile.name : ''}
          {'\n'}
          Type: {singleFile.type ? singleFile.type : ''}
          {'\n'}
          File Size: {singleFile.size ? singleFile.size : ''}
          {'\n'}
          URI: {singleFile.uri ? singleFile.uri : ''}
          {'\n'}
        </Text>
        <Button
          title="Write"
          onPress={() => {
            const writeData = fileContent.split('-');
            var path: string = '';
            if (Platform.OS === 'ios') {
              path = `${RNFS.DocumentDirectoryPath}/CodeStorage`;
            } else {
              path = `${RNFS.ExternalStorageDirectoryPath}/CodeStorage`;
            }
            RNFS.mkdir(path);
            path += `/${writeData[0]}`;
            RNFS.writeFile(path, writeData[1], 'base64')
              .then(() => {
                console.log('FILE WRITTEN! Path ==>> ', path);
              })
              .catch(err => {
                console.log(err.message);
              });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  imageIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
});
