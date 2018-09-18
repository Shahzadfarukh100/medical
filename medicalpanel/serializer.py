from newapp.models import *
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
import io
import sys
import base64


class BlogSerializer(serializers.Serializer):
    blog_title = serializers.CharField()
    image = serializers.CharField(required=False)
    blog_description = serializers.CharField()
    author = serializers.CharField()

    def update(self, instance, validated_data):
        instance.blog_title = validated_data.get('blog_title', instance.blog_title)
        if validated_data.get('image'):
            bimage = base64.b64decode(validated_data.get('image'))
            bimage = io.BytesIO(bimage)
            image = InMemoryUploadedFile(bimage,
                                         'ImageField',
                                         'image.jpg',
                                         'image/jpeg',
                                         sys.getsizeof(bimage),
                                         None)
            instance.image = image
        instance.blog_description = validated_data.get('blog_description', instance.blog_description)
        instance.author = validated_data.get('author', instance.author)
        instance.save()
        return instance


class BannerSerializer(serializers.Serializer):
    title = serializers.CharField()
    code = serializers.CharField()
    short_description = serializers.CharField()
    image = serializers.CharField(required=False)
    number = serializers.CharField()

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.code = validated_data.get('code', instance.code)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        if validated_data.get('image'):
            bimage = base64.b64decode(validated_data.get('image'))
            bimage = io.BytesIO(bimage)
            image = InMemoryUploadedFile(bimage,
                                         'ImageField',
                                         'image.jpg',
                                         'image/jpeg',
                                         sys.getsizeof(bimage),
                                         None)
            instance.image = image
        instance.number = validated_data.get('number', instance.number)
        instance.save()
        return instance


class ConsultantSerializer(serializers.Serializer):
    name = serializers.CharField()
    image = serializers.CharField(required=False)
    description = serializers.CharField()

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        if validated_data.get('image'):
            bimage = base64.b64decode(validated_data.get('image'))
            bimage = io.BytesIO(bimage)
            image = InMemoryUploadedFile(bimage,
                                         'ImageField',
                                         'image.jpg',
                                         'image/jpeg',
                                         sys.getsizeof(bimage),
                                         None)
            instance.image = image
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = '__all__'


class InputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Input
        fields = '__all__'
