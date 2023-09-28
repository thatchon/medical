import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
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

function OpdScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // State เก็บข้อมูลของการ์ดที่ถูกคลิก

  const loadPatientData = async () => {
    try {
      const patientCollectionRef = collection(db, "patients");
      const querySnapshot = await getDocs(patientCollectionRef);
      const patients = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.patientType === "outpatient") {
          patients.push(data);
        }
      });

      setPatientData(patients);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, []);

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

  const renderCards = () => {
    return patientData.map((patient, index) => (
      <TouchableOpacity
        style={styles.cardContainer}
        key={index}
        onPress={() => handleCardPress(patient)}
      >
        <View style={styles.card}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30 }}>
            HN : {patient.hn}
          </Text>
          <Text style={{ marginLeft: 20, lineHeight: 30, opacity: 0.4 }}>
            อาจารย์ : {patient.professorName}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxCard}>
          <ScrollView>
          {renderCards()}
          </ScrollView>
      </View>
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
            {selectedPatient && (
              <>
                {/* <Text style={styles.modalText}>
                  วันที่รับผู้ป่วย : {selectedPatient.admissionDate.toDateString()}
                </Text> */}
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>อาจารย์ผู้รับผิดชอบ : </Text> {selectedPatient.professorName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>HN :</Text> {selectedPatient.hn || "ไม่มี"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Main Diagnosis : </Text> {selectedPatient.mainDiagnosis}
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
      <View>
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
  }
});

export default OpdScreen;
