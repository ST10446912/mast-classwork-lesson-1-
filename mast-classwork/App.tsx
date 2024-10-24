import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function App() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);

  const storeUser = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and Email are required');
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
    };

    try {
      const storedUsers = await AsyncStorage.getItem('@users');
      const usersArray = storedUsers ? JSON.parse(storedUsers) : [];
      usersArray.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(usersArray));

      setName('');
      setEmail('');
      setUsers(usersArray);
      setUserCount(usersArray.length);
      Alert.alert('Success', 'User has been registered');
    } catch (error) {
      Alert.alert('Error', 'Failed to register user');
    }
  };

  const fetchUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('@users');
      const usersArray = storedUsers ? JSON.parse(storedUsers) : [];
      setUsers(usersArray);
      setUserCount(usersArray.length);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  const clearUsers = async () => {
    try {
      await AsyncStorage.removeItem('@users');
      setUsers([]);
      setUserCount(0);
      Alert.alert('Success', 'All users have been cleared');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear users');
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TouchableHighlight onPress={storeUser} style={styles.button} underlayColor="#2980b9">
        <Text style={styles.buttonText}>Register</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={fetchUsers} style={styles.button} underlayColor="#2980b9">
        <Text style={styles.buttonText}>Display Users</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={clearUsers} style={styles.clearButton} underlayColor="#c0392b">
        <Text style={styles.buttonText}>Clear All Users</Text>
      </TouchableHighlight>
      <Text style={styles.userCount}>Total Users: {userCount}</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: User }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#bdc3c7',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  userCount: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
  },
  userItem: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#bdc3c7',
    borderWidth: 1,
  },
  userText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34495e',
  },
  userEmail: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});
