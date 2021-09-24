import cv2
from matplotlib import pyplot as plt
import numpy as np

file = 'invoice_1_crop.jpg'
table_image_contour = cv2.imread(file, 0)
table_image = cv2.imread(file)

ret, thresh_value = cv2.threshold(
    table_image_contour, 180, 255, cv2.THRESH_BINARY_INV)

#plt.imshow(thresh_value,cmap='gray')
#plt.show()


kernel = np.ones((5,5),np.uint8)
dilated_value = cv2.dilate(thresh_value,kernel,iterations = 1)

#plt.imshow(dilated_value,cmap='gray')
#plt.show()



contours, hierarchy = cv2.findContours(
    dilated_value, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    # bounding the images
    # if y < 50:
    table_image = cv2.rectangle(table_image, (x, y), (x + w, y + h), (0, 0, 255), 1)



plt.imshow(table_image)
plt.show()
cv2.namedWindow('detecttable', cv2.WINDOW_NORMAL)
# tesseract_location="C:\\Program Files\\Tesseract-OCR\\tesseract.exe" 

# import pytesseract
# from PIL import Image
# pytesseract.pytesseract.tesseract_cmd=tesseract_location

# image=Image.open('invoice_1_crop_colum1.jpg')
# data=pytesseract.image_to_string(image)
# print(data)


