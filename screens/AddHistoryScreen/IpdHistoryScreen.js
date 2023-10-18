import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable
} from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../../data/firebaseDB';
import { useSelector } from "react-redux";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

function IpdHistoryScreen() {
    const currentUserUid = useSelector((state) => state.user.uid);
    const currentUserRole = useSelector((state) => state.user.role);
    const [patientData, setPatientData] = useState([]);
    const [filterStatus, setFilterStatus] = useState('approved');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  
    const thaiMonths = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ];
  
    const formatDateToThai = (date) => {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear() + 543; // เปลี่ยนจาก ค.ศ. เป็น พ.ศ.
      return `${day} ${thaiMonths[month]} ${year}`;
    };

    const handleCardPress = (patient) => {
      setSelectedPatient(patient);
      setModalVisible(true);
    };

    const loadHistoryData = async () => {
      try {
        const patientCollectionRef = collection(db, "patients");
        const userCollectionRef = collection(db, "users"); // เพิ่มรายการนี้เพื่ออ้างอิง collection ของผู้ใช้
        const querySnapshot = await getDocs(patientCollectionRef);
        const patients = [];
      
        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          
          let studentName = ''; // ตั้งค่าเริ่มต้นเป็น string ว่าง
    
          if (data.createBy_id) {
            const userDocRef = doc(userCollectionRef, data.createBy_id);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              studentName = userData.displayName || '';
            }
          }
      
          const displayData = { ...data, studentName, id: docSnapshot.id };
    
          // ตรวจสอบว่าเป็น professor หรือไม่ และ professorId ตรงกับ currentUserUid หรือไม่
          const isProfessorRelated =
            currentUserRole === 'teacher' && data.professorId === currentUserUid;
    
          // ถ้าเป็น student ตรวจสอบ createBy_id หรือถ้าเป็น professor ตรวจสอบ professorId
          if ((data.createBy_id === currentUserUid || isProfessorRelated) && data.status === filterStatus && data.patientType === 'inpatient') {
            patients.push(displayData);
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

    
    
    const renderCards = () => {
      return patientData
      .filter(patient => patient.status === filterStatus && patient.patientType === 'inpatient')
      .map((patient, index) => (
          <TouchableOpacity
            style={styles.cardContainer}
            key={index}
            onPress={() => handleCardPress(patient)}
          >
            <View style={styles.card}>

                <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30 }}>
                  HN : {patient.hn} ({patient.status})
                </Text>
                {currentUserRole === 'student' ? (
                  <>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    อาจารย์ : {patient.professorName}
                  </Text>
                  </>
                ) : (
                  <>
                    <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                      นักเรียน : {patient.studentName || "-"} {/* ใช้ || "-" เพื่อให้แสดง "-" ถ้าไม่มีข้อมูล */}
                    </Text>
                  </>
                )}
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  <FontAwesome name="calendar" size={20} color="black" /> {formatDateToThai(patient.admissionDate.toDate())}
                </Text>

                <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                  {patient.status === 'approved' && <Ionicons name="checkmark-circle" size={36} color="green" />}
                  {patient.status === 'rejected' && <Ionicons name="close-circle" size={36} color="red" />}
                  {/* {patient.status === 'pending' && <MaterialIcons name="pending" size={24} color="black" />} */}
                </View>
            </View>
          </TouchableOpacity>
        ));
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setFilterStatus('approved')} style={styles.buttonApproved}>
          <Text style={styles.buttonText}>Approved</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterStatus('rejected')} style={styles.buttonRejected}>
          <Text style={styles.buttonText}>Rejected</Text>
        </TouchableOpacity>
        <ScrollView>
          {renderCards()}
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
      }}
    >
      <View style={styles.centerView}>
          <View style={styles.modalView}>
            {selectedPatient && (
              <>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>วันที่รับผู้ป่วย : </Text> {formatDateToThai(selectedPatient.admissionDate.toDate())}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>อาจารย์ผู้รับผิดชอบ : </Text> {selectedPatient.professorName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>HN :</Text> {selectedPatient.hn || "ไม่มี"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Main Diagnosis : </Text> 
                  {selectedPatient.mainDiagnosis.map(diagnosis => diagnosis.value).join(', ')}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Co - Morbid Diseases : </Text> {selectedPatient.coMorbid || "ไม่มี"}
                  </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Note/Reflection : </Text> {selectedPatient.note || "ไม่มี"}
                  </Text>
              </>
            )}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>ปิดหน้าต่าง</Text>
            </Pressable>
          </View>
        </View>
    </Modal>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 20,
    },
    textStyle: {
      color: 'white'
    },
    button: {
      backgroundColor: '#05AB9F',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
    buttonApproved: {
      backgroundColor: '#4CAF50',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
    buttonRejected: {
      backgroundColor: 'red',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
    cardContainer: {
      width: "80%",
      alignItems: "left",
    },
    card: {
      width: 500,
      height: 150,
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 10,
      borderRadius: 8,
      backgroundColor: "white",
      alignItems: "left",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    cardText: {
      fontSize: 16,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    centerView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    modalView: {
      width: 400,
      height: 400,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

export default IpdHistoryScreen;