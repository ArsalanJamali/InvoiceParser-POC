from django.urls import path
from .views import ParseDataView

app_name='parser_app'

urlpatterns = [
    path('parse',ParseDataView.as_view(),name='parse-document'),
]
