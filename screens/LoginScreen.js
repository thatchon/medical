import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../data/firebaseDB';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';
import { setUser, setRole, clearUser } from '../redux/action'; // แก้จาก logoutUser เป็น clearUser และ import จาก action ไม่ใช่ reducers

const LoginScreen = ({ route, navigation }) => {
  const { role } = route.params;
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.user);
  const loggedInRole = useSelector((state) => state.role);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    return () => {
      dispatch(clearUser());
    };
  }, [dispatch]);

  const handleLogin = () => {
    const lowercaseEmail = email.toLowerCase();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userRef = collection(db, 'users');
        getDocs(userRef)
        .then((querySnapshot) => {
          let foundUser = null;
  
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              if (userData.email === lowercaseEmail && userData.role === role) {
                foundUser = userData;
              }
            }
          });
  
          if (foundUser) {
            dispatch(setUser(foundUser));
            dispatch(setRole(role));
            navigation.navigate('Home');
          } else {
            setErrorMessage('บทบาทของผู้ใช้ไม่ตรงกับที่คุณเลือก');
          }
        })
        .catch((error) => {
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
        });
    })
    .catch((error) => {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setErrorMessage('ชื่อผู้ใช้งานหรือรหัสผ่านผิดพลาด');
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
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
      <Text style={{ fontSize: 64, marginBottom: '10%'}}>{roleText}</Text>
      <TextInput
        placeholder="ชื่อผู้ใช้งาน"
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
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
        style={[
          styles.loginButton,
          { backgroundColor: loggedInRole ? '#05AB9F' : 'gray' },
        ]}
        onPress={handleLogin}
        
      >
        <Text style={{ fontSize: 28, color: 'white' }}>Login</Text>
      </TouchableOpacity>
      <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
      <Text
        style={styles.passwordResetLink}
        onPress={() => navigation.navigate('ResetPassword')}
      >
        เปลี่ยนรหัสผ่าน
      </Text>
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
    padding: 15,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 10,
  },
  passwordResetLink: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;