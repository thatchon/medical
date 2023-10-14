import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, CheckBox, Platform } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db, auth } from '../../data/firebaseDB'
import { getDocs, addDoc, collection, query, where, Timestamp } from "firebase/firestore";
// import CheckBox from '@react-native-community/checkbox';

function AddProcedureScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedProcedures, setSelectedProcedures] = useState(""); // State for selected Procedures
  const [mainProcedure, setMainProcedure] = useState([]); // State to store main Procedure

  const [hn, setHN] = useState(""); // HN
  const [remarks, setRemarks] = useState(""); // remarks
  const status = "pending"; // Status
  const [createBy_id, setCreateById] = useState(null); // User ID
  const [approvedById, setApprovedById] = useState(null); // สถานะสำหรับเก็บ id ของอาจารย์ที่ถูกเลือก
  const [approvedByName, setApprovedByName] = useState(null); // สถานะสำหรับเก็บชื่ออาจารย์ที่ถูกเลือก
  const [teachers, setTeachers] = useState([]); // สถานะสำหรับเก็บรายการอาจารย์ทั้งหมด
  const [procedureLevel, setProcedureLevel] = useState(0);
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
        setApprovedByName(selectedTeacher.value);
        setApprovedById(selectedTeacher.key);
    } else {
        console.error('Teacher not found:', selectedTeacherId);
    }
}
  

  useEffect(() => {
    async function fetchMainProcedure() {
      try {
        const procedureTypeRef = collection(db, "procedures_type");
        const querySnapshot = await getDocs(procedureTypeRef);
  
        const Procedure = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.procedureType.forEach((disease) => {
            Procedure.push({ key: disease, value: disease });
          });
        });
  
        setMainProcedure(Procedure);
      } catch (error) {
        console.error("Error fetching main Procedure:", error);
      }
    }
  
    fetchMainProcedure();
  }, []);

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

  const saveDataToFirestore = async () => {
    try {

      if (!selectedProcedures) {
        alert("โปรดเลือกประเภท");
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

      if (!approvedByName) {
        alert("โปรดเลือกอาจารย์");
        return;
      }

      if (!procedureLevel) {
        alert("โปรดเลือกเลเวล");
        return;
      }

      // Get the currently authenticated user
      const user = auth.currentUser;
    
      // Check if a user is authenticated
      if (user) {
        const { uid } = user; 
        const timestamp = Timestamp.fromDate(selectedDate); // แปลง Date object เป็น Timestamp
        // Add a new document with a generated ID to a collection
        await addDoc(collection(db, "procedures"), {
          admissionDate: timestamp,
          createBy_id: uid, // User ID
          hn: hn, // HN
          procedureType: selectedProcedures,
          remarks: remarks, // remarks
          approvedByName: approvedByName,
          status: status,
          approvedById: approvedById,
          procedureLevel: procedureLevel
          // Add more fields as needed
        });

        // Clear the input fields after successfully saving data
        setHN("");
        setSelectedDate(new Date());
        setSelectedProcedures("");
        setRemarks("");
        setProcedureLevel(null);

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

        }}>Procedure</Text>
        <SelectList
          setSelected={setSelectedProcedures}
          data={mainProcedure}
          placeholder={"โปรดระบุ"}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{
            fontSize: 24,
            fontWeight: 400,
            marginVertical: 8,
            textAlign: 'center'

          }}>Level</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 12 }}>
            <View style={styles.checkboxContainerStyle}>
              <CheckBox value={procedureLevel === 1} onValueChange={() => setProcedureLevel(1)} />
              <Text style={{ marginLeft: 5, fontSize: 20 }}>ทำด้วยตัวเองกับผู้ป่วย</Text>
            </View>
            <View style={styles.checkboxContainerStyle}>
              <CheckBox value={procedureLevel === 2} onValueChange={() => setProcedureLevel(2)} />
              <Text style={{ marginLeft: 5, fontSize: 20 }}>ทำกับหุ่น</Text>
            </View>
            <View style={styles.checkboxContainerStyle}>
              <CheckBox value={procedureLevel === 3} onValueChange={() => setProcedureLevel(3)} />
              <Text style={{ marginLeft: 5, fontSize: 20 }}>ได้ช่วย</Text>
            </View>
            <View style={styles.checkboxContainerStyle}>
              <CheckBox value={procedureLevel === 4} onValueChange={() => setProcedureLevel(4)} />
              <Text style={{ marginLeft: 5, fontSize: 20 }}>ได้ดู</Text>
            </View>
          </View>
      </View>

      <View style={{ marginBottom: 12, width: '70%' }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 400,
            marginVertical: 8,
            textAlign: 'center'

          }}>HN</Text>
          <View style={{
            height: 48,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TextInput
              placeholder="กรอกรายละเอียด"
              value={hn}
              onChangeText={setHN}
              style={{
                width: '100%',
                textAlign: 'center'
              }}
            ></TextInput>
          </View>
        </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>ผู้ Approve</Text>
        <SelectList
          setSelected={onSelectTeacher}
          data={teachers}
          placeholder={"เลือกชื่ออาจารย์"}
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


      <View style={{ marginBottom: 12, width: '70%', }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 400,
            marginVertical: 8,
            textAlign: 'center'

          }}>หมายเหตุ</Text>
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
            value={remarks}
            onChangeText={setRemarks}
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
  checkboxContainerStyle: {
    flexDirection: 'row', 
    alignItems: 'center', 
    margin: 5, 
    padding: 8, 
    borderWidth: 1, 
    borderColor: '#d1d1d1', 
    borderRadius: 5,
    backgroundColor: '#ffffff', 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});

export default AddProcedureScreen;