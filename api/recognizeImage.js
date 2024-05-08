import React from "react";
import { TouchableOpacity, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const recognizeImage = async (mainURL, imageUri) => {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "image.jpg",
  });

  try {
    const response = await fetch(mainURL + "/recognize_faces", {
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
    return imageURL;
  } catch (error) {
    console.error("Error recognizing faces:", error);
    setImageUploaded(true);
    setHandleCalled(false);
    setShowDownloadButton(false);
    alert("Failed to recognize faces. Please try again.");
  }
};

export default recognizeImage;
