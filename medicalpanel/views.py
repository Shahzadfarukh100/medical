import io
import sys
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.views import generic
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from .serializer import (BlogSerializer,
                         BannerSerializer,
                         ConsultantSerializer,
                         AppointmentSerializer,
                         NewsletterSerializer,
                         InputSerializer)
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy, reverse
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
import json
from newapp.forms import *
from django.contrib import auth
from django.contrib.auth.views import LoginView
import base64


# Login
class AppLoginView(LoginView):
    template_name = 'medicalpanel/login.html'


# Blog
class DashboardView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'medicalpanel/dashboard.html'
    login_url = reverse_lazy('medicalpanel:login')


class BlogGetView(APIView):

    def get(self, request, *args, **kwargs):
        blogs = []
        for blog in BlogPost.objects.all():
            use = dict(id=blog.id, blog_title=blog.blog_title, image=blog.image.url,
                       blog_description=blog.blog_description, author=blog.author,
                       created_date=blog.created_date.strftime("%Y-%m-%d %H:%M:%S"))
            blogs.append(use)

        return HttpResponse(json.dumps(blogs))

    def post(self, request, *args, **kwargs):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            bimage = base64.b64decode(request.data.get('image'))
            bimage = io.BytesIO(bimage)
            image = InMemoryUploadedFile(bimage,
                                         'ImageField',
                                         'image.jpg',
                                         'image/jpeg',
                                         sys.getsizeof(bimage),
                                         None)
            instance = BlogPost()
            instance.image = image
            instance.blog_title = serializer.validated_data['blog_title']
            instance.blog_description= serializer.validated_data['blog_description']
            instance.author = serializer.validated_data['author']
            instance.save()
            return JsonResponse({'status': 'ok', "message": "Blog Added"})
        else:
            error_message = dict(
                [(key, [error for error in value]) for key, value in serializer.errors.items()])
            return JsonResponse({'status': 'error', "message": error_message})


class BlogRUDView(RetrieveUpdateDestroyAPIView):
    serializer_class = BlogSerializer
    queryset = BlogPost.objects.all()


# Banner
class DBannerView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'medicalpanel/bans.html'
    login_url = reverse_lazy('medicalpanel:login')


class BannerGetView(APIView):

    def get(self, request, *args, **kwargs):
        banner = []
        for b in Banner.objects.all():
            ban = dict(id=b.id, title=b.title, code=b.code, short_description=b.short_description, number=b.number)
            if b.image:
                ban['image'] = b.image.url
            banner.append(ban)

        return HttpResponse(json.dumps(banner))

    def post(self, request, *args, **kwargs):
        serializer = BannerSerializer(data=request.data)
        if serializer.is_valid():
            bimage = base64.b64decode(request.data.get('image'))
            bimage = io.BytesIO(bimage)
            image = InMemoryUploadedFile(bimage,
                                         'ImageField',
                                         'image.jpg',
                                         'image/jpeg',
                                         sys.getsizeof(bimage),
                                         None)
            instance = Banner()
            instance.image = image
            instance.title = serializer.validated_data['title']
            instance.code = serializer.validated_data['code']
            instance.short_description = serializer.validated_data['short_description']
            instance.number = serializer.validated_data['number']
            instance.save()
            return JsonResponse({'status': 'ok', "message": "Banner Added"})
        else:
            error_message = dict(
                [(key, [error for error in value]) for key, value in serializer.errors.items()])
            return JsonResponse({'status': 'error', "message": error_message})


class BannerRUDView(RetrieveUpdateDestroyAPIView):
    serializer_class = BannerSerializer
    queryset = Banner.objects.all()


# Consultant
class DConsulantView(LoginRequiredMixin, generic.TemplateView):
    login_url = reverse_lazy('medicalpanel:login')
    template_name = 'medicalpanel/consultant.html'


class ConsultantGetView(APIView):

    def get(self, request, *args, **kwargs):
        banner = []
        for b in Consultant.objects.all():
            ban = dict(id=b.id, name=b.name, image=b.image, description=b.description)
            if b.image:
                ban['image'] = b.image.url
            banner.append(ban)

        return HttpResponse(json.dumps(banner))

    def post(self, request, *args, **kwargs):
        serializer = ConsultantSerializer(data=request.data)
        if serializer.is_valid():
            bimage = base64.b64decode(request.data.get('image'))
            bimage = io.BytesIO(bimage)
            image = InMemoryUploadedFile(bimage,
                                         'ImageField',
                                         'image.jpg',
                                         'image/jpeg',
                                         sys.getsizeof(bimage),
                                         None)
            instance = Consultant()
            instance.image = image
            instance.name = serializer.validated_data['name']
            instance.description = serializer.validated_data['description']
            instance.save()
            return JsonResponse({'status': 'ok', "message": "Consultant Added"})
        else:
            error_message = dict(
                [(key, [error for error in value]) for key, value in serializer.errors.items()])
            return JsonResponse({'status': 'error', "message": error_message})


class ConsultantRUDView(RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultantSerializer
    queryset = Consultant.objects.all()


# Appointment
class DAppointmentView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'medicalpanel/appointment.html'
    login_url = reverse_lazy('medicalpanel:login')

    def get_context_data(self, **kwargs):
        context = super(DAppointmentView, self).get_context_data(**kwargs)
        context['appointment'] = Appointment.objects.all()
        context['form'] = AppointmentForm()
        return context


class AppointmentGetView(APIView):

    def get(self, request, *args, **kwargs):
        banner = []
        for b in Appointment.objects.all():
            ban = dict(id=b.id, patient_name=b.patient_name, phone=b.phone,
                       appointment_date=b.appointment_date.strftime("%Y-%m-%d %H:%M:%S"), message=b.message)
            banner.append(ban)

        return HttpResponse(json.dumps(banner))

    def post(self, request, *args, **kwargs):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'status': 'ok', 'message': 'Appointment Confirmed.'})
        else:
            error_message = dict(
                [(key, [error for error in value]) for key, value in serializer.errors.items()])
            return JsonResponse({'status': 'error', "message": error_message})


class AppointmentRUDView(RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()


# newsletter
class DNewsletterView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'medicalpanel/newsletter.html'
    login_url = reverse_lazy('medicalpanel:login')

    def get_context_data(self, **kwargs):
        context = super(DNewsletterView, self).get_context_data(**kwargs)
        context['newsletter'] = Newsletter.objects.all()
        context['newsletter_form'] = NewsletterForm()
        return context


class NewsletterGetView(APIView):

    def get(self, request, *args, **kwargs):
        banner = []
        for b in Newsletter.objects.all():
            ban = dict(id=b.id, email=b.email, dated=b.dated.strftime("%Y-%m-%d %H:%M:%S"))
            banner.append(ban)

        return HttpResponse(json.dumps(banner))

    def post(self, request, *args, **kwargs):
        serializer = NewsletterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return HttpResponseRedirect(reverse('medicalpanel:newsletter-view'))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterRUDView(RetrieveUpdateDestroyAPIView):
    serializer_class = NewsletterSerializer
    queryset = Newsletter.objects.all()


# inputs
class DInputView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'medicalpanel/inputs.html'
    login_url = reverse_lazy('medicalpanel:login')


class InputGetView(APIView):

    def get(self, request, *args, **kwargs):
        banner = []
        for b in Input.objects.all():
            ban = dict(id=b.id, clients_served=b.clients_served, x_rays_done=b.x_rays_done,
                       worldwide_stuff=b.worldwide_stuff, lives_saved=b.lives_saved)
            banner.append(ban)

        return HttpResponse(json.dumps(banner))

    def post(self, request, *args, **kwargs):
        serializer = InputSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'status': 'ok', "message": "Input Added"})
        else:
            error_message = dict(
                [(key, [error for error in value]) for key, value in serializer.errors.items()])
            return JsonResponse({'status': 'error', "message": error_message})


class InputRUDView(RetrieveUpdateDestroyAPIView):
    serializer_class = InputSerializer
    queryset = Input.objects.all()


# logout
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/panel/login/')
