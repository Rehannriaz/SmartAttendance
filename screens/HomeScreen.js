import React, { useState } from "react";
import { View, Text, Button, FlatList, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from 'expo-asset';
const HomeScreen = ({ data, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
    const[imageUploaded,setImageUploaded] = useState(false);
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
      console.log(result.uri);
      //   uploadImage(result.uri);
    }
  };


  const handleNavigateToSecondScreen = () => {
    onNavigate(selectedImage); // Pass selectedImage to SecondScreen
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
          <Text>HELLOSADASD</Text>
        </>
      )}
      <Button title="Pick an Image" onPress={pickImage} />

      {imageUploaded &&  <Button title="Show Attendance" onPress={handleNavigateToSecondScreen} />
}
<View className="h-96 items-center justify-center bg-slate-600">
<Text>Open up App.jghjks to start working on your app!</Text>
</View>

      
    </View>
  );
};

export default HomeScreen;
