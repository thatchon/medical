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

function ProcedureHistoryScreen() {
    const currentUserUid = useSelector((state) => state.user.uid);
    const currentUserRole = useSelector((state) => state.user.role);
    const [procedureData, setProcedureData] = useState([]);
    const [filterStatus, setFilterStatus] = useState('approved');
    const [selectedProcedure, setSelectedProcedure] = useState(null);
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

    const handleCardPress = (procedure) => {
      setSelectedProcedure(procedure);
      setModalVisible(true);
    };

    const loadHistoryData = async () => {
      try {
        const procedureCollectionRef = collection(db, "procedures");
        const userCollectionRef = collection(db, "users"); 
        const querySnapshot = await getDocs(procedureCollectionRef);
        const procedures = [];
      
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
    
          // ตรวจสอบว่าเป็น professor หรือไม่ และ approvedById ตรงกับ currentUserUid หรือไม่
          const isProfessorRelated =
            currentUserRole === 'teacher' && data.approvedById === currentUserUid;
    
          // ถ้าเป็น student ตรวจสอบ createBy_id หรือถ้าเป็น professor ตรวจสอบ approvedById
          if ((data.createBy_id === currentUserUid || isProfessorRelated) && data.status === filterStatus) {
            procedures.push(displayData);
          }
        }
      
        setProcedureData(procedures);
      } catch (error) {
        console.error("Error fetching procedure data:", error);
      }
    };
  
    useEffect(() => {
      loadHistoryData();
    }, [filterStatus, currentUserUid]);

    const displayLevel = (level) => {
      switch (level) {
        case 1: return 'ทำด้วยตัวเองกับผู้ป่วย';
        case 2: return 'ทำกับหุ่น';
        case 3: return 'ได้ช่วย';
        case 4: return 'ได้ดู';
        default: return 'ไม่ระบุ';
      }
    };
    
    const renderCards = () => {
      return procedureData
      .filter(procedure => procedure.status === filterStatus)
      .map((procedure, index) => (
          <TouchableOpacity
            style={styles.cardContainer}
            key={index}
            onPress={() => handleCardPress(procedure)}
          >
            <View style={styles.card}>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30 }}>
                HN : {procedure.hn} ({procedure.status})
              </Text>
              {currentUserRole === 'student' ? (
                <>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    อาจารย์ : {procedure.approvedByName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    นักเรียน : {procedure.studentName || "-"} {/* ใช้ || "-" เพื่อให้แสดง "-" ถ้าไม่มีข้อมูล */}
                  </Text>
                </>
              )}
              <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                <FontAwesome name="calendar" size={20} color="black" /> {formatDateToThai(procedure.admissionDate.toDate())}
              </Text>

              <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                {procedure.status === 'approved' && <Ionicons name="checkmark-circle" size={36} color="green" />}
                {procedure.status === 'rejected' && <Ionicons name="close-circle" size={36} color="red" />}
                {/* {procedure.status === 'pending' && <MaterialIcons name="pending" size={24} color="black" />} */}
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
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
      }}
    >
      <View style={styles.centerView}>
          <View style={styles.modalView}>
            {selectedProcedure && (
              <>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>วันที่รับผู้ป่วย : </Text> {formatDateToThai(selectedProcedure.admissionDate.toDate())}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>HN :</Text> {selectedProcedure.hn || "ไม่มี"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>อาจารย์ผู้รับผิดชอบ : </Text> {selectedProcedure.approvedByName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>ประเภท : </Text> {selectedProcedure.procedureType}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Level : </Text> {displayLevel(selectedProcedure.procedureLevel)}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>หมายเหตุ : </Text> {selectedProcedure.remarks || "ไม่มี"}
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
      borderRadius: 10,
      margin: 10,
      backgroundColor: "#f7f7f7",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    card: {
      padding: 20,
      borderRadius: 10,
      backgroundColor: "white",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    centerView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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

export default ProcedureHistoryScreen;