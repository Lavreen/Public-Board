from django.contrib import admin

from .models import Message


class MessageAdmin(admin.ModelAdmin):
    list_filter = ['pub_date']
    search_fields = ['data']
    list_display = ('data', 'pub_date')
    fieldsets = [
        (None, {'fields': ['data']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]

admin.site.register(Message, MessageAdmin)
