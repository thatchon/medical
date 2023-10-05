import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, CheckBox } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db, auth } from '../../data/firebaseDB'
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";
// import CheckBox from '@react-native-community/checkbox';

function AddProcedureScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedProcedures, setSelectedProcedures] = useState(""); // State for selected Procedures
  const [mainProcedure, setMainProcedure] = useState([]); // State to store main Procedure
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [hn, setHN] = useState(""); // HN
  const [remarks, setRemarks] = useState(""); // remarks
  const status = "pending"; // Status
  const [createBy_id, setCreateById] = useState(null); // User ID
  const [approvedById, setApprovedById] = useState(null); // สถานะสำหรับเก็บ id ของอาจารย์ที่ถูกเลือก
  const [approvedByName, setApprovedByName] = useState(null); // สถานะสำหรับเก็บชื่ออาจารย์ที่ถูกเลือก
  const [teachers, setTeachers] = useState([]); // สถานะสำหรับเก็บรายการอาจารย์ทั้งหมด
  const [procedureLevel, setProcedureLevel] = useState(0);

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
        
        // Add a new document with a generated ID to a collection
        await addDoc(collection(db, "procedures"), {
          admissionDate: selectedDate,
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

      <View style={{ 
        marginBottom: 12, 
        justifyContent: 'center',
        alignItems: 'center' }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,
        }}>Procedure</Text>
        {/* เราสมมติว่า mainProcedure เป็น array ที่มีค่าในรูปแบบ { key, value } */}
        <SelectList
          setSelected={setSelectedProcedures}
          data={mainProcedure}
          placeholder={"โปรดระบุ"}
        />
      </View>

      <View style={{ 
        marginBottom: 12, 
        justifyContent: 'center',
        alignItems: 'center'
       }}>
        <Text style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8,
          }}>procedureLevel</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox value={procedureLevel === 1} onValueChange={() => setProcedureLevel(1)} />
              <Text>ทำด้วยตัวเองกับผู้ป่วย</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox value={procedureLevel === 2} onValueChange={() => setProcedureLevel(2)} />
              <Text>ทำกับหุ่น</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox value={procedureLevel === 3} onValueChange={() => setProcedureLevel(3)} />
              <Text>ได้ช่วย</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox value={procedureLevel === 4} onValueChange={() => setProcedureLevel(4)} />
              <Text>ได้ดู</Text>
            </View>
          </View>
      </View>

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

      <View style={{ 
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center' }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,

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


      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,
        }}>หมายเหตุ</Text>
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
          value={remarks}
          onChangeText={setRemarks}
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

export default AddProcedureScreen;