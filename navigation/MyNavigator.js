import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SelectRoleScreen from '../screens/SelectRoleScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import IpdScreen from '../screens/IpdScreen';
import OpdScreen from '../screens/OpdScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProcedureScreen from '../screens/ProcedureScreen';
import ReportScreen from '../screens/ReportScreen';
import DownloadScreen from '../screens/DownloadScreen';
import AddIpdScreen from '../screens/AddScreen/AddIpdScreen'; 
import AddOpdScreen from '../screens/AddScreen/AddOpdScreen'; 
import AddActivityScreen from '../screens/AddScreen/AddActivityScreen'; 
import AddProcedureScreen from '../screens/AddScreen/AddProcedureScreen'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// สร้าง Stack Navigator สำหรับหน้า Login และ Home
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="หน้าหลัก" component={HomeScreen} />
      <Tab.Screen name="ผู้ป่วยใน" component={IpdScreen} />
      <Tab.Screen name="ผู้ป่วยนอก" component={OpdScreen} />
      <Tab.Screen name="กิจกรรม" component={ActivityScreen} />
      <Tab.Screen name="หัตถการ" component={ProcedureScreen} />
      <Tab.Screen name="รายงานผล" component={ReportScreen} />
      <Tab.Screen name="ดาวน์โหลด" component={DownloadScreen} />
    </Tab.Navigator>
  );
}

function MyNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectRole">
        <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={MainTabNavigator} />
        <Stack.Screen name="AddIpd" component={AddIpdScreen} />
        <Stack.Screen name="AddOpd" component={AddOpdScreen} />
        <Stack.Screen name="AddActivity" component={AddActivityScreen} />
        <Stack.Screen name="AddProcedure" component={AddProcedureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyNavigator;