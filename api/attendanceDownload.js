import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const AttendanceDownload = async (mainURL) => {
  try {
    const response = await fetch(mainURL + "/get_attendance", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to download attendance.");
    }

    const json = await response.json();
    console.log("Attendance JSON:", json);

    // Convert JSON to CSV string
    const csvString = json.map(obj => Object.values(obj).join(',')).join('\n');
    
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear().toString().slice(-2);

    const filename = `attendance_${day}_${month}_${year}.csv`;

    
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(fileUri, csvString,{encoding: FileSystem.EncodingType.UTF8});

    await Sharing.shareAsync(fileUri, {mimeType: 'text/csv', dialogTitle: 'Attendance CSV', UTI: 'public.comma-separated-values-text'});

  } catch (error) {
    return error;
  }
};



export default AttendanceDownload;

