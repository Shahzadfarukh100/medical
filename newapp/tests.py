from django.test import TestCase
from django.utils import timezone
from .forms import *
from .views import *
from model_mommy import mommy


class TestModel(TestCase):

    def test_string_representation_appointment(self):
        appointment = Appointment(patient_name="Aleem")
        self.assertEqual(str(appointment), appointment.patient_name)

    def test_string_representation_newsletter(self):
        newsletter = Newsletter(email="xyz@example.com")
        self.assertEqual(str(newsletter), newsletter.email)

    def test_string_representation_banner(self):
        banner = Banner(title="Title", code="Header")
        self.assertEqual(str(banner), banner.title+'-'+banner.code)

    def test_string_representation_blogpost(self):
        blog = BlogPost(blog_title="Title")
        self.assertEqual(str(blog), blog.blog_title)

    def test_string_representation_consultant(self):
        consultant = Consultant(name="Aleem")
        self.assertEqual(str(consultant), consultant.name)

    def test_string_representation_input(self):
        consultant = Input()
        self.assertEqual(str(consultant), "Input")


class TestForm(TestCase):

    def test_appointment_form_fields(self):
        form = AppointmentForm()
        self.assertEqual(len(form.fields), 4)
        self.assertIn('patient_name', form.fields.keys())
        self.assertIn('phone', form.fields.keys())
        self.assertIn('appointment_date', form.fields.keys())
        self.assertIn('message', form.fields.keys())

    def test_appointment_form_valid(self):
        data = {
            'patient_name': 'test',
            'phone': '00000000000',
            'appointment_date': timezone.now(),
            'message': 'hello world'
        }
        form = AppointmentForm(data=data)
        self.assertTrue(form.is_valid())

    def test_appointment_form_invalid(self):
        data = {
            'patient_name': 'test',
            'appointment_date': '2018',
            'message': 'hello world'
        }
        form = AppointmentForm(data=data)
        self.assertFalse(form.is_valid())

    def test_newsletter_form_fields(self):
        form = NewsletterForm()
        self.assertEqual(len(form.fields), 1)
        self.assertIn('email', form.fields.keys())

    def test_newsletter_form_valid(self):
        data = {
            'email': 'test@example.com'
        }
        form = NewsletterForm(data=data)
        self.assertTrue(form.is_valid())


class TestViews(TestCase):

    def setUp(self):
        self.appointment = mommy.make(Appointment, patient_name='Test')
        mommy.make(Input)

    def test_index_view(self):
        result = self.client.get(reverse('newapp:index'))
        self.assertEqual(len(result.context['appointment']), 1)
        self.assertEqual(len(result.context['inputs']), 1)
        self.assertTemplateUsed(result, 'newapp/index.html')

    def test_form_valid(self):
        data = {
            'patient_name': 'test',
            'phone': '00000000000',
            'appointment_date': timezone.now().date(),
            'message': 'hello world'
        }
        result = self.client.post(reverse('newapp:index'), data=data)
        self.assertRedirects(result, reverse('newapp:index'))

    def test_form_invalid(self):
        data = {
            'patient_name': 'test',
            'phone': '00000000000',
            'appointment_date': "test date",
            'message': 'hello world'
        }
        result = self.client.post(reverse('newapp:index'), data=data)
        self.assertIn("Enter a valid date.", str(result.context['form'].errors))

    def test_subscribe(self):
        data = {
            'email': 'xyz@example.com'
        }
        result = self.client.post(reverse('newapp:subscribe'), data=data)
        self.assertTrue(result)





