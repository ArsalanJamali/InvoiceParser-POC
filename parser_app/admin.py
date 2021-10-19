from django.contrib import admin
from .models import Invoice,InvoiceLabel
# Register your models here.

admin.site.register(Invoice)
admin.site.register(InvoiceLabel)
