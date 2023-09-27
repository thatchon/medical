import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter';
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import MyNavigator from "./navigation/MyNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <MyNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
