import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

const AccountScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDetails = async () => {
    const querySnap = await firestore()
      .collection('ads')
      .where('uid', '==', auth().currentUser.uid)
      .get();
    const result = querySnap.docs.map(docSnap => docSnap.data());

    setItems(result);
  };

  useEffect(() => {
    getDetails();
    return () => {
      console.log(
        'Cleanup code used here becuase we are using async await in useEffect which will give us an error',
      );
    };
  }, []);

  const renderItem = item => {
    return (
      <Card style={styles.container}>
        <Card.Title title={item.name} />
        <Card.Content>
          <Paragraph>Description: {item.desc}</Paragraph>
          <Paragraph>Year of Purchase: {item.year}</Paragraph>
        </Card.Content>
        <Card.Cover source={{uri: item.image}} />
        <Card.Actions>
          <Button>{item.price}</Button>
          <Button onPress={() => openDial(item.phone)}>Call Seller</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: '30%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 22}}>{auth().currentUser.email}</Text>
        <Button mode="contained" onPress={() => auth().signOut()}>
          Log out
        </Button>
        <Text style={{fontSize: 22}}>Your Ads</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.desc}
        renderItem={({item}) => renderItem(item)}
        onRefresh={() => {
          setLoading(true);
          getDetails();
          setLoading(false);
        }}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    elevation: 2,
  },
});

export default AccountScreen;
