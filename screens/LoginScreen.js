import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { firebase } from '../data/firebaseDB'

const LoginScreen = ({ route }) => {
  const { role } = route.params;
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(userId, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in user:", user);
        // ทำส่วนอื่นๆที่คุณต้องการหลังจากเข้าสู่ระบบ
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };
    let roleText = ''; // ตัวแปรสำหรับเก็บข้อความบทบาท
    if (role === 'student') {
        roleText = 'นักศึกษาแพทย์';
    } else if (role === 'doctor') {
        roleText = 'แพทย์ประจำบ้าน';
    } else if (role === 'teacher') {
        roleText = 'อาจารย์';
    } else if (role === 'staff') {
        roleText = 'เจ้าหน้าที่';
    }
  return (
    <View style={styles.container}>
      <Text>{roleText}</Text>
      <TextInput
        placeholder="ชื่อผู้ใช้งาน"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
      />
      <TextInput
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default LoginScreen;