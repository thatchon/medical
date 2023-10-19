import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../data/firebaseDB';
import { collection, query, where, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const ReportScreen = () => {
  const currentUserUid = useSelector(state => state.user.uid);
  const [patientsData, setPatientsData] = useState([]);
  const [proceduresData, setProceduresData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [fileFormat, setFileFormat] = useState('csv');

  useEffect(() => {
    // Fetch patients data
    const getPatientsData = async () => {
      const patientsCollection = collection(db, 'patients');
      const patientQuery = query(patientsCollection, where("createBy_id", "==", currentUserUid));
      const patientSnapshot = await getDocs(patientQuery);
      setPatientsData(patientSnapshot.docs.map(doc => doc.data()));
    };

    // Fetch procedures data
    const getProceduresData = async () => {
      const proceduresCollection = collection(db, 'procedures');
      const procedureQuery = query(proceduresCollection, where("createBy_id", "==", currentUserUid));
      const procedureSnapshot = await getDocs(procedureQuery);
      setProceduresData(procedureSnapshot.docs.map(doc => doc.data()));
    };

    // Fetch activity data
    const getActivityData = async () => {
      const activityCollection = collection(db, 'activity');
      const activityQuery = query(activityCollection, where("createBy_id", "==", currentUserUid));
      const activitySnapshot = await getDocs(activityQuery);
      setActivityData(activitySnapshot.docs.map(doc => doc.data()));
    };

    getPatientsData();
    getProceduresData();
    getActivityData();
  }, [currentUserUid]);

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp.seconds * 1000).toLocaleDateString() : '';
  };

  const formatPatientsData = (data) => {
    return data.map(patient => {
      return {
        ...patient,
        mainDiagnosis: patient.mainDiagnosis ? patient.mainDiagnosis.map(diagnosis => diagnosis.value).join(', ') : '',
        admissionDate: patient.admissionDate ? new Date(patient.admissionDate.seconds * 1000).toLocaleDateString() : '', // แปลง timestamp เป็นวันที่
      };
    });
  };

  const formatDataForExport = (data) => {
    return data.map(item => ({
      ...item,
      admissionDate: formatDate(item.admissionDate)
    }));
  };
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
  
    const formattedPatientsData = formatPatientsData(patientsData);
    const formattedProceduresData = formatDataForExport(proceduresData);
    const formattedActivityData = formatDataForExport(activityData);
  
    // สร้าง worksheet สำหรับแต่ละ collection
    const wsPatients = XLSX.utils.json_to_sheet(formattedPatientsData);
    const wsProcedures = XLSX.utils.json_to_sheet(formattedProceduresData);
    const wsActivities = XLSX.utils.json_to_sheet(formattedActivityData);

    // ใส่ worksheet เข้า workbook
    XLSX.utils.book_append_sheet(wb, wsPatients, 'Patients');
    XLSX.utils.book_append_sheet(wb, wsProcedures, 'Procedures');
    XLSX.utils.book_append_sheet(wb, wsActivities, 'Activities');

    if (fileFormat === 'csv') {
      const csvPatients = XLSX.utils.sheet_to_csv(wsPatients);
      const csvProcedures = XLSX.utils.sheet_to_csv(wsProcedures);
      const csvActivities = XLSX.utils.sheet_to_csv(wsActivities);
      const csvData = `Patients Data:\n${csvPatients}\n\nProcedures Data:\n${csvProcedures}\n\nActivities Data:\n${csvActivities}`;
      const csvLink = document.createElement('a');
      const blob = new Blob([csvData], { type: 'text/csv' });
      csvLink.href = URL.createObjectURL(blob);
      csvLink.setAttribute('download', `CombinedData.csv`);
      csvLink.click();
    } else {
      XLSX.writeFile(wb, `CombinedData.${fileFormat}`);
    }
  };

  return (
    <div>
      <div>
        <label>Select File Format: </label>
        <select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
          <option value="csv">CSV</option>
          <option value="xls">XLS</option>
          <option value="xlsx">XLSX</option>
        </select>
      </div>

      {/* ปุ่มสำหรับดาวน์โหลดข้อมูล */}
      <div>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}

export default ReportScreen;