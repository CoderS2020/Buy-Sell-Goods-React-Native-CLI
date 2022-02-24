import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userSignup = async () => {
    if (!email || !password) {
      Alert.alert('Please fill all the fields');
      return;
    }

    try {
      const res = await auth().createUserWithEmailAndPassword(email, password);
      messaging()
        .getToken()
        .then(token => {
          firestore().collection('usertoken').add({
            token: token,
          });
        });
    } catch (error) {
      Alert.alert('Something went wrong, please try different credentials');
    }
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.box1}>
        <Image
          style={{width: 200, height: 200}}
          source={require('../../assets/user.png')}
        />
        <Text style={styles.text}>Please Sign Up to continue</Text>
      </View>
      <View style={styles.box2}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          mode="outlined"
        />
        <TextInput
          label="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          mode="outlined"
        />
        <Button mode="contained" onPress={() => userSignup()}>
          Signup
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{textAlign: 'center'}}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  box1: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 35,
    height: '50%',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 22,
  },
});

export default SignupScreen;
