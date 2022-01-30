from .models import Message
from datetime import datetime, timedelta


def delete_expired():
    expire_date = str(datetime.date(datetime.today() - timedelta(days=2)))
    Message.objects.filter(pub_date__lt=expire_date).delete()
