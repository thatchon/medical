import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';


const HomeScreen = ({ route, navigation }) => {
  const { user } = route.params ? route.params : {};; // รับข้อมูลผู้ใช้ที่ถูกส่งมาจากหน้า LoginScreen

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 40, color: '#00046D' }}>ยินดีต้อนรับ: {user?.displayName}</Text>
        <Text style={{ fontSize: 40, color: '#00046D' }}>บทบาท: {user?.role}</Text>
      </View>
      {/* <MyTabNavigator /> */}
      <TouchableOpacity
        style={{
          height: 63,
          width: 216,
          marginBottom: 10,
          
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#05AB9F",
          borderRadius: 30,
        }}
      >
        <Text style={{ fontSize: 28, color: 'white' }}>My Portfolio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 63,
          width: 216,
          margintop : "10%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
          borderRadius: 30,
        }}
        onPress={() => navigation.goBack()}

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
});

export default HomeScreen;