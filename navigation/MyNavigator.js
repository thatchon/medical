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
import HistoryScreen from '../screens/HistoryScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


// สร้าง Stack Navigator สำหรับหน้า Login และ Home
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={() => ({
      tabBarStyle: {
        backgroundColor: 'rgba(34,36,40,1)',
      },
    })}>
      <Tab.Screen name="หน้าหลัก" component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name="home-variant" size={24} color={focused ? '#007BFF' : 'white'} />
          ),
        }} />
      <Tab.Screen name="ผู้ป่วยใน" component={IpdScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 name="file-medical" size={24} color={focused ? '#007BFF' : 'white'} />
          ),
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      <Tab.Screen name="ผู้ป่วยนอก" component={OpdScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 name="file-medical-alt" size={24} color={focused ? '#007BFF' : 'white'} />
          ),
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      <Tab.Screen name="หัตถการ" component={ProcedureScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 name="hand-holding-medical" size={24} color={focused ? '#007BFF' : 'white'} />
          ),
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      <Tab.Screen name="กิจกรรม" component={ActivityScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 name="pump-medical" size={24} color={focused ? '#007BFF' : 'white'} />
          ),
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      <Tab.Screen name="รายงานผล" component={ReportScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="document" size={24} color={focused ? '#007BFF' : 'white'} />
          ),
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      <Tab.Screen name="ประวัติ" component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 name="history" size={24} color={focused ? '#007BFF' : 'white'} />
          ),
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      {/* <Tab.Screen name="ดาวน์โหลด" component={DownloadScreen} options={{
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/> */}
    </Tab.Navigator>
  );
}

function MyNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectRole">
        <Stack.Screen name="SelectRole" component={SelectRoleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{
          title: 'เข้าสู่ระบบ',
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="Home" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="AddIpd" component={AddIpdScreen} options={{
          title: 'เพิ่มข้อมูลผู้ป่วยใน',
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="AddOpd" component={AddOpdScreen} options={{
          title: 'เพิ่มข้อมูลผู้ป่วยนอก',
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="AddActivity" component={AddActivityScreen} options={{
          title: 'เพิ่มข้อมูลกิจกรรม',
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="AddProcedure" component={AddProcedureScreen} options={{
          title: 'เพิ่มข้อมูลหัตถการ',
          headerStyle: {
            backgroundColor: '#7274AE',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyNavigator;