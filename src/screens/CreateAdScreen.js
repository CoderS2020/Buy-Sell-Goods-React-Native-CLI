import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const CreateAdScreen = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');

  const sendNotification = () => {
    firestore()
      .collection('usertoken')
      .get()
      .then(querySnap => {
        const userDeviceToken = querySnap.docs.map(docSnap => {
          return docSnap.data().token;
        });
        console.log(userDeviceToken);
        fetch('https://ae828c681a8a.ngrok.io/sendNotifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tokens: userDeviceToken,
          }),
        });
      });
  };

  const PostData = async () => {
    try {
      await firestore().collection('ads').add({
        //Since both are same you could have written only once, but for better understanding let it be
        name: name,
        desc: desc,
        year: year,
        price: price,
        phone: phone,
        image: image,
        uid: auth().currentUser.uid,
      });
      Alert.alert('Posted Successfully!!');
      //Now since nodejs index.js file is not hosted so this function wont work in real time
      // sendNotification(); //If it is posted successfully then notifications will be sent
      setName('');
      setDesc('');
      setYear('');
      setPrice('');
      setPhone('');
    } catch (error) {
      Alert.alert('Something went wrong');
    }
  };

  const openCamera = () => {
    launchImageLibrary({quality: 0.5}, fileObj => {
      if (fileObj.didCancel) {
        // console.log(fileObj);
        return;
      }
      // console.log(fileObj.didCancel);

      const uploadTask = storage()
        .ref()
        .child(`/items/${Date.now()}`)
        .putFile(fileObj.assets[0].uri);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) {
            Alert.alert('Uploaded!!');
          }
        },
        error => {
          Alert.alert('Something went wrong, please try again!');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            // console.log('File available at', downloadURL);
            setImage(downloadURL);
          });
        },
      );
      // console.log(fileObj.assets[0]);

      // console.log(fileObj.assets[0].uri);
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.text}>Create Ad</Text>
      <TextInput
        label="Title"
        value={name}
        onChangeText={text => setName(text)}
        mode="outlined"
      />
      <TextInput
        label="Describe what you want to sell"
        value={desc}
        numberOfLines={3}
        multiline={true}
        onChangeText={text => setDesc(text)}
        mode="outlined"
      />
      <TextInput
        label="Year of Purchase"
        value={year}
        keyboardType="numeric"
        numberOfLines={3}
        multiline={true}
        onChangeText={text => setYear(text)}
        mode="outlined"
      />
      <TextInput
        label="Price in INR"
        value={price}
        keyboardType="numeric"
        numberOfLines={3}
        multiline={true}
        onChangeText={text => setPrice(text)}
        mode="outlined"
      />
      <TextInput
        label="Your Contact Number"
        value={phone}
        keyboardType="numeric"
        numberOfLines={3}
        multiline={true}
        onChangeText={text => setPhone(text)}
        mode="outlined"
      />
      <Button icon="camera" mode="contained" onPress={() => openCamera()}>
        Load Image
      </Button>
      <Button mode="contained" onPress={() => PostData()}>
        Post
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
  },
});

export default CreateAdScreen;
