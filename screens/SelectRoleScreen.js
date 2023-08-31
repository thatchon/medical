import React, { useState } from 'react';
import { View, Button, StyleSheet,Text, TouchableOpacity } from 'react-native';

const SelectRoleScreen = ({ navigation }) => {
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleToggle = (role) => {
        if (selectedRole === role) {
          setSelectedRole(null);
        } else {
          setSelectedRole(role);
        }
      };
    
      const handleContinue = () => {
        if (selectedRole) {
          navigation.navigate('Login', { role: selectedRole });
        }
      };
  return (
    <View style={styles.container}>

    <Text style={styles.titletext}>เลือกหน้าที่ของคุณ</Text>

    {/* <View style={styles.buttonStyle}>
      <Button
        title="นักศึกษาแพทย์"
        onPress={() => handleRoleToggle('student')}
        color={selectedRole === 'student' ? 'blue' : 'gray'}
        style={styles.button}
      />
    </View>
    <View style={styles.buttonStyle}>
      <Button
        title="อาจารย์"
        onPress={() => handleRoleToggle('teacher')}
        color={selectedRole === 'teacher' ? 'blue' : 'gray'} />
    </View>
    <View style={styles.buttonStyle}>
      <Button
        title="เจ้าหน้าที่"
        onPress={() => handleRoleToggle('staff')}
        color={selectedRole === 'staff' ? 'blue' : 'gray'} />
    </View>
    <View style={styles.buttonStyle}>
      <Button
        style={{ height: '85px', marginTop: 20, width: '340px' }}
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedRole} // ปุ่มถูก disable ถ้ายังไม่ได้เลือก Role
      />
    </View> */}
    <TouchableOpacity
      style={{
        height: 80,
        width: 340,
        marginTop: "10%",
        borderRadius: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gray"
      }}
      onPress={() => handleRoleToggle('student')}
      color={selectedRole === 'student' ? 'blue' : 'gray'}
    >
      <Text style={{ fontSize: 40, color: '#00046D' }}>นักศึกษาแพทย์</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        height: 80,
        width: 340,
        marginTop: "10%",
        borderRadius: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gray"
      }}
      onPress={() => handleRoleToggle('teacher')}
      color={selectedRole === 'teacher' ? 'blue' : 'gray'}
    >
      <Text style={{ fontSize: 40, color: '#00046D' }}>อาจารย์</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        height: 80,
        width: 340,
        marginTop: "10%",
        borderRadius: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gray"
      }}
      onPress={() => handleRoleToggle('staff')}
      color={selectedRole === 'staff' ? 'blue' : 'gray'}
    >
      <Text style={{ fontSize: 40, color: '#00046D' }}>เจ้าหน้าที่</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        height: 63,
        width: 216,
        marginTop: "10%",

        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#05AB9F",
        borderRadius: 30,
      }}
      onPress={handleContinue}
      disabled={!selectedRole}
    >
      <Text style={{ fontSize: 28, color: 'white' }}>Continue</Text>
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
  titletext: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 52,
    padding: '20px',
  },
  buttonStyle: {
    marginTop: 50,
    width: 340, // this way it works
  },
  button: {
    height: 80,
  },
  ConButton: {
    width: '340px'
  }
});

export default SelectRoleScreen;