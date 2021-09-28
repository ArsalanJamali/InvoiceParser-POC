from django.urls import path
from .views import ParseDataView,ProcessInvoices,download_csv,download_json

app_name='parser_app'

urlpatterns = [
    path('parse/',ParseDataView.as_view(),name='parse-document'),
    path('process/<str:model_number>/',ProcessInvoices.as_view(),name="process_invoice"),
    path('download-csv/',download_csv,name="download_csv"),
    path('download-json/',download_json,name='download_json')

]
