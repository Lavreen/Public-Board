from django.contrib import admin

from .models import Message


class MessageAdmin(admin.ModelAdmin):
    list_filter = ['pub_date']
    search_fields = ['message_text']
    list_display = ('message_text', 'pub_date')
    fieldsets = [
        (None, {'fields': ['message_text']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]

admin.site.register(Message, MessageAdmin)
