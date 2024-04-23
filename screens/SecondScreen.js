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
      </View>
    );
  };
  

export default SecondScreen;
