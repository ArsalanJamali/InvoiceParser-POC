from django.urls import path
from .views import ParseDataView,ProcessInvoices,DisplayDataView

app_name='parser_app'
di={'name':'1223'}
urlpatterns = [
    path('parse/',ParseDataView.as_view(),name='parse-document'),
    path('process/<str:model_number>/',ProcessInvoices.as_view(),name="process_invoice"),
    path('process/<str:model_number>/parse/',DisplayDataView.as_view(),name='view_content')
]
