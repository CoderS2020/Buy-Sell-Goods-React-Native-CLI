import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
const ListItemScreen = () => {
  const [loading, setLoading] = useState(false);
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
  const [items, setItems] = useState([]);

  const getDetails = async () => {
    const querySnap = await firestore().collection('ads').get();
    const result = querySnap.docs.map(docSnap => docSnap.data());
    // console.log(result);
    setItems(result);
  };

  const openDial = phone => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`telprompt:${phone}`);
    }
  };

  useEffect(() => {
    getDetails();
    return () => {
      console.log(
        'Cleanup code used here becuase we are using async await in useEffect which will give us an error',
      );
    };
  }, []);

  return (
    <View>
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

export default ListItemScreen;
