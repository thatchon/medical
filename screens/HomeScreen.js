import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ route, navigation }) => {
  const { user } = route.params; // รับข้อมูลผู้ใช้ที่ถูกส่งมาจากหน้า LoginScreen

  return (
    <View style={styles.container}>
      <Text>ยินดีต้อนรับ, {user.displayName}</Text>
      <Text>บทบาท: {user.role}</Text>
      {/* ตัวอย่างการแสดงข้อมูลผู้ใช้ */}
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