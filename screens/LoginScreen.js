import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { firebase } from '../data/firebaseDB'

const LoginScreen = ({ route, navigation }) => {
  const { role } = route.params; // รับค่า role จาก navigation

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // เข้าสู่ระบบสำเร็จ
        console.log('Login successful');

        // ดึงข้อมูลผู้ใช้จาก Firestore
        firebase.firestore().collection('users')
          .doc(user.uid) // ใช้ uid ของผู้ใช้เป็น Document ID
          .get()
          .then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              if (userData.role === role) {
                navigation.navigate('Home', { user: userData }); // นำผู้ใช้ไปยังหน้า HomeScreen พร้อมส่งข้อมูลผู้ใช้
              } else {
                setErrorMessage('บทบาทของผู้ใช้ไม่ตรงกับที่คุณเลือก');
                console.log('บทบาทของผู้ใช้ไม่ตรงกับที่คุณเลือก');
              }
            } else {
              console.log('ไม่พบข้อมูลผู้ใช้ใน Firestore');
            }
          })
          .catch((error) => {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
          });

        // ทำส่วนอื่น ๆ ที่คุณต้องการหลังจากเข้าสู่ระบบ
      })
      .catch((error) => {
        setErrorMessage('เข้าสู่ระบบไม่สำเร็จ');
        console.error('เข้าสู่ระบบผิดพลาด:', error);
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
        value={email}
        onChangeText={setEmail}
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