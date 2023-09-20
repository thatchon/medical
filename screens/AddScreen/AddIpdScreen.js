import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

function AddIpdScreen() {
  const [Diagnosis, setDiagnosis] = React.useState("");
  

  const maindiagosis = [
    { key: 'FE', value: 'Fever' },
    { key: 'HE', value: 'Headache' },
    { key: 'ST ', value: 'Stomachache' },

  ];
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 400,
          marginVertical: 8,

        }}>วันที่รับผู้ป่วย</Text>
      
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

        }}>อาจารย์</Text>
        <SelectList
          setSelected={setDiagnosis}
          data={maindiagosis}
          placeholder={"เลือกชื่ออาจารย์"}
          defaultOption={{ key: 'FE', value: 'Fever' }}

        />
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
        <SelectList
          setSelected={setDiagnosis}
          data={maindiagosis}
          placeholder={"เลือกการวินิฉัย"}
          defaultOption={{ key: 'FE', value: 'Fever' }}

        />
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
          placeholder="เพิ่มการวินิฉัยอื่นๆ"

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