from django.views.generic import ListView
from parser_app.models import Invoice
from math import ceil
from django.contrib.auth.mixins import LoginRequiredMixin

class IndexPage(LoginRequiredMixin,ListView):
    template_name='index.html'
    model=Invoice
    context_object_name='invoice_part_1'

    def get_queryset(self):
        queryset=self.model.objects.filter(User=self.request.user)
        return queryset.order_by('-created_at')

    def get_context_data(self, **kwargs):
        context=super().get_context_data(**kwargs)
        all_invoice=context['invoice_part_1']
        if len(all_invoice)==0:
            context['empty']=True
        else:
            context['empty']=False
            middle_index=ceil(len(all_invoice)/2)
            context['invoice_part_1']=all_invoice[:middle_index]
            context['invoice_part_2']=all_invoice[middle_index:]
        return context



    