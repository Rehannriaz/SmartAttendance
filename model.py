import os
import cv2
import face_recognition
import cv2
import numpy as np
import pickle


def load_known_faces(person_name, paths):
    face_encodings = []
    for path in paths:
        # Load the image file
        image = face_recognition.load_image_file(path)
        # Convert the image from BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        # Get face encodings for any people in the picture
        face_encodings_for_image = face_recognition.face_encodings(image_rgb)
        if len(face_encodings_for_image) > 0:
            face_encoding = face_encodings_for_image[0]
            face_encodings.append(face_encoding)
    return face_encodings, [person_name] * len(face_encodings)


# Load known faces
known_face_encodings = []
known_face_names = []

# Directory containing folders of known persons
known_faces_dir = './Train1'

# Iterate over each folder in the directory
for folder_name in os.listdir(known_faces_dir):
    folder_path = os.path.join(known_faces_dir, folder_name)
    if os.path.isdir(folder_path):
        # Collect image paths for the person
        image_paths = [os.path.join(folder_path, image_name) for image_name in os.listdir(folder_path)]
        # Load multiple images for the person
        person_encodings, person_names = load_known_faces(folder_name, image_paths)
        known_face_encodings.extend(person_encodings)
        known_face_names.extend(person_names)


with open('known_face_encodings.pkl', 'wb') as f:
    pickle.dump(known_face_encodings, f)

with open('known_face_names.pkl', 'wb') as f:
    pickle.dump(known_face_names, f)