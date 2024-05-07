import os
import cv2
from mtcnn import MTCNN
import numpy as np
import face_recognition
from keras_facenet import FaceNet
import pickle


detector = MTCNN()
embedder = FaceNet()

# Directory containing folders of known persons
known_faces_dir = './Train1'


# Function to load known faces
def load_known_faces(person_name, paths):
    known_face_encodings = []
    for path in paths:
        # Load the image file
        image = cv2.imread(path)
        if image is None:
            continue
        # Convert the image from BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        # Detect faces in the image
        results = detector.detect_faces(image_rgb)
        if results:
            x, y, width, height = results[0]['box']
            face_crop =  image_rgb[y:y+height, x:x+width]
            if face_crop.size == 0:
                continue
            # Get the face encoding
            face_features = embedder.embeddings([face_crop])[0]
            known_face_encodings.append(face_features)
            known_face_names.append(person_name)
    return known_face_encodings

# Load known faces
known_face_encodings = []
known_face_names = []


# Iterate over each folder in the directory
for folder_name in os.listdir(known_faces_dir):
    folder_path = os.path.join(known_faces_dir, folder_name)
    if os.path.isdir(folder_path):
        # Collect image paths for the person
        image_paths = [os.path.join(folder_path, image_name) for image_name in os.listdir(folder_path)]
        # Load multiple images for the person
        person_encodings = load_known_faces(folder_name, image_paths)
        # Check if the person's name already exists in known_face_names
        known_face_encodings.extend(person_encodings)



with open('known_face_encodings.pkl', 'wb') as f:
    pickle.dump(known_face_encodings, f)

with open('known_face_names.pkl', 'wb') as f:
    pickle.dump(known_face_names, f)