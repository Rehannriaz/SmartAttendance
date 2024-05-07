import os
import cv2
import numpy as np
import pickle
from flask import Flask, request, send_file
from flask_cors import CORS
from io import BytesIO
from mtcnn import MTCNN
import numpy as np
import face_recognition
from keras_facenet import FaceNet



app = Flask(__name__)
CORS(app)

with open('known_face_encodings.pkl', 'rb') as f:
    known_face_encodings = pickle.load(f)

with open('known_face_names.pkl', 'rb') as f:
    known_face_names = pickle.load(f)

setThreshold = 1.0
detector = MTCNN()
embedder = FaceNet()

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

    unknown_image_rgb = cv2.cvtColor(unknown_image, cv2.COLOR_BGR2RGB)
    # Detect faces in the unknown image
    results = detector.detect_faces(unknown_image_rgb)
    face_names = []
    for result in results:
        x, y, width, height = result['box']
        face_crop = unknown_image_rgb[y:y+height, x:x+width]
        if face_crop.size == 0:
            continue
        face_features = embedder.embeddings([face_crop])[0]
        min_distance = float('inf')
        name = '?'
        for i, known_face_encoding in enumerate(known_face_encodings):
            distance = np.linalg.norm(face_features - known_face_encoding)
            if distance < min_distance:
                min_distance = distance
                name = known_face_names[i]
        if min_distance <= setThreshold:
            face_names.append(name)
        else:
            face_names.append('?')

    # Display the results
    for (x, y, w, h), name in zip([(result['box'][0], result['box'][1], result['box'][2], result['box'][3]) for result in results], face_names):
        # Draw a box around the face
        cv2.rectangle(unknown_image_rgb, (x, y), (x+w, y+h), (0, 0, 255), 2)
        # Draw a label with a name below the face
        cv2.rectangle(unknown_image_rgb, (x, y + h - 35), (x + w, y + h), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(unknown_image_rgb, name, (x + 6, y + h - 6), font, 1.5, (255, 255, 255), 1)

    # Convert the image back to bytes
    _, img_encoded = cv2.imencode('.jpg', unknown_image_rgb)
    img_bytes = img_encoded.tobytes()

    return send_file(BytesIO(img_bytes), mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=6000,debug=True)
