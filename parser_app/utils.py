
import cv2
import numpy as np
import pytesseract
from InvoiceParser.settings import tesseract_location

pytesseract.pytesseract.tesseract_cmd=tesseract_location

def check_value(value):
  return value!="" and len(value)!=0 and value!='—' and value!='-' and value!='=“'

def inverted_thresholding(img):
    _,img_bin = cv2.threshold(img,128,255,cv2.THRESH_BINARY)
    img_bin = 255-img_bin
    return img_bin

def horizontal_mask(img,img_bin):
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (np.array(img).shape[1]//100, 1))
    horizontal_mask = cv2.morphologyEx(img_bin, cv2.MORPH_OPEN, horizontal_kernel, iterations=3)
    return horizontal_kernel,horizontal_mask

def vertical_mask(img,img_bin):
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, np.array(img).shape[1]//100))
    vertical_mask = cv2.morphologyEx(img_bin, cv2.MORPH_OPEN, vertical_kernel, iterations=3)
    return vertical_kernel,vertical_mask

def dilate_image(img_bin):
    kernel = np.ones((5,5),np.uint8)
    dilated_value = cv2.dilate(img_bin,kernel,iterations = 1)
    return dilated_value

def evaluate(invoice,bounding_box_list):
    table_content=list()

    for i,box in enumerate(bounding_box_list):
        x,y,w,h=box
        ROI=invoice[y:y+h,x:x+w]
        value=pytesseract.image_to_string(ROI,lang="eng",config='--psm 10 --oem 3')
        value=value.strip()
        # print(value)
        if  check_value(value):
            table_content.append((box,value))
    
    table=list()
    temp_table_list=list()
    i=1
    y_prev=table_content[i-1][0][1]
    y_next=0

    
    while i<len(table_content):
        y_next=table_content[i][0][1]
        if y_next-y_prev<=3:
            temp_table_list.append(table_content[i-1])
        else:
            if len(temp_table_list)!=0:
                temp_table_list.append(table_content[i-1])
                table.append(temp_table_list)
            temp_table_list=[]

        y_prev=y_next
        i+=1

    if len(temp_table_list)!=0:
        temp_table_list.append(table_content[i-1])
        table.append(temp_table_list)
    
    table=[ sorted(row,key=lambda x: x[0][0]) for row in table ]

    final_table=list()
    temp_table=list()

    for row in table:
        i,text=0,""
        while i<len(row):
            if text=="":
                text=row[i][1]
            else:
                text+=(" "+row[i][1])

            if i+1!=len(row) and (row[i+1][0][0]-(row[i][0][0]+row[i][0][2]))>4:
                temp_table.append(text)
                text=""
            elif i+1==len(row):
                temp_table.append(text)
            i+=1

        final_table.append(temp_table)
        temp_table=[]
    
    length=0
    i=0
    print(final_table)
    while i<len(final_table):
        if i==0:
            length=len(final_table[i])
        else:
            if len(final_table[i])!=length:
                final_table.pop(i)
                i-=1
        i+=1

    return final_table


    



    
