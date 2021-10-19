# Generated by Django 3.0 on 2021-09-26 15:25

from django.db import migrations, models
import parser_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('parser_app', '0003_auto_20210918_2110'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='invoice_image',
            field=models.ImageField(blank=True, null=True, upload_to=parser_app.models.get_image_file_name),
        ),
    ]