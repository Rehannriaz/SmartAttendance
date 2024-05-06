import React, { useState } from "react";
import { View, Text, Button, FlatList, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
// import * as FileSystem from 'expo-asset';
const HomeScreen = ({ data, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
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
  const handleNavigateToSecondScreen = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    setImageUploaded(false);
    
    let imageUri = selectedImage; // Extract URI from selectedImage
    if (Platform.OS === "android") {
      imageUri = imageUri.replace("file://", "");
    }
    console.log("result.url = ",imageUri);
    
    // Create a FormData object
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "image.jpg",
    });
    try {
      const response = await fetch("http://10.1.155.151:6000/recognize_faces", {
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
    } catch (error) {
      console.error("Error recognizing faces:", error);
      setImageUploaded(true);
      alert("Failed to recognize faces. Please try again.");
    }
  };

  // Replace with your UI logic to display fetched data
  return (
    <View>
      <Text>Smart Attendance</Text>
      {selectedImage && (
        <>
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 800, height: 600 }}
          />
        </>
      )}
      <Button title="Pick an Image" onPress={pickImage} />

      {imageUploaded && (
        <Button
          title="Show Attendance"
          onPress={handleNavigateToSecondScreen}
        />
      )}
    </View>
  );
};

export default HomeScreen;
