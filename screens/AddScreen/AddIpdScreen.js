import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db, auth } from '../../data/firebaseDB'
import { getDocs, addDoc, collection } from "firebase/firestore";

function AddIpdScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedDiagnosis, setSelectedDiagnosis] = useState(""); // State for selected diagnosis
  const [mainDiagnoses, setMainDiagnoses] = useState([]); // State to store main diagnoses
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [hn, setHN] = useState(""); // HN
  const [coMorbid, setCoMorbid] = useState(""); // Co-Morbid Diagnosis
  const [note, setNote] = useState(""); // Note
  const status = "pending"; // Status
  const patientType = "inpatient"; // Patient Type
  const professorName = null; // Professor Name
  const [createBy_id, setCreateById] = useState(null); // User ID
  

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // อัปเดต state เมื่อผู้ใช้เลือกวันที่ใหม่
    setSelectedDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    async function fetchMainDiagnoses() {
      try {
        const mainDiagnosisRef = collection(db, "mainDiagnosis");
        const querySnapshot = await getDocs(mainDiagnosisRef);
  
        const diagnoses = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.diseases.forEach((disease) => {
            diagnoses.push({ key: disease, value: disease });
          });
        });
  
        setMainDiagnoses(diagnoses);
      } catch (error) {
        console.error("Error fetching main diagnoses:", error);
      }
    }
  
    fetchMainDiagnoses();
  }, []);

  const saveDataToFirestore = async () => {
    try {

      if (!selectedDiagnosis) {
        alert("โปรดกรอก Main Diagnosis");
        return;
      }
      
      if (!hn) {
        alert("โปรดกรอก HN");
        return;
      }
  
      if (!selectedDate) {
        alert("โปรดเลือกวันที่รับผู้ป่วย");
        return;
      }

      // Get the currently authenticated user
      const user = auth.currentUser;
    
      // Check if a user is authenticated
      if (user) {
        const { uid } = user; 
        
        // Add a new document with a generated ID to a collection
        await addDoc(collection(db, "patients"), {
          admissionDate: selectedDate,
          coMorbid: coMorbid, // Co-Morbid Diagnosis
          createBy_id: uid, // User ID
          hn: hn, // HN
          mainDiagnosis: selectedDiagnosis,
          note: note, // Note
          patientType: patientType,
          professorName: professorName,
          status: status,
          // Add more fields as needed
        });

        // Clear the input fields after successfully saving data
        setHN("");
        setSelectedDate(new Date());
        setSelectedDiagnosis("");
        setCoMorbid("");
        setNote("");

        // Display a success message or perform any other action
        alert("บันทึกข้อมูลสำเร็จ");
      } else {
        // Handle the case when no user is authenticated
        alert("ไม่พบข้อมูลผู้ใช้");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle errors or display an error message
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,
        }}>วันที่รับผู้ป่วย</Text>
      </View>
      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          width: '70%',
          marginBottom: 12,
          height: 48,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 22,
        }}
      >
        <Text>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {/* <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,

        }}>อาจารย์</Text>
        <SelectList
          setSelected={setDiagnosis}
          data={maindiagosis}
          placeholder={"เลือกชื่ออาจารย์"}
          defaultOption={{ key: 'FE', value: 'Fever' }}

        />
      </View> */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,
        }}>HN</Text>
      </View>
      <View style={{
        width: '70%',
        height: 48,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 22
      }}>
        <TextInput
          placeholder="กรอกรายละเอียด"
          value={hn}
          onChangeText={setHN}
          style={{
            width: '100%'
          }}
        ></TextInput>
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,
        }}>Main Diagnosis</Text>
        {/* เราสมมติว่า mainDiagnoses เป็น array ที่มีค่าในรูปแบบ { key, value } */}
        <SelectList
          setSelected={setSelectedDiagnosis}
          data={mainDiagnoses}
          placeholder={"เลือกการวินิฉัย"}
          defaultOption={mainDiagnoses[0]}
        />
      </View>

      {/* <View style={{
        width: '70%',
        height: 48,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 22
      }}>
        <TextInput
          placeholder="เพิ่มการวินิฉัยอื่นๆ"

          style={{
            width: '100%'
          }}
        ></TextInput>


      </View> */}

<View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,
        }}>Co-Morbid Diagnosis</Text>
      </View>
      <View style={{
        width: '70%',
        height: 48,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 22
      }}>
        <TextInput
          placeholder="กรอกรายละเอียด"
          value={coMorbid}
          onChangeText={setCoMorbid}
          style={{
            width: '100%'
          }}
        ></TextInput>
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,
        }}>Note / Reflection (optional)</Text>
      </View>
      <View style={{
        width: '70%',
        height: 260,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 22
      }}>
        <TextInput
          placeholder="กรอกรายละเอียด"
          value={note}
          onChangeText={setNote}
          style={{
            width: '100%',
            height: '100%'
          }}
        ></TextInput>
      </View>

      <TouchableOpacity
        style={{
          height: 48,
          width: 140,
          marginVertical: 10,
          marginBottom: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#05AB9F",
          borderRadius: 30,
        }}
        onPress={saveDataToFirestore}
      >
        <Text style={{ fontSize: 20, color: 'white' }}>บันทึกข้อมูล</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddIpdScreen;