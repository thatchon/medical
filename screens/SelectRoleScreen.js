import React, { useState } from 'react';
import { View, Button, StyleSheet,Text } from 'react-native';

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
      <Text>เลือกหน้าที่ของคุณ</Text>
      <Button title="นักศึกษาแพทย์" onPress={() => handleRoleToggle('student')}
        color={selectedRole === 'student' ? 'blue' : 'gray'} />
      <Button title="แพทย์ประจำบ้าน" onPress={() => handleRoleToggle('doctor')}
        color={selectedRole === 'doctor' ? 'blue' : 'gray'} />
      <Button title="อาจารย์" onPress={() => handleRoleToggle('teacher')}
        color={selectedRole === 'teacher' ? 'blue' : 'gray'} />
      <Button title="เจ้าหน้าที่" onPress={() => handleRoleToggle('staff')}
        color={selectedRole === 'staff' ? 'blue' : 'gray'} />
      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedRole} // ปุ่มถูก disable ถ้ายังไม่ได้เลือก Role
      />
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

export default SelectRoleScreen;