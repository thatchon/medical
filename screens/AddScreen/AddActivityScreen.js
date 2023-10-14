import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Platform } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db, auth } from '../../data/firebaseDB'
import { getDocs, addDoc, collection, query, where, Timestamp } from "firebase/firestore";

function AddActivityScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedDiagnosis, setSelectedDiagnosis] = useState(""); // State for selected diagnosis
  const [mainDiagnoses, setMainDiagnoses] = useState([]); // State to store main diagnoses

  const [professorId, setProfessorId] = useState(null);
  const [professorName, setProfessorName] = useState(null); // สถานะสำหรับเก็บชื่ออาจารย์ที่ถูกเลือก
  const [teachers, setTeachers] = useState([]);

  const [activityType, setActivityType] = useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState("");

  const [note, setNote] = useState(""); // Note
  const status = "pending"; // Status
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const DateInput = () => {
    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          style={{
            marginTop: 5,
            padding: 10,
            fontSize: 16
          }}
          value={selectedDate.toISOString().substr(0, 10)}
          onChange={(event) => setSelectedDate(new Date(event.target.value))}
        />
      );
    } else {
      return (
        <>
          <Button onPress={showDatepicker} title="Show date picker!" />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </>
      );
    }
  };


  const onSelectTeacher = (selectedTeacherId) => {
    const selectedTeacher = teachers.find(teacher => teacher.key === selectedTeacherId);
    // console.log(selectedTeacher)
    if (selectedTeacher) {
      setProfessorName(selectedTeacher.value);
      setProfessorId(selectedTeacher.key);
    } else {
      console.error('Teacher not found:', selectedTeacherId);
    }
  }

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const teacherRef = collection(db, "users");
        const q = query(teacherRef, where("role", "==", "teacher")); // ใช้ query และ where ในการ filter

        const querySnapshot = await getDocs(q); // ใช้ query ที่ถูก filter ในการ getDocs

        const teacherArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          teacherArray.push({ key: doc.id, value: data.displayName });
        });

        setTeachers(teacherArray); // ตั้งค่ารายการอาจารย์
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    }

    fetchTeachers(); // เรียกฟังก์ชันเพื่อดึงข้อมูลอาจารย์
  }, []);

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

  useEffect(() => {
    async function fetchActivityType() {
      try {
        const activityTypeRef = collection(db, "activity_type");
        const querySnapshot = await getDocs(activityTypeRef);
  
        const activityArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.activityType.forEach((activity) => {
            activityArray.push({ key: activity, value: activity });
          });
        });
  
        setActivityType(activityArray);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    }
  
    fetchActivityType();
  }, []);

  const saveDataToFirestore = async () => {
    try {

      if (!selectedDiagnosis) {
        alert("โปรดกรอก Main Diagnosis");
        return;
      }
      
      if (!selectedActivityType) {
        alert("โปรดเลือกประเภท");
        return;
      }
  
      if (!selectedDate) {
        alert("โปรดเลือกวันที่รับผู้ป่วย");
        return;
      }

      if (!professorName) {
        alert("โปรดเลือกอาจารย์");
        return;
      }

      // Get the currently authenticated user
      const user = auth.currentUser;
    
      // Check if a user is authenticated
      if (user) {
        const { uid } = user; 
        const timestamp = Timestamp.fromDate(selectedDate); // แปลง Date object เป็น Timestamp
        // Add a new document with a generated ID to a collection
        await addDoc(collection(db, "activity"), {
          admissionDate: timestamp,
          activityType: selectedActivityType, // Activity
          createBy_id: uid, // User ID
          mainDiagnosis: selectedDiagnosis,
          note: note, // Note
          professorName: professorName,
          status: status,
          professorId: professorId,
        });

        // Clear the input fields after successfully saving data
        // setHN("");
        setSelectedDate(new Date());
        setSelectedDiagnosis("");
        setSelectedActivityType("");
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
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>วันที่รับผู้ป่วย</Text>
        <DateInput />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>ประเภท</Text>
        <SelectList
          setSelected={setSelectedActivityType}
          data={activityType}
          placeholder={"เลือกประเภท"}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>อาจารย์</Text>
        <SelectList
          setSelected={onSelectTeacher}
          data={teachers}
          placeholder={"เลือกชื่ออาจารย์"}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>Main Diagnosis</Text>
        <SelectList
          setSelected={setSelectedDiagnosis}
          data={mainDiagnoses}
          placeholder={"เลือกการวินิฉัย"}
        />
      </View>

      <View style={{ marginBottom: 12, width: '70%' }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>Note / Reflection (optional)</Text>
      <View style={{
        height: 260,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <TextInput
          placeholder="กรอกรายละเอียด"
          value={note}
          onChangeText={setNote}
          style={{
            width: '100%',
            height: '100%',
            textAlign: 'center'
          }}
        ></TextInput>
        </View>
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
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
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

export default AddActivityScreen;