import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';

export default function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    setTodos([...todos, todo]);
    setTodo('');
  };

  const listSeparator = () => {
    return(
      <View style={{ height: 1, backgroundColor: 'blue' }} />
    );
  };

  const clearList = () => {
    setTodos([]);
  };

  return (
    <View style={styles.container}>
      <TextInput 
        value={todo}
        onChangeText={text => setTodo(text)}
        style={{ width: 200, borderColor: 'gray', borderWidth: 1,}}
      />
      <View style={styles.buttons}>
      <Button title='Add' onPress={addTodo} />
      <Button title='Clear' onPress={clearList} />
      </View>
      <Text style={{ fontSize: 20, color: 'blue', fontWeight: 'bold' }}>Shopping List</Text>
      <FlatList 
        data={todos}
        renderItem={({item}) => <Text style={{ fontSize: 20 }}>{item}</Text>}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  buttons: {
    flexDirection: "row",
    margin: 20,
  },
});
