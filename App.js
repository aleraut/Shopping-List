import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { db } from './dbconfig';

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

  const clearList = () => {
    setTodos([]);
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='Product'
        value={product}
        onChangeText={product => setProduct(product)}
        style={{ marginTop: 30, width: 200, borderColor: 'gray', borderWidth: 1,}}
      />
      <TextInput 
        placeholder='Amount'
        value={amount}
        onChangeText={amount => setAmount(amount)}
        style={{ marginTop: 5 ,marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1,}}
      />
      <Button title='Save' onPress={saveItem} />
      <Text style={{ fontSize: 20, color: 'blue', marginTop: 30 }}>Shopping List</Text>
      <FlatList 
        style={{marginLeft: "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
        <View style={styles.listcontainer}>
          <Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
          <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}>Done</Text>
        </View>}
        data={items}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
   },
   listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
