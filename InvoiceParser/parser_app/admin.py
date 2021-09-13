from django.contrib import admin
from .models import Invoice,InvoiceLabels
# Register your models here.

admin.site.register(Invoice)
admin.site.register(InvoiceLabels)
