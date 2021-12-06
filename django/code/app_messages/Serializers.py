from rest_framework import serializers

from app_messages.models import Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'message_text', 'pub_date']

