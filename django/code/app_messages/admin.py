from django.contrib import admin
from django.http import HttpResponseRedirect
from .models import Message
from django.urls import path


class MessageAdmin(admin.ModelAdmin):
    list_filter = ['pub_date']
    search_fields = ['data']
    list_display = ('data', 'pub_date')
    fieldsets = [
        (None, {'fields': ['data', 'key']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]

    change_list_template = "entities/change_list.html"

    def delete_all(self, request):
        self.model.objects.all().delete()
        return HttpResponseRedirect("../")

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('delete/', self.delete_all),
        ]
        return my_urls + urls


admin.site.register(Message, MessageAdmin)
