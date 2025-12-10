from PIL import Image
import numpy as np
import os

# Create a random RGB image (100x100)
data = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
img = Image.fromarray(data)

# Save as test_image.jpg
img.save('test_image.jpg')
print("Created test_image.jpg for verification")
