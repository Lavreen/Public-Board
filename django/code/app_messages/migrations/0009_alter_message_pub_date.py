# Generated by Django 4.0 on 2021-12-29 22:14

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('app_messages', '0008_rename_message_text_message_data_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='pub_date',
            field=models.DateField(default=datetime.datetime(2021, 12, 29, 22, 14, 55, 273250, tzinfo=utc)),
        ),
    ]
