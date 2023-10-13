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
} from "react-native";
import { useSelector } from "react-redux";


function ActivityScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [action, setAction] = useState(null);
  const currentUserUid = useSelector((state) => state.user.uid);
  const role = useSelector((state) => state.role);

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

  const loadActivityData = async () => {
    try {
      const activityCollectionRef = collection(db, "activity");
      const userCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(activityCollectionRef);
      const activities = [];

      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        data.id = docSnapshot.id; // กำหนด id ให้กับข้อมูลของผู้ป่วย

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
          activities.push(displayData);
        }
      }

      setActivityData(activities);
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadActivityData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleCardPress = (activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  const handleAddData = () => {
    navigation.navigate("AddActivity");
  };
  const handleActivityHistory = () => {
    navigation.navigate("ActivityHistory")
  }

  const handleApprove = async () => {
    try {
      const activityDocRef = doc(db, "activity", selectedActivity.id);
      await updateDoc(activityDocRef, {
        status: 'approved'
      });
      setConfirmationModalVisible(false); // ปิด Modal ยืนยัน
      loadActivityData(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error approving activity:", error);
    }
  };

  const handleReject = async () => {
    try {
      const activityDocRef = doc(db, "activity", selectedActivity.id);
      await updateDoc(activityDocRef, {
        status: 'rejected'
      });
      setConfirmationModalVisible(false); // ปิด Modal ยืนยัน
      loadActivityData(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error approving activity:", error);
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
            marginTop: 50,
            marginLeft: 50,
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

  const handleApproveAll = async () => {
    try {
      // ประมวลผลทั้งหมดที่มีสถานะเป็น pending
      const updates = activityData
        .filter((activity) => activity.status === 'pending')
        .map((activity) => updateDoc(doc(db, 'activity', activity.id), { status: 'approved' }));

      // รอให้ทั้งหมดเสร็จสิ้น
      await Promise.all(updates);

      // โหลดข้อมูลใหม่
      loadActivityData();
    } catch (error) {
      console.error("Error approving all activity:", error);
    }
  };

  const renderCards = () => {
    return activityData
      .filter(activity => activity.status === 'pending') // กรองเฉพาะข้อมูลที่มีสถานะเป็น pending
      .map((activity, index) => (
        <TouchableOpacity
          style={styles.cardContainer}
          key={index}
          onPress={() => handleCardPress(activity)}
        >
          <View style={styles.card}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30 }}>
              ประเภท : {activity.activityType} ({activity.status})
            </Text>

            {role === 'student' ? (
                <>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    อาจารย์ : {activity.professorName}
                  </Text>
                  <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                    Date : {formatDateToThai(activity.admissionDate.toDate())}
                  </Text>
                </>
              ) : (
              <>
                <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  นักเรียน : {activity.studentName}
                </Text>
                {/* <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
                  Date : </Text> {formatDateToThai(activity.admissionDate.toDate())} */}

                <View style={styles.buttonsContainer}>
                  {activity.status === 'pending' && <>
                    <TouchableOpacity style={styles.approveButton} onPress={() => {
                      setSelectedActivity(activity);
                      setAction('approve');
                      setConfirmationModalVisible(true);
                    }}>
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => {
                      setSelectedActivity(activity);
                      setAction('reject');
                      setConfirmationModalVisible(true);
                    }}>
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </>}
                </View>
              </>
            )}
            <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
              {activity.status === 'approved' && <Ionicons name="checkmark-circle" size={24} color="green" />}
              {activity.status === 'rejected' && <Ionicons name="close-circle" size={24} color="red" />}
              {/* {activity.status === 'pending' && <MaterialIcons name="pending" size={24} color="black" />} */}
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
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
      >
        <View style={styles.centerView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>ยืนยันการ{action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                action === 'approve' ? handleApprove() : handleReject();
              }}
            >
              <Text style={styles.textStyle}>ยืนยัน</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setConfirmationModalVisible(false)}
            >
              <Text style={styles.textStyle}>ยกเลิก</Text>
            </Pressable>
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centerView}>
          <View style={styles.modalView}>
            {selectedActivity && (
              <>
                {/* <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }} วันที่รับผู้ป่วย :  </Text> {formatDateToThai(selectedActivity.admissionDate.toDate())}
                </Text> */}
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>วันที่รับผู้ป่วย : </Text> {formatDateToThai(selectedActivity.admissionDate.toDate())}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>อาจารย์ผู้รับผิดชอบ : </Text> {selectedActivity.professorName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>ประเภท :</Text> {selectedActivity.activityType || "ไม่มี"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Diagnosis : </Text> {selectedActivity.mainDiagnosis}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Note/Reflection : </Text> {selectedActivity.note || "ไม่มี"}
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
      <View>
        {renderAddDataButton()}

      </View>
      {/* <View>
        <TouchableOpacity
          onPress={handleActivityHistory}
          style={{
            height: 37,
            width: 174,
            marginTop: 20,
            marginLeft: 50,
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
          <Text style={{ fontSize: 22, color: "white" }}>ประวัติ</Text>
        </TouchableOpacity>
      </View> */}
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
    borderRadius: 20,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
    marginTop: 10
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
});

export default ActivityScreen;
