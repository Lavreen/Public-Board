import datetime

from django.db import models
from django.utils.timezone import now


class Message(models.Model):
    id = models.AutoField(primary_key=True, null=False, )
    data = models.TextField(max_length=1000)
    key = models.TextField(max_length=360, default='2137')
    pub_date = models.DateField(default=now())

    def __str__(self):
        return str(self.id)



