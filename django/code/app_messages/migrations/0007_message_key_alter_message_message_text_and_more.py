# Generated by Django 4.0 on 2021-12-29 22:07

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('app_messages', '0006_alter_message_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='key',
            field=models.TextField(default='2137', max_length=360),
        ),
        migrations.AlterField(
            model_name='message',
            name='message_text',
            field=models.TextField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='message',
            name='pub_date',
            field=models.DateField(default=datetime.datetime(2021, 12, 29, 22, 7, 27, 870587, tzinfo=utc)),
        ),
    ]