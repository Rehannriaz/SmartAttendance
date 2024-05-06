import os
import cv2
import face_recognition
import numpy as np
import pickle
from flask import Flask, request, send_file
from flask_cors import CORS
from io import BytesIO



app = Flask(__name__)
CORS(app)

with open('known_face_encodings.pkl', 'rb') as f:
    known_face_encodings = pickle.load(f)

with open('known_face_names.pkl', 'rb') as f:
    known_face_names = pickle.load(f)

# @app.route('/test', methods=['GET'])
# def test():
#     return 'Hello, World!'

# @app.route('/postTest', methods=['POST'])
# def postTest():
#     file = request.files['image'].data
    
#     return ('Hello')


@app.route('/recognize_faces', methods=['POST'])
def recognize_faces():
    # Load the image from the request
    if 'image' not in request.files:
        return 400

    file = request.files.get('image')  # Use request.files.get() instead of request.files[]

    # Check if the file is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # file = request.files['image']
    file = request.files['image']
    image_stream = BytesIO(file.read())
    unknown_image = face_recognition.load_image_file(image_stream)
    unknown_image_rgb = cv2.cvtColor(unknown_image, cv2.COLOR_BGR2RGB)

    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(unknown_image_rgb)
    face_encodings = face_recognition.face_encodings(unknown_image_rgb, face_locations)

    face_names = []
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        name = "?"  # If no match found, print "?"

        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]

        face_names.append(name)

    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Draw a box around the face
        cv2.rectangle(unknown_image_rgb, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(unknown_image_rgb, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(unknown_image_rgb, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Convert the image back to bytes
    _, img_encoded = cv2.imencode('.jpg', unknown_image_rgb)
    img_bytes = img_encoded.tobytes()

    return send_file(BytesIO(img_bytes), mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
