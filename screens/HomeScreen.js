import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import * as Permissions from 'expo-permissions';


const mainURL = "http://10.1.155.151:6000";

// import * as FileSystem from 'expo-asset';
const HomeScreen = ({ data, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [handleCalled, setHandleCalled] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to pick an image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // setSelectedImage(result.uri);
      setSelectedImage(result.assets[0].uri);
      setImageUploaded(true);
      //   uploadImage(result.uri);
    }
  };

  // const handleAttendanceDownload = async () => {
  //   try {
  //     const response = await fetch(mainURL + "/get_attendance", {
  //       method: "GET",
  //     });
  //     console.log("response", response);
  //   } catch (error) {
  //     console.error("Error Download Attendance: ", error);
  //     setImageUploaded(true);
  //     setHandleCalled(false);
  //     setShowDownloadButton(false);
  //     alert("Failed to download attendance. Please try again.");
  //   }
  // };

  const handleAttendanceDownload = async () => {
    try {
      const response = await fetch(mainURL + "/get_attendance", {
        method: "GET",
      });
      const fileName = response.headers.get('Content-Disposition').split('=')[1];
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, base64data, { encoding: FileSystem.EncodingType.Base64 });
  
        const permission = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
        if (permission.status !== 'granted') {
          throw new Error('Permission not granted to save file');
        }
        await MediaLibrary.saveToLibraryAsync(fileUri);
  
        console.log("File downloaded successfully");
      };
    } catch (error) {
      console.error("Error Download Attendance: ", error);
      setImageUploaded(true);
      setHandleCalled(false);
      setShowDownloadButton(false);
      alert("Failed to download attendance. Please try again.");
    }
  };


  const handleNavigateToSecondScreen = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    setImageUploaded(false);
    setHandleCalled(true);
    let imageUri = selectedImage; // Extract URI from selectedImage
    if (Platform.OS === "android") {
      imageUri = imageUri.replace("file://", "");
    }
    console.log("result.url = ", imageUri);

    // Create a FormData object
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "image.jpg",
    });
    try {
      const response = await fetch(mainURL + "/recognize_faces", {
        // const response = await fetch("http://localhost:6000/recognize_faces", {
        method: "POST",
        body: formData,
      });
      console.log(JSON.stringify(formData), "formData");
      if (!response.ok) {
        throw new Error("Failed to recognize faces.");
      }

      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);

      // Display the image with recognized faces
      setSelectedImage(imageURL);
      setHandleCalled(false);
      setShowDownloadButton(true);
    } catch (error) {
      console.error("Error recognizing faces:", error);
      setImageUploaded(true);
      setHandleCalled(false);
      setShowDownloadButton(false);
      alert("Failed to recognize faces. Please try again.");
    }
  };
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Replace with your UI logic to display fetched data
  return (
    <View style={{ alignItems: "center" }}>
      <Text className="text-center text-4xl text-black">Smart Attendance</Text>
      {selectedImage && (
        <>
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: screenWidth * 0.9, // Set image width to 90% of screen width
              height: screenHeight * 0.5, // Set image height to 50% of screen height
              resizeMode: "contain", // Resize the image to fit within the specified dimensions
              marginVertical: 20, // Add vertical margin for spacing
            }}
          />
        </>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "black",
          color: "white",
          borderRadius: 8,
          padding: 10,
          alignItems: "center",
          width: "60%", // Fix width to 60%
          marginTop: 60, // Add margin top for spacing
        }}
        onPress={pickImage}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Pick an Image</Text>
      </TouchableOpacity>

      {imageUploaded && (
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            color: "white",
            borderRadius: 8,
            padding: 10,
            alignItems: "center",
            width: "60%", // Fix width to 60%
            marginTop: 60, // Add margin top for spacing
          }}
          onPress={handleNavigateToSecondScreen}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Show Attendance</Text>
        </TouchableOpacity>
      )}
      {handleCalled && (
        <Text style={{ color: "black", fontSize: 20 }}>
          Recognizing Faces...
        </Text>
      )}

      {showDownloadButton && (
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            color: "white",
            borderRadius: 8,
            padding: 10,
            alignItems: "center",
            width: "60%", // Fix width to 60%
            marginTop: 60, // Add margin top for spacing
          }}
          onPress={handleAttendanceDownload}
        >
          <Text style={{ color: "white", fontSize: 20 }}>
            Download Attendance
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;
