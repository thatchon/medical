import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../data/firebaseDB';
import { useSelector } from "react-redux";

function HistoryScreen() {
    const currentUserUid = useSelector((state) => state.user.uid);
    const currentUserRole = useSelector((state) => state.user.role);
    const [patientData, setPatientData] = useState([]);
    const [filterStatus, setFilterStatus] = useState('approved');
  
    const loadHistoryData = async () => {
        try {
          const patientCollectionRef = collection(db, "patients");
          const querySnapshot = await getDocs(patientCollectionRef);
          const patients = [];
          for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data();
      
            // ตรวจสอบว่าเป็น professor หรือไม่ และ professorId ตรงกับ currentUserUid หรือไม่
            const isProfessorRelated =
              currentUserRole === 'teacher' && data.professorId === currentUserUid;
      
            // ถ้าเป็น student ตรวจสอบ createBy_id หรือถ้าเป็น professor ตรวจสอบ professorId
            if ((data.createBy_id === currentUserUid || isProfessorRelated) && data.status === filterStatus) {
              data.id = docSnapshot.id;
              patients.push(data);
            }
          }
          setPatientData(patients);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      };
  
    useEffect(() => {
      loadHistoryData();
    }, [filterStatus, currentUserUid]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setFilterStatus('approved')} style={styles.button}>
        <Text style={styles.buttonText}>Approved</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilterStatus('rejected')} style={styles.button}>
        <Text style={styles.buttonText}>Rejected</Text>
      </TouchableOpacity>
      <ScrollView>
        {patientData.map((patient, index) => (
          <View style={styles.card} key={index}>
            <Text style={styles.cardText}>HN: {patient.hn} - {patient.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 20,
    },
    card: {
      backgroundColor: '#f0f0f0',
      padding: 20,
      marginBottom: 10,
      borderRadius: 10,
    },
    cardText: {
      fontSize: 16,
    },
    button: {
      backgroundColor: '#4CAF50',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
  });

export default HistoryScreen;