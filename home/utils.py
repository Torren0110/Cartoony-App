from PIL import Image
import cv2
import numpy as np

def is_image(img):
    try:
        with Image.open(img) as i:
            return True
    except:
        return False
    
def cartoonify(img_path):
    img = cv2.imread(img_path)
    
    k = 8
    # Defining input data for clustering
    data = np.float32(img).reshape((-1, 3))

    # Defining criteria
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)

    retval, label, center = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    center = np.uint8(center)

    # Reshape the output data to the size of input image
    cartoon = center[label.flatten()]
    cartoon = cartoon.reshape(img.shape)

    cv2.imwrite(img_path, cartoon)
    
    img = open(img_path, 'rb')
    return img