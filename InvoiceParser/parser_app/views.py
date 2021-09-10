from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
import pytesseract
from numpy import fromstring,uint8
import cv2
from InvoiceParser.settings import tesseract_location

pytesseract.pytesseract.tesseract_cmd=tesseract_location

class ParseDataView(View):

    def post(self,*args, **kwargs):
        if self.request.method=='POST':
           request=self.request
        #    coordinates=json.loads(request.POST['json_coord'])
           invoice=request.FILES['invoice_file']
           invoice_cv2 = cv2.imdecode(fromstring(invoice.read(),uint8),cv2.IMREAD_UNCHANGED)
           x,y,w,h=43,233,117,66
           ROI=invoice_cv2[y:y+h,x:x+w]
           data=pytesseract.image_to_string(ROI)
           print(data.encode('utf-8').strip())

        return JsonResponse({'id':'23'})

