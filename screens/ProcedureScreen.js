import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
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
  Image,
  Linking,
  Dimensions
} from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

const windowWidth = Dimensions.get('window').width;
const isLandscape = windowWidth > Dimensions.get('window').height;

function ProcedureScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [procedureData, setProcedureData] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [action, setAction] = useState(null); // ตัวแปรสำหรับเก็บว่า user กำลังทำงานอะไร หรือกดปุ่มไหน
  const currentUserUid = useSelector((state) => state.user.uid); // สมมติว่า uid เก็บอยู่ใน userUid ของ state
  const role = useSelector((state) => state.role);

  const [imageModalVisible, setImageModalVisible] = useState(false);

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

  const viewImages = () => {
    setImageModalVisible(true);
  }

  const loadProcedureData = async () => {
    try {
      const procedureCollectionRef = collection(db, "procedures");
      const userCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(procedureCollectionRef);
      const procedures = [];

      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        data.id = docSnapshot.id; // กำหนด id ให้กับข้อมูลของผู้ป่วย

        // if (data.procedureType === "inprocedure") {
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
          (role === 'teacher' && data.approvedById === currentUserUid)) {
          procedures.push(displayData);
        }
      }
      // }

      setProcedureData(procedures);
    } catch (error) {
      console.error("Error fetching procedure data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProcedureData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleCardPress = (procedure) => {
    setSelectedProcedure(procedure);
    setModalVisible(true);
  };

  const handleAddData = () => {
    navigation.navigate("AddProcedure");
  };

  const handleApprove = async () => {
    try {
      const procedureDocRef = doc(db, "procedures", selectedProcedure.id);
      await updateDoc(procedureDocRef, {
        status: 'approved'
      });
      setConfirmationModalVisible(false); // ปิด Modal ยืนยัน
      loadProcedureData(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error approving procedure:", error);
    }
  };

  const handleReject = async () => {
    try {
      const procedureDocRef = doc(db, "procedures", selectedProcedure.id);
      await updateDoc(procedureDocRef, {
        status: 'rejected'
      });
      setConfirmationModalVisible(false); // ปิด Modal ยืนยัน
      loadProcedureData(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error rejecting procedure:", error);
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
      const updates = procedureData
        .filter((procedure) => procedure.status === 'pending')
        .map((procedure) => updateDoc(doc(db, 'procedures', procedure.id), { status: 'approved' }));

      // รอให้ทั้งหมดเสร็จสิ้น
      await Promise.all(updates);

      // โหลดข้อมูลใหม่
      loadProcedureData();
    } catch (error) {
      console.error("Error approving all procedures:", error);
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
      .filter(procedure => procedure.status === 'pending') // กรองเฉพาะข้อมูลที่มีสถานะเป็น pending
      .map((procedure, index) => (
        <TouchableOpacity
          style={styles.cardContainer}
          key={index}
          onPress={() => handleCardPress(procedure)}
        >
          <View style={styles.card}>
            <View style={styles.leftContainer}>
            {role === 'student' ? (
              <>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30 }}>
                  HN : {procedure.hn} ({procedure.status})
                </Text>
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  อาจารย์ : {procedure.approvedByName}
                </Text>
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  ประเภท : {procedure.procedureType}
                </Text>
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  <FontAwesome name="calendar" size={20} color="black" /> {formatDateToThai(procedure.admissionDate.toDate())}
                </Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30, marginTop: 30 }}>
                  HN : {procedure.hn} ({procedure.status})
                </Text>
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  นักเรียน : {procedure.studentName}
                </Text>
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  ประเภท : {procedure.procedureType}
                </Text>
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  <FontAwesome name="calendar" size={20} color="black" /> {formatDateToThai(procedure.admissionDate.toDate())}
                </Text>
                </>
            )}
            </View>
            {role !== 'student' && (
              <View style={styles.rightContainer}>
                <View style={styles.buttonsContainer}>
                  {procedure.status === 'pending' && (
                  <>
                    <TouchableOpacity style={styles.approveButton} onPress={() => {
                      setSelectedProcedure(procedure);
                      setAction('approve');
                      setConfirmationModalVisible(true);
                    }}>
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => {
                      setSelectedProcedure(procedure);
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
            {selectedProcedure && (
              <>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>วันที่รับผู้ป่วย : </Text> {formatDateToThai(selectedProcedure.admissionDate.toDate())}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>ประเภท : </Text> {selectedProcedure.procedureType}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>อาจารย์ผู้รับผิดชอบ : </Text> {selectedProcedure.approvedByName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>HN :</Text> {selectedProcedure.hn || "ไม่มี"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Level : </Text> {displayLevel(selectedProcedure.procedureLevel)}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>หมายเหตุ : </Text> {selectedProcedure.remarks || "ไม่มี"}
                </Text>
                {selectedProcedure.images && selectedProcedure.images.length > 0 && (
                  <Pressable
                    onPress={viewImages}
                    style={[styles.button, styles.buttonViewImages]}
                  >
                    <Text style={styles.textStyle}>ดูรูปภาพ</Text>
                  </Pressable>
                )}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={imageModalVisible}
                  onRequestClose={() => {
                    Alert.alert("Image viewer has been closed.");
                    setImageModalVisible(!imageModalVisible);
                  }}
                >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: '70%', height: '70%', backgroundColor: 'white', borderRadius: 10 }}>
                      <ScrollView>
                        {selectedProcedure?.images && selectedProcedure.images.map((imageUrl, index) => {
                          return (
                            <View key={index} style={{ marginBottom: 10, borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5 }}>
                              <Image
                                source={{ uri: imageUrl }}
                                style={{ width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 }}
                              />
                              <Pressable
                                style={{ backgroundColor: '#2196F3', padding: 5, borderRadius: 5, marginTop: 5 }}
                                onPress={() => Linking.openURL(imageUrl)} // เปิด URL ในเบราว์เซอร์เริ่มต้น
                              >
                                <Text style={{ color: 'white', textAlign: 'center' }}>ดูลิ้งค์รูปภาพ</Text>
                              </Pressable>
                            </View>
                          );
                        })}
                      </ScrollView>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setImageModalVisible(!imageModalVisible)}
                      >
                        <Text style={styles.textStyle}>ปิดหน้าต่าง</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>

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
  recheckModalButton: {
    flex: 1,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5  // เพิ่มระยะห่างระหว่างปุ่ม
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
    marginRight: 5
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
  modalImageView: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: '90%',
    maxHeight: '80%'
  },
  buttonViewImages: {
    backgroundColor: "blue", // สีที่คุณต้องการ
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },
  buttonClose: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    alignSelf: 'center',
    margin: 10
  }
});

export default ProcedureScreen;
