import datetime

from django.db import models
from django.utils import timezone


class Message(models.Model):
    id = models.AutoField(primary_key=True, null=False, )
    message_text = models.TextField(max_length=200)
    pub_date = models.DateField()

    def __str__(self):
        return str(self.id)

