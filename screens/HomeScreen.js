import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MyTabNavigator from '../navigation/MyTabNavigator';

const HomeScreen = ({ route, navigation }) => {
  const { user } = route.params ? route.params : {};; // รับข้อมูลผู้ใช้ที่ถูกส่งมาจากหน้า LoginScreen

  return (
    <View style={styles.container}>
      <Text>ยินดีต้อนรับ, {user?.displayName}</Text>
      <Text>บทบาท: {user?.role}</Text>
      {/* <MyTabNavigator /> */}
      <Button title="Logout" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;