import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
      <Text style={styles.titletext}>เลือกหน้าที่ของคุณSDSD</Text>

      <TouchableOpacity
        style={[
          styles.roleButton,
          {
            backgroundColor: selectedRole === 'student' ? 'blue' : 'gray',
          },
        ]}
        onPress={() => handleRoleToggle('student')}
      >
        <Text
          style={[
            styles.roleButtonText,
            {
              color: selectedRole === 'student' ? 'white' : '#0500FF',
            },
          ]}
        >
          นักศึกษาแพทย์
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roleButton,
          {
            backgroundColor: selectedRole === 'teacher' ? 'blue' : 'gray',
          },
        ]}
        onPress={() => handleRoleToggle('teacher')}
      >
        <Text
          style={[
            styles.roleButtonText,
            {
              color: selectedRole === 'teacher' ? 'white' : '#0500FF',
            },
          ]}
        >
          อาจารย์
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roleButton,
          {
            backgroundColor: selectedRole === 'staff' ? 'blue' : 'gray',
          },
        ]}
        onPress={() => handleRoleToggle('staff')}
      >
        <Text
          style={[
            styles.roleButtonText,
            {
              color: selectedRole === 'staff' ? 'white' : '#0500FF',
            },
          ]}
        >
          เจ้าหน้าที่
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor: selectedRole ? '#05AB9F' : 'gray',
          },
        ]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
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
    padding: 20,
  },
  roleButton: {
    height: 80,
    width: 340,
    marginTop: 50,
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 48,
  },
  continueButton: {
    height: 63,
    width: 216,
    marginTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  continueButtonText: {
    fontSize: 28,
    color: 'white',
  },
});

export default SelectRoleScreen;
