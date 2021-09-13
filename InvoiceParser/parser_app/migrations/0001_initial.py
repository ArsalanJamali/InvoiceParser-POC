# Generated by Django 3.0 on 2021-09-13 18:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import parser_app.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('model_number', models.CharField(default=uuid.uuid4, help_text='This is used to identify this model', max_length=32, unique=True, verbose_name='Model Number')),
                ('invoice_image', models.ImageField(upload_to=parser_app.models.get_image_file_name)),
                ('User', models.ForeignKey(help_text='This invoice belongs to above chosen user', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='This Model Belongs to?')),
            ],
        ),
        migrations.CreateModel(
            name='InvoiceLabels',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=50, verbose_name='Label Name')),
                ('value', models.TextField(verbose_name='Label Value')),
                ('x_axis', models.PositiveIntegerField(default=0, verbose_name='X-Coordinate')),
                ('y_axis', models.PositiveIntegerField(default=0, verbose_name='Y-Coordinate')),
                ('width', models.PositiveIntegerField(default=0, verbose_name='Bounding Box Width')),
                ('height', models.PositiveIntegerField(default=0, verbose_name='Bounding Box Height')),
                ('invoice_model', models.ForeignKey(help_text='This field tells the model number of invoice', on_delete=django.db.models.deletion.CASCADE, to='parser_app.Invoice', verbose_name='Invoice Number')),
            ],
        ),
    ]
