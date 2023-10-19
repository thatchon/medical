import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../data/firebaseDB';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const windowWidth = Dimensions.get('window').width;
const isLandscape = windowWidth > Dimensions.get('window').height;

function OpdScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [action, setAction] = useState(null); // ตัวแปรสำหรับเก็บว่า user กำลังทำงานอะไร หรือกดปุ่มไหน
  const currentUserUid = useSelector((state) => state.user.uid); // สมมติว่า uid เก็บอยู่ใน userUid ของ state
  const role = useSelector((state) => state.role);

  const [isApproveAllModalVisible, setApproveAllModalVisible] = useState(false);

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
  
  const loadPatientData = async () => {
    try {
      const patientCollectionRef = collection(db, "patients");
      const userCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(patientCollectionRef);
      const patients = [];

      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        data.id = docSnapshot.id; // กำหนด id ให้กับข้อมูลของผู้ป่วย

        if (data.patientType === "outpatient") {
          let studentName = '';
          let displayData = data;

          if (role === 'teacher' && data.createBy_id) {
            const userDocRef = doc(userCollectionRef, data.createBy_id);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              studentName = userData.displayName || '';
              displayData = { ...data, studentName };
            }
          }

          if ((role === 'student' && data.createBy_id === currentUserUid) ||
            (role === 'teacher' && data.professorId === currentUserUid)) {
            patients.push(displayData);
          }
        }
      }

      setPatientData(patients);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadPatientData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleCardPress = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const handleAddData = () => {
    navigation.navigate("AddOpd");
  };


  const handleApprove = async () => {
    try {
      const patientDocRef = doc(db, "patients", selectedPatient.id);
      await updateDoc(patientDocRef, {
        status: 'approved'
      });
      setConfirmationModalVisible(false); // ปิด Modal ยืนยัน
      loadPatientData(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error approving patient:", error);
    }
  };

  const handleReject = async () => {
    try {
      const patientDocRef = doc(db, "patients", selectedPatient.id);
      await updateDoc(patientDocRef, {
        status: 'rejected'
      });
      setConfirmationModalVisible(false); // ปิด Modal ยืนยัน
      loadPatientData(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error rejecting patient:", error);
    }
  };

  const renderAddDataButton = () => {
    if (role == 'student') {
      return (
        <TouchableOpacity
          onPress={handleAddData}
          style={{
            height: 37,
            width: 174,
            marginTop: isLandscape ? 25 : 50,
            marginLeft: isLandscape ? 60 : 50,
            marginBottom: isLandscape ? 25 : 0, 
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#05AB9F",
            borderRadius: 59,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 22, color: "white" }}>เพิ่มข้อมูล</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const handleActualApproveAll = async () => {
    try {
      // ประมวลผลทั้งหมดที่มีสถานะเป็น pending
      const updates = patientData
        .filter((patient) => patient.status === 'pending')
        .map((patient) => updateDoc(doc(db, 'patients', patient.id), { status: 'approved' }));

      // รอให้ทั้งหมดเสร็จสิ้น
      await Promise.all(updates);

      // โหลดข้อมูลใหม่
      loadPatientData();
    } catch (error) {
      console.error("Error approving all patients:", error);
    }
  };

  const handleApproveAll = () => {
    setApproveAllModalVisible(true);
  };

  const renderApprovedButton = () => {
    if (role == 'teacher') {
      return (
        <TouchableOpacity
          onPress={handleApproveAll}
          style={{
            height: 52,
            width: 373,
            marginTop: 50,
            marginLeft: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1C4CA7",
            borderRadius: 59,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 22, color: "white" }}>Approve ทั้งหมด (สำหรับอาจารย์)</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderCards = () => {
    return patientData
      .filter(patient => patient.status === 'pending') 
      .map((patient, index) => (
        <TouchableOpacity
          style={styles.cardContainer}
          key={index}
          onPress={() => handleCardPress(patient)}
        >
          <View style={styles.card}>
            <View style={styles.leftContainer}>
              {role === 'student' ? (
                <>
                  <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30 }}>
                    HN : {patient.hn} ({patient.status})
                  </Text>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    อาจารย์ : {patient.professorName}
                  </Text>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    <FontAwesome name="calendar" size={20} color="black" /> {formatDateToThai(patient.admissionDate.toDate())}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30, marginTop: 20 }}>
                    HN : {patient.hn} ({patient.status})
                  </Text>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    นักเรียน : {patient.studentName}
                  </Text>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    <FontAwesome name="calendar" size={20} color="black" /> {formatDateToThai(patient.admissionDate.toDate())}
                  </Text>
                </>
              )}
            </View>
            {role !== 'student' && (
              <View style={styles.rightContainer}>
                <View style={styles.buttonsContainer}>
                  {patient.status === 'pending' && (
                    <>
                      <TouchableOpacity style={styles.approveButton} onPress={() => {
                        setSelectedPatient(patient);
                        setAction('approve');
                        setConfirmationModalVisible(true);
                      }}>
                        <Text style={styles.buttonText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectButton} onPress={() => {
                        setSelectedPatient(patient);
                        setAction('reject');
                        setConfirmationModalVisible(true);
                      }}>
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
            <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
              {patient.status === 'approved' && <Ionicons name="checkmark-circle" size={24} color="green" />}
              {patient.status === 'rejected' && <Ionicons name="close-circle" size={24} color="red" />}
            </View>
          </View>
        </TouchableOpacity>
      ));
  };

  return (
    <View style={styles.container}>
      {renderApprovedButton()}
      {/* Modal สำหรับยืนยัน Approve/Reject */}
      <Modal
              animationType="fade"
              transparent={true}
              visible={confirmationModalVisible}
          >
              <View style={styles.centerView}>
                  <View style={styles.modalView}>
                  <Text style={styles.modalText}>ยืนยันการ<Text style={{ fontWeight: "bold", fontSize: 20 }}>{action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}</Text></Text>
                      
                      <View style={styles.buttonContainer}>
                          <Pressable
                              style={[styles.recheckModalButton, styles.buttonApprove]}
                              onPress={() => {
                                  action === 'approve' ? handleApprove() : handleReject();
                              }}
                          >
                              <Text style={styles.textStyle}>ยืนยัน</Text>
                          </Pressable>
                          <Pressable
                              style={[styles.recheckModalButton, styles.buttonCancel]}
                              onPress={() => setConfirmationModalVisible(false)}
                          >
                              <Text style={styles.textStyle}>ยกเลิก</Text>
                          </Pressable>
                      </View>
                  </View>
              </View>
          </Modal>

      {/* Modal สำหรับยืนยัน ApproveAll */}
      <Modal
              animationType="fade"
              transparent={true}
              visible={isApproveAllModalVisible}
          >
              <View style={styles.centerView}>
                  <View style={styles.modalView}>
                  <Text style={styles.modalText}>ยืนยันการอนุมัติ<Text style={{ fontWeight: "bold", fontSize: 20 }}>ทั้งหมด?</Text></Text>
                      
                      <View style={styles.buttonContainer}>
                          <Pressable
                              style={[styles.recheckModalButton, styles.buttonApprove]}
                              onPress={() => {
                                handleActualApproveAll();
                                setApproveAllModalVisible(false);
                              }}
                          >
                              <Text style={styles.textStyle}>ยืนยัน</Text>
                          </Pressable>
                          <Pressable
                              style={[styles.recheckModalButton, styles.buttonCancel]}
                              onPress={() => setApproveAllModalVisible(false)}
                          >
                              <Text style={styles.textStyle}>ยกเลิก</Text>
                          </Pressable>
                      </View>
                  </View>
              </View>
          </Modal>

      <View style={styles.boxCard}>
        <ScrollView>
          {renderCards()}
        </ScrollView>
      </View>

      {/*  Modal สำหรับแสดงข้อมูลในการ์ด */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centerView}>
          <View style={styles.modalView}>
            {selectedPatient && (
              <>
                {/* <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }} วันที่รับผู้ป่วย :  </Text> {formatDateToThai(selectedPatient.admissionDate.toDate())}
                </Text> */}
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
                {selectedPatient.pdfUrl && (
                  <Pressable
                    style={[styles.button]}
                    onPress={() => Linking.openURL(selectedPatient.pdfUrl)}
                  >
                    <Text style={styles.textStyle}>ดูไฟล์ PDF</Text>
                  </Pressable>
                )}
              </>
            )}
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>ปิดหน้าต่าง</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View>
        {renderAddDataButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    paddingTop: 20,
  },
  boxCard: {
    backgroundColor: "white",
    height: "80%",
    width: "100%",
    marginLeft: 50,
    marginTop: 50
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
  button: {
    backgroundColor: '#05AB9F',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonApprove: {
    backgroundColor: 'green'
  },
  buttonCancel: {
    backgroundColor: 'red'
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16
  },
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    marginBottom: 20
  },
  approveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 13,
    marginRight: 10
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 13,
  },
  buttonText: {
    color: "white"
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 20,
    height: 20,
  },
  leftContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  recheckModalButton: {
    flex: 1,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5  // เพิ่มระยะห่างระหว่างปุ่ม
  },
  buttonLink: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10
},
});

export default OpdScreen;
