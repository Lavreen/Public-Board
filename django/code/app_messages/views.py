from django.db import transaction
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views import generic
from django.utils import timezone
from rest_framework.decorators import action
from datetime import datetime, timedelta

from rest_framework import viewsets, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from app_messages.Serializers import MessageSerializer
from .models import Message


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 1000


class MessageViewModel(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    # queryset = Message.objects.all()
    # self.pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Message.objects.all()
        date = self.request.query_params.get('pub_date')
        if date is not None:
            queryset = queryset.filter(pub_date__gt=date)

        id_filter = self.request.query_params.get('id_filter')
        if id_filter is not None:
            id_filter = int(id_filter)
            queryset = queryset.filter(id__gte=id_filter)

        date1 = self.request.query_params.get('date1')
        date2 = self.request.query_params.get('date2')

        if date1 is not None and date2 is not None:
            queryset = queryset.filter(pub_date__gt=date1)
            queryset = queryset.filter(pub_date__lt=date2)


        return queryset

    @action(detail=False)
    def today_messages(self, request):
        curr_date = str(datetime.date(datetime.now()))
        recent_messages = Message.objects.filter(pub_date=curr_date)

        # page = self.paginate_queryset(recent_messages)
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(recent_messages, request)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.get_serializer(recent_messages, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def last_messages(self, request):
        curr_date = str(datetime.date(datetime.today()))
        yesterday = str(datetime.date(datetime.today() - timedelta(days=1)))
        recent_messages = Message.objects.filter(pub_date__in=[yesterday, curr_date])

        # page = self.paginate_queryset(recent_messages)
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(recent_messages, request)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.get_serializer(recent_messages, many=True)
        return Response(serializer.data)

    # overwritten create
    def create(self, request):

        # request.POST['message_text'],
        message = Message.objects.create(
            message_text = request.POST['message_text'],
            pub_date=request.POST['pub_date']
        )
        serializer = MessageSerializer(message)
        return Response({"created_id" : serializer.data["id"]}, status=status.HTTP_201_CREATED, )


