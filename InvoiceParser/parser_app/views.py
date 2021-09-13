from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
import pytesseract
from numpy import fromstring,uint8
import cv2
from InvoiceParser.settings import tesseract_location
import json
from .models import Invoice,InvoiceLabels

pytesseract.pytesseract.tesseract_cmd=tesseract_location

class ParseDataView(View):

    def post(self,*args, **kwargs):
        if self.request.method=='POST':
           request=self.request
           coordinates=json.loads(request.POST['json_coord'])
           invoice=request.FILES['invoice_file']
           invoice_cv2 = cv2.imdecode(fromstring(invoice.read(),uint8),cv2.IMREAD_UNCHANGED)
           
           model=Invoice(User=self.request.user,invoice_image=invoice)
           model.save()
           
           for coord in coordinates:
               key=coord['label']
               x,y,w,h=int(coord['x']),int(coord['y']),int(coord['w']),int(coord['h'])
               ROI=invoice_cv2[y:y+h,x:x+w]
               value=pytesseract.image_to_string(ROI)
               value=value.strip()
               print(value)
               label=InvoiceLabels(invoice_model=model,key=key,value=value,x_axis=x,y_axis=y,width=w,height=h)
               label.save()
                
        return JsonResponse({'Perfect':'ok'})

