from django.urls import path
from .views import ParseDataView,ProcessInvoices

app_name='parser_app'

urlpatterns = [
    path('parse/',ParseDataView.as_view(),name='parse-document'),
    path('process/<str:model_number>/',ProcessInvoices.as_view(),name="process_invoice")

]
