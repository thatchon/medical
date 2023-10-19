import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/action'; // เปลี่ยนจาก '../redux/action' เป็น '../redux/action'

const windowWidth = Dimensions.get('window').width;
const isLandscape = windowWidth > Dimensions.get('window').height;
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
      <View style={styles.newBox}>
        <Image
          style={styles.image}
          source={require("../assets/doctor.png")}
          resizeMode={"cover"}
        />
        <Text style={{ fontSize: 30, color: '#00046D', fontWeight: "bold", marginTop: 20 }}>{user.displayName}</Text>
        <Text style={{ fontSize: 30, color: '#00046D' }}>{role === 'student' ? 'นักศึกษาแพทย์' : role === 'teacher' ? 'อาจารย์แพทย์' : role}</Text>
        {role == 'teacher' && (
          <Text style={{ fontSize: 30, color: '#00046D' }}>Department : [{user.department}]</Text>
        )}
    
      </View>
        <View style={styles.bottomBox}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 10
  },
  newBox: {
    width: isLandscape ? '50%' : 652, // ปรับขนาดกล่องในแนวนอน
    height: isLandscape ? '50%' : 704, // ปรับขนาดกล่องในแนวนอน
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    borderRadius: 8
  },
  bottomBox: {
    marginTop: 80,
    alignItems: 'center'
  }
});

export default HomeScreen;