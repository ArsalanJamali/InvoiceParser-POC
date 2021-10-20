from ast import Str
from django.shortcuts import redirect, render
from django.views.generic import View,TemplateView
from django.http import JsonResponse, HttpResponse
import pytesseract
from numpy import fromstring,uint8
import cv2
from pytesseract.pytesseract import Output
from InvoiceParser.settings import tesseract_location
import json
from .models import Invoice,InvoiceLabel
import base64,uuid
import io
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from .utils import *
from openpyxl import Workbook
from io import BytesIO


#pytesseract.pytesseract.tesseract_cmd=tesseract_location

class ParseDataView(LoginRequiredMixin,View):

    def post(self,*args, **kwargs):
        if self.request.method=='POST':
           request=self.request
           coordinates=json.loads(request.POST['json_coord'])
           invoice_file=request.POST['img64']
           format,invoice=invoice_file.split(';base64,')
           ext=format.split('/')[1]
           invoice=base64.b64decode(invoice)
           
           invoice_cv2=cv2.imdecode(fromstring(invoice,uint8),cv2.IMREAD_UNCHANGED)
           
           buf = io.BytesIO(invoice)
           img = Image.open(buf)
           img=img.convert('RGB')
           
           img_io = io.BytesIO()
           img.save(img_io, format='JPEG')

           model=Invoice(User=self.request.user)
           model.invoice_image=InMemoryUploadedFile(img_io, field_name=None, name="{}.{}".format(uuid.uuid4(),ext), content_type='image/jpeg', size=img_io.tell, charset=None)
           model.save()

           for coord in coordinates:
               key=coord['label']
               x,y,w,h=int(coord['x']),int(coord['y']),int(coord['w']),int(coord['h'])
               value=""
               if key.lower()!="table":
                    ROI=invoice_cv2[y:y+h,x:x+w]
                    value=pytesseract.image_to_string(ROI)
                    value=value.strip()
               print(key,value)
               label=InvoiceLabel(invoice_model=model,key=key,value=value,x_axis=x,y_axis=y,width=w,height=h)
               label.save()
           messages.success(request,"Congrats! {} Model was succesfully Created..".format(model.model_number)) 
        
        return JsonResponse({'Model_id':model.model_number})

    def get(self,*args, **kwargs):
        return render(self.request,'newmodel.html')


class ProcessInvoices(LoginRequiredMixin,View):

    def get(self,*args, **kwargs):
        obj=get_object_or_404(Invoice,model_number=self.kwargs['model_number'])
        return render(self.request,'uploadimage.html',{'model_no':self.kwargs['model_number']})
    
    def post(self,*args, **kwargs):
        request=self.request
        obj=get_object_or_404(Invoice,model_number=self.kwargs['model_number'])
        invoice_list=list()
        invoice_labels=obj.invoicelabel_set.all()
        
        for key,image in request.FILES.items():
            obj=cv2.imdecode(fromstring(image.read(),uint8),cv2.IMREAD_UNCHANGED)
            invoice_list.append((key,obj))
        
        result_set=dict()

        for key,invoice in invoice_list:
            key=key.split('_')[1]
            result_set[key]=dict()
            temp_invoice=invoice
            for label in invoice_labels:
                result_set[key][label.key]=''
                x,y,w,h=label.x_axis,label.y_axis,label.width,label.height
                invoice=invoice[y:y+h,x:x+w]
                if label.key=='table':
                    invoice=cv2.cvtColor(invoice, cv2.COLOR_BGR2GRAY)
                    invoice_img_bin=inverted_thresholding(invoice)
                    _,h_mask=horizontal_mask(invoice,invoice_img_bin)
                    _,v_mask=vertical_mask(invoice,invoice_img_bin)
                    table_mask = cv2.bitwise_or(h_mask,v_mask)
                    invoice_img_bin[np.where(table_mask==255)]=0
                    dilated_image=dilate_image(invoice_img_bin)
                    
                    contours, hierarchy = cv2.findContours(
                            dilated_image, cv2.RETR_EXTERNAL , cv2.CHAIN_APPROX_SIMPLE)
                    
                    bounding_box_list=[ cv2.boundingRect(cnt) for cnt in contours ]
                    bounding_box_list=sorted(bounding_box_list,key=lambda x: (x[1],x[0]))

                    final_table=evaluate(invoice,bounding_box_list)
                    result_set[key][label.key]=final_table    
                else:
                    value=pytesseract.image_to_string(invoice)
                    value=value.strip()
                    value=value.replace('\n'," ")
                    result_set[key][label.key]=value
                # print(result_set)
                invoice=temp_invoice
        
        for key in result_set.keys():
            value=result_set[key]
            result_set[key]=list([request.POST[key],value])
        

        return render(self.request,'display.html',{'data':json.dumps(result_set),'model_number':self.kwargs['model_number']})




def download_csv(request):

    obj=json.loads(request.body)
    obj=obj['write_data']

    csv=Workbook()
    flag=True
    sheet=None
    for key in obj.keys():
        if flag:
            sheet=csv.active
            flag=False
        else:
            sheet=csv.create_sheet()

        for item,item_value in obj[key][1].items():
            if item!='table':
                sheet.append([item,item_value])
            else:
                for row in item_value:
                    sheet.append(row)

    response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = 'attachment; filename=Invoice_data.xlsx'
    
    csv.save(response)
    return response

def download_json(request):
    obj=json.loads(request.body)
    obj=obj['write_data']
    response = HttpResponse(json.dumps(obj),content_type="application/json")
    response['Content-Disposition'] = 'attachment; filename=Invoice_data.json'
    return response    

