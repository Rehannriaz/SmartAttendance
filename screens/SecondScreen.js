import React from 'react';
import { View, Text, Button,Image } from 'react-native';

const SecondScreen = ({ onNavigate, selectedImage }) => {
  
    console.log(selectedImage);
    return (
      <View>
        <Text>This is the Second Screen!</Text>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
        )}
        <Button title="Go to First Screen" onPress={onNavigate} />

        <View className="flex-1 h-96 items-center justify-center bg-slate-600">
<Text>Open up App.js to start working on your app!</Text>
</View>
      </View>
    );
  };
  

export default SecondScreen;
