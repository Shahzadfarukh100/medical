import os
from django.test import TestCase
from .views import *
from django.contrib.auth.models import User
from model_mommy import mommy
from django.conf import settings
import datetime


class TestViews(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(username="test", password="test")
        self.blog = mommy.make(BlogPost, image="test.png")
        self.banner = mommy.make(Banner, image="test.png")
        self.newsletter = mommy.make(Newsletter)
        self.consultants = mommy.make(Consultant, image="test.png")
        self.appointment = mommy.make(Appointment, appointment_date=datetime.datetime.now())
        self.input = mommy.make(Input)

    def test_login(self):
        data = {
            'user': 'test',
            'pas': 'test'
        }
        result = self.client.post(reverse('medicalpanel:login'), data=data)
        self.assertTrue(result)

    def test_blog_get(self):
        result = self.client.get(reverse('medicalpanel:blog'))
        self.assertTrue(result)

    def test_blog_post(self):
        image = open(os.path.join(settings.MEDIA_ROOT, 'b1.jpg'), 'rb')
        bimage = base64.b64encode(image.read())
        data = {
            'blog_title': 'test',
            'image': str(bimage),
            'blog_description': 'testing',
            'author': 'tester'

        }
        result = self.client.post(reverse('medicalpanel:blog'), data=data, content_type='application/json')
        self.assertTrue(result)

    def test_banner_get(self):
        result = self.client.get(reverse('medicalpanel:banner'))
        self.assertTrue(result)

    def test_banner_post(self):
        image = open(os.path.join(settings.MEDIA_ROOT, 'b1.jpg'), 'rb')
        bimage = base64.b64encode(image.read())
        data = {
            'title': 'test',
            'code': 'test',
            'short_description': 'test',
            'image': str(bimage),
            'number': 'testing'
        }
        result = self.client.post(reverse('medicalpanel:banner'), data=data, content_type='application/json')
        self.assertTrue(result)

    def test_newsletter_get(self):
        result = self.client.get(reverse('medicalpanel:newsletter'))
        self.assertTrue(result)

    def test_newsletter_post(self):
        data = {
            'email': 'test@example.com',
        }
        result = self.client.post(reverse('medicalpanel:newsletter'), data=data)
        self.assertEqual(result.url, reverse('medicalpanel:newsletter-view'))

    def test_consultant_get(self):
        result = self.client.get(reverse('medicalpanel:consultant'))
        self.assertTrue(result)

    def test_consultant_post(self):
        image = open(os.path.join(settings.MEDIA_ROOT, 'b1.jpg'), 'rb')
        bimage = base64.b64encode(image.read())
        data = {
            'name': 'test',
            'image': str(bimage),
            'description': 'testing'
        }
        result = self.client.post(reverse('medicalpanel:consultant'), data=data, content_type='application/json')
        self.assertTrue(result)

    def test_appointment_get(self):
        result = self.client.get(reverse('medicalpanel:appointment'))
        self.assertTrue(result)

    def test_appointment_post(self):
        data = {
            'patient_name': 'test',
            'phone': 'test',
            'appointment_date': datetime.datetime.now(),
            'message' : 'test'
        }
        result = self.client.post(reverse('medicalpanel:appointment'), data=data)
        self.assertTrue(result)

    def test_input_get(self):
        result = self.client.get(reverse('medicalpanel:inputs'))
        self.assertTrue(result)

    def test_input_post(self):
        data = {
            'clients_served': '111',
            'x_rays_done': '111',
            'worldwide_stuff': '111',
            'lives_saved': '111'
        }
        result = self.client.post(reverse('medicalpanel:inputs'), data=data)
        self.assertTrue(result)

    def test_logout(self):
        result = self.client.get(reverse('medicalpanel:logout'))
        self.assertRedirects(result, reverse('medicalpanel:login'))
