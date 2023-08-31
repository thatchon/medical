import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import IpdScreen from '../screens/IpdScreen';
import OpdScreen from '../screens/OpdScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProcedureScreen from '../screens/ProcedureScreen';
import ReportScreen from '../screens/ReportScreen';
import DownloadScreen from '../screens/DownloadScreen';

const Tab = createBottomTabNavigator();

function MyTabNavigator({ route }) {
    // const { user } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen name="หน้าหลัก" component={HomeScreen}  />
      <Tab.Screen name="ผู้ป่วยใน" component={IpdScreen} />
      <Tab.Screen name="ผู้ป่วยนอก" component={OpdScreen} />
      <Tab.Screen name="กิจกรรม" component={ActivityScreen} />
      <Tab.Screen name="หัตถการ" component={ProcedureScreen} />
      <Tab.Screen name="รายงานผล" component={ReportScreen} />
      <Tab.Screen name="ดาวน์โหลด" component={DownloadScreen} />
    </Tab.Navigator>
  );
}

export default MyTabNavigator;