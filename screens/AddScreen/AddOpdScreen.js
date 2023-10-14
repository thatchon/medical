import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Platform } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db, auth, storage } from '../../data/firebaseDB'
import { getDocs, addDoc, collection, query, where, Timestamp } from "firebase/firestore";
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

function AddOpdScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedDiagnosis, setSelectedDiagnosis] = useState(""); // State for selected diagnosis
  const [mainDiagnoses, setMainDiagnoses] = useState([]); // State to store main diagnoses
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [hn, setHN] = useState(""); // HN
  const [coMorbid, setCoMorbid] = useState(""); // Co-Morbid Diagnosis
  const [note, setNote] = useState(""); // Note
  const status = "pending"; // Status
  const patientType = "outpatient"; // Patient Type
  const [createBy_id, setCreateById] = useState(null); // User ID
  const [professorId, setProfessorId] = useState(null); // สถานะสำหรับเก็บ id ของอาจารย์ที่ถูกเลือก
  const [professorName, setProfessorName] = useState(null); // สถานะสำหรับเก็บชื่ออาจารย์ที่ถูกเลือก
  const [teachers, setTeachers] = useState([]); // สถานะสำหรับเก็บรายการอาจารย์ทั้งหมด
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

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
  const onDrop = acceptedFiles => {
    // Check if the uploaded file is a PDF
    if (acceptedFiles[0].type !== 'application/pdf') {
      alert('กรุณาอัปโหลดเฉพาะไฟล์ PDF');
      return;
    }
    setPdfFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf'
  });
  
  const uploadPdfToStorage = async () => {
    if (!pdfFile) return null;
  
    try {
      const storageRef = ref(storage, 'pdfs/' + pdfFile.name);
      await uploadBytes(storageRef, pdfFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading PDF to Firebase Storage:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์ PDF");
      return null;
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

      if (!professorName) {
        alert("โปรดเลือกอาจารย์");
        return;
      }
      const user = auth.currentUser;
      const uploadedPdfUrl = await uploadPdfToStorage();

      if (user) {
        const { uid } = user; 
        const timestamp = Timestamp.fromDate(selectedDate); 
        // Add a new document with a generated ID to a collection
        await addDoc(collection(db, "patients"), {
          admissionDate: timestamp,
          coMorbid: coMorbid, // Co-Morbid Diagnosis
          createBy_id: uid, // User ID
          hn: hn, // HN
          mainDiagnosis: selectedDiagnosis,
          note: note, // Note
          patientType: patientType,
          professorName: professorName,
          status: status,
          professorId: professorId,
          pdfUrl: uploadedPdfUrl || "",
          // Add more fields as needed
        });

        // Clear the input fields after successfully saving data
        setHN("");
        setSelectedDate(new Date());
        setSelectedDiagnosis("");
        setCoMorbid("");
        setNote("");
        setPdfFile(null);
        console.log("Download URL:", pdfUrl);
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
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>วันที่รับผู้ป่วย</Text>
        <DateInput />
      </View>


      <View style={{ marginBottom: 16 }}>
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

      <View style={{ marginBottom: 16, width: '70%'}}>
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

      <View style={{ marginBottom: 16 }}>
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

      <View style={{ marginBottom: 16, width: '70%' }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 400,
          marginVertical: 8,
          textAlign: 'center'

        }}>Co-Morbid Diagnosis</Text>
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
              value={coMorbid}
              onChangeText={setCoMorbid}
              style={{
                width: '100%',
                textAlign: 'center'
              }}
            ></TextInput>
          </View>
        </View>
        
      <View style={{ marginBottom: 16, width: '70%' }}>
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

        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 400,
            marginVertical: 8,
            textAlign: 'center'

          }}>อัปโหลดไฟล์ PDF</Text>
        <View 
          {...getRootProps({ className: 'dropzone' })}
          style={{ 
            height: 50,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
          }}
        >
          <input {...getInputProps()} />
          <FontAwesome name="upload" size={24} color="black" />
          <Text style={{ marginLeft: 10 }}>
            {
              pdfFile ? pdfFile.name : 'Import PDF only.'
            }
          </Text>
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

export default AddOpdScreen;