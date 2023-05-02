import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { db } from './dbconfig';
import { Header, Input, Button, Icon, ListItem } from '@rneui/themed';

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Create shopping items table
    db.transaction(tx => {
    tx.executeSql('create table if not exists items (id integer primary key not null, amount text, product text);');
    }, null, updateList);
    }, []);
    

  /* const addTodo = () => {
    setTodos([...todos, todo]);
    setTodo('');
  }; */

  // Save product
  const saveItem = () => {
    if (amount && product) {
      db.transaction(tx => {
        tx.executeSql('insert into items (amount, product) values (?, ?);', [amount, product]);
      }, null, updateList)
    }
    else {
      Alert.alert("Warning", "Type amount and product first")
    }
  }

  // Update shopping list
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from items', [], (_, { rows }) => {
        setItems(rows._array);
        setAmount('');
        setProduct('');
      });
    });
  }

  // Delete item
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from items where id = ?;', [id]);
      }, null, updateList);
  }

  const listSeparator = () => {
    return(
      <View style={{ height: 5, backgroundColor: "#fff", width: "80%", marginLeft: "10%" }} />
    );
  };

  /*const clearList = () => {
    setTodos([]);
  }; */

  return (
    <View style={styles.container}>
      <Header 
        centerComponent={{ text: 'MY PRODUCTS', style:{ fontSize: 16, color: 'white' }}}
      />
      <Input 
        placeholder='Product'
        value={product}
        onChangeText={product => setProduct(product)}
      />
      <Input 
        placeholder='Amount'
        value={amount}
        onChangeText={amount => setAmount(amount)}
      />
      <Button onPress={saveItem}>
        SAVE
        <Icon name="check" color="white" style={{marginLeft: 10}} />
      </Button>
      <FlatList 
        style={{marginLeft: "2%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <ListItem.Swipeable
            rightContent={(action) => (
              <Button
                containerStyle={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: '#f4f4f4',
                }}
                type="clear"
                icon={{ name: 'delete-outline' }}
                onPress={() => deleteItem(item.id)}
              />
            )}
          >
            <ListItem.Content>
              <ListItem.Title>{item.product}</ListItem.Title>
              <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem.Swipeable>
        }
        data={items}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
   },
   listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
