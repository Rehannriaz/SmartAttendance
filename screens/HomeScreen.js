import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import * as Sharing from "expo-sharing";
import AttendanceDownload from "../api/attendanceDownload";
import recognizeImage from "../api/recognizeImage";
const mainURL = "http://10.1.155.151:6000";
import pickImage from "../components/pickImage";
// import * as FileSystem from 'expo-asset';
const HomeScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [handleCalled, setHandleCalled] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const handlepickImage = async () => {
    const result = await pickImage();
    console.log("result = ", result);
    if (!result.canceled) {
      // setSelectedImage(result.uri);
      setShowDownloadButton(false);
      setSelectedImage(result.assets[0].uri);
      setImageUploaded(true);
      //   uploadImage(result.uri);
    }
  };

  const handleAttendanceDownload = () => {
    try {
      AttendanceDownload(mainURL);
    } catch (error) {
      console.error("Error Download Attendance: ", error);
      setImageUploaded(true);
      setHandleCalled(false);
      setShowDownloadButton(false);
      alert("Failed to download attendance. Please try again.");
    }
  };

const handleRecognizeImage = async (imageUri) => {
  try {
    const imageURL = await recognizeImage(mainURL, imageUri);

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
}

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    setShowDownloadButton(false);
    setImageUploaded(false);
    setHandleCalled(true);
    let imageUri = selectedImage; // Extract URI from selectedImage
    if (Platform.OS === "android") {
      imageUri = imageUri.replace("file://", "");
    }
    console.log("result.url = ", imageUri);
    
    handleRecognizeImage(imageUri);
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
        onPress={handlepickImage}
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
          onPress={handleImageUpload}
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
