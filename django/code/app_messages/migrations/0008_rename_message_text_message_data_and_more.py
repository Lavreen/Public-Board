# Generated by Django 4.0 on 2021-12-29 22:10

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('app_messages', '0007_message_key_alter_message_message_text_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='message_text',
            new_name='data',
        ),
        migrations.AlterField(
            model_name='message',
            name='pub_date',
            field=models.DateField(default=datetime.datetime(2021, 12, 29, 22, 10, 20, 387932, tzinfo=utc)),
        ),
    ]
