from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _
import uuid
import os
from InvoiceParser.settings import MEDIA_URL
# Create your models here.

UserModel=get_user_model()

def get_image_file_name(instance,filename):

    ext=filename.split('.')[-1]
    filename="{}.{}".format(uuid.uuid4(),ext)

    return os.path.join('invoices/',filename)


class Invoice(models.Model):
    User=models.ForeignKey(UserModel,on_delete=models.CASCADE,verbose_name=_('This Model Belongs to?'),
                            help_text=_('This invoice belongs to above chosen user'))
    model_number=models.CharField(max_length=36,verbose_name=_('Model Number'),
                                    unique=True,blank=False,default=uuid.uuid4,
                                    help_text=_('This is used to identify this model'))
    invoice_image=models.ImageField(upload_to=get_image_file_name,blank=False)
    created_at=models.DateField(auto_now_add=True,verbose_name=_('Creation Date')
                                ,help_text=_('This is the date when model was created'))

    
    def get_image_url(self):
        return os.path.join(MEDIA_URL,self.invoice_image.url)

    def __str__(self):
        return self.model_number

class InvoiceLabel(models.Model):
    invoice_model=models.ForeignKey(Invoice,verbose_name=_("Invoice Number"),
                                    help_text=_("This field tells the model number of invoice"),
                                         on_delete=models.CASCADE)
    key=models.CharField(max_length=50,blank=False,null=False,verbose_name=_("Label Name"))
    value=models.TextField(verbose_name=_("Label Value"))
    x_axis=models.PositiveIntegerField(default=0,verbose_name=_("X-Coordinate"))
    y_axis=models.PositiveIntegerField(default=0,verbose_name=_("Y-Coordinate"))
    width=models.PositiveIntegerField(default=0,verbose_name=_("Bounding Box Width"))
    height=models.PositiveIntegerField(default=0,verbose_name=_("Bounding Box Height"))

    def __str__(self):
        return self.invoice_model.model_number+' | '+self.key
    

    
    
    