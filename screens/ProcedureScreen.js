import React, { useState } from "react";
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

function ProcedureScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddData = () => {
    // นำทางไปยังหน้า AddProcedureScreen.js
    navigation.navigate("AddProcedure");
  };

  const renderCards = () => {
    // สร้างการ์ดแต่ละใบขึ้นมา
    const cards = [];
    for (let i = 0; i < 10; i++) {
      cards.push(
        <TouchableOpacity
          style={styles.cardContainer}
          key={i}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.card}>
            {/* ข้อมูลในการ์ด */}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20, lineHeight: 30 }}> HN : 0631542</Text>
            <Text style={{marginLeft: 20, lineHeight: 30, opacity: 0.4 }}> อาจารย์ : เทสอาจารย์ เทสอาจารย์</Text>
            <Text style={{marginLeft: 20, lineHeight: 30, opacity: 0.4 }}> ประเภท : Teaching Atteding Round</Text>
            <Text style={{marginLeft: 20, lineHeight: 30, opacity: 0.4 }}> Date : 8 พ.ย 2566</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return cards;
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxCard}>
          <ScrollView>
          {renderCards()}
          </ScrollView>
      </View>
         {/* Modal */}
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.modalView}>
                  <Text style={styles.modalText}>Hello World!</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Hide Modal</Text>
                  </Pressable>
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
    paddingTop: 20, // ปรับระยะห่างด้านบน
  },
  boxCard: {
    backgroundColor: "white",
    height: "80%",
    width: "100%",
    marginLeft: 50,
    marginTop: 50
  },
  cardContainer: {
    width: "80%", // กำหนดความกว้างเท่ากับความกว้างเต็มจอ
    alignItems: "left",
  },
  card: {
    width: 500,
    height: 150,
    marginTop: 20,
    marginBottom: 20, // ปรับระยะห่างระหว่างการ์ด
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
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
});

export default ProcedureScreen;
