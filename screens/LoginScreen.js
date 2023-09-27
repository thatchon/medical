import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser, setRole } from '../redux/action'; // ปรับแต่ง action import
import { auth, db } from '../data/firebaseDB';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

const LoginScreen = ({ route, navigation }) => {
  const { role } = route.params;
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // เข้าสู่ระบบสำเร็จ
        console.log('Login successful');

        // ดึงข้อมูลผู้ใช้จาก Firestore
        const userRef = collection(db, 'users');
        getDocs(userRef)
          .then((querySnapshot) => {
            let foundUser = null;

            querySnapshot.forEach((doc) => {
              if (doc.exists()) {
                const userData = doc.data();
                if (userData.role === role) {
                  foundUser = userData;
                }
              }
            });

            if (foundUser) {
              // กำหนดข้อมูลผู้ใช้และบทบาทผ่าน Redux
              dispatch(setUser(foundUser));
              dispatch(setRole(role)); // ปรับแต่งบทบาทใหม่เมื่อ Login

              // นำผู้ใช้ไปยังหน้า HomeScreen
              navigation.navigate('Home');
            } else {
              setErrorMessage('บทบาทของผู้ใช้ไม่ตรงกับที่คุณเลือก');
              console.log('บทบาทของผู้ใช้ไม่ตรงกับที่คุณเลือก');
            }
          })
          .catch((error) => {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
          });
      })
      .catch((error) => {
        setErrorMessage('เข้าสู่ระบบไม่สำเร็จ');
        console.error('เข้าสู่ระบบผิดพลาด:', error);
      });
  };

  let roleText = '';
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
      <Text style={{ fontSize: 64, marginBottom: '10%' }}>{roleText}</Text>
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
      <TouchableOpacity
        style={{
          height: 63,
          width: 216,
          marginTop: '10%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#05AB9F',
          borderRadius: 30,
        }}
        onPress={handleLogin}
      >
        <Text style={{ fontSize: 28, color: 'white' }}>Login</Text>
      </TouchableOpacity>
      <Text style={{ color: 'red', marginTop: '5%' }}>{errorMessage}</Text>
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
    height: '5%',
    marginVertical: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
  },
});

export default LoginScreen;