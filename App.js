import React, { useState } from "react";
import { View,Text,SafeAreaView } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import SecondScreen from "./screens/SecondScreen";

const App = () => {
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleNavigateToSecondScreen = (imageUri) => {
    setSelectedImage(imageUri); // Set the selected image URI
    setShowSecondScreen(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!showSecondScreen && (
        <HomeScreen onNavigate={handleNavigateToSecondScreen} />
      )}
      {showSecondScreen && (
        <SecondScreen
          selectedImage={selectedImage} // Pass the selected image to SecondScreen
          onNavigate={() => setShowSecondScreen(false)}
        />
      )}


    </SafeAreaView>
  );
};

export default App;
