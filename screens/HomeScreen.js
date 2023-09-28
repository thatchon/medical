import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/action'; // เปลี่ยนจาก '../redux/action' เป็น '../redux/action'

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role);
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    // ใช้ dispatch เรียก action ที่คุณสร้างขึ้นเพื่อลบข้อมูลผู้ใช้และบทบาท
    dispatch(clearUser()); // ใช้ clearUser จาก '../redux/action'
    // ส่งผู้ใช้กลับไปหน้า SelectRole หรือหน้าที่คุณต้องการหลังจาก Logout
    navigation.navigate('SelectRole'); // แทน 'SelectRole' ด้วยชื่อหน้าที่คุณต้องการ
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 40, color: '#00046D' }}>ยินดีต้อนรับ: {user?.displayName}</Text>
        <Text style={{ fontSize: 40, color: '#00046D' }}>บทบาท: {role}</Text>
      </View>
      {role !== 'teacher' && (
        <TouchableOpacity
          style={styles.portfolioButton}
          onPress={() => navigation.navigate('Portfolio')}
        >
          <Text style={{ fontSize: 28, color: 'white' }}>My Portfolio</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={{ fontSize: 28, color: 'white' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioButton: {
    height: 63,
    width: 216,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05AB9F',
    borderRadius: 30,
  },
  logoutButton: {
    height: 63,
    width: 216,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 30,
  },
});

export default HomeScreen;