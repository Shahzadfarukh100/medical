from django import forms
from .models import *


class AppointmentForm(forms.ModelForm):

    class Meta:
        model = Appointment
        fields = ['patient_name', 'phone', 'appointment_date', 'message']
        widgets = {
            'patient_name': forms.TextInput(attrs={'id': 'patient', 'class': 'form-control mt-20',
                                                   'onfocus': "this.placeholder = ''",  'placeholder': 'Patient Name'}),
            'phone': forms.TextInput(attrs={'id': 'phn', 'class': 'form-control mt-20',
                                            'onfocus': "this.placeholder = ''",  'placeholder': 'Phone'}),
            'appointment_date': forms.DateInput(attrs={'id': 'appointment', 'class': 'form-control mt-20 datepicker',
                                                    'onfocus': "this.placeholder = ''", 'placeholder': 'Appointment'}),
            'message': forms.Textarea(attrs={'id': 'msg', 'class': 'form-control mt-20',
                                             'onfocus': "this.placeholder = ''",  'placeholder': 'Message'})
        }

    field_order = ['patient_name', 'phone', 'appointment_date', 'message']


class NewsletterForm(forms.ModelForm):

    class Meta:
        model = Newsletter
        fields = ['email']
        widgets = {
            'email': forms.EmailInput(attrs={'id': 'em', 'type': 'email', 'class': 'form-control', 'onfocus': "this.placeholder = ''",
                                             'placeholder': 'Enter Email'})
        }

    def clean_email(self):
        email = self.cleaned_data['email']
        if Newsletter.objects.filter(email=email).exists():
            raise forms.ValidationError("This Email is already Subscribed.")
        return email
