import os
import io
from google.cloud import vision
import pandas as pd

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r"D:\ocr\vision_key.json"

client = vision.ImageAnnotatorClient()

file_name = '3.jpg'
image_path = fr'D:\ocr\image\{file_name}'

with io.open(image_path, 'rb') as image_file:
    content = image_file.read()

# Construct an image instance
image = vision.Image(content=content)

# Annotate Image Response
response = client.text_detection(image=image)  # Returns TextAnnotation
df = pd.DataFrame(columns=['locale', 'description'])

texts = response.text_annotations

# Collect data into a list of dictionaries
data = [{'locale': text.locale, 'description': text.description} for text in texts]

# Use pd.concat() to add rows
df = pd.concat([df, pd.DataFrame(data)], ignore_index=True)

print(df['description'][0])
