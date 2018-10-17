from django import forms
from django.contrib.auth.models import Group
from .models import *
from medicalpanel.models import User


class SignupForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'groups']
        labels = {
            'first_name': '',
            'last_name': '',
            'email': '',
            'password': '',
            'groups': '',
        }

        help_texts = {
            'groups': '',
        }
        widgets = {
            'first_name': forms.TextInput(attrs={'id': 'fn', 'type': 'text', 'class': 'form-control',
                                             'onfocus': "this.placeholder = ''", 'placeholder': 'First Name',
                                             'onblur': "this.placeholder = 'First Name'"}),

            'last_name': forms.TextInput(attrs={'id': 'ln', 'type': 'text', 'class': 'form-control',
                                                 'onfocus': "this.placeholder = ''", 'placeholder': 'Last Name',
                                                 'onblur': "this.placeholder = 'Last Name'"}),

            'email': forms.EmailInput(attrs={'id': 'em', 'type': 'email', 'class': 'form-control',
                                             'onfocus': "this.placeholder = ''", 'placeholder': 'Enter Email',
                                             'onblur': "this.placeholder = 'Enter Email'"}),

            'password': forms.PasswordInput(attrs={'id': 'pas', 'type': 'password', 'class': 'form-control',
                                             'onfocus': "this.placeholder = ''", 'placeholder': 'Enter Password',
                                             'onblur': "this.placeholder = 'Enter Password'"}),
            'groups': forms.Select(attrs={'class': 'form-control'})
        }

    def save(self, commit=True):
        instance = super(SignupForm, self).save(commit=False)
        instance.is_superuser = True
        instance.set_password(self.cleaned_data['password'])
        instance.save()
        self.save_m2m()
        return instance


class AppointmentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(AppointmentForm, self).__init__(*args, **kwargs)
        self.fields['doctor'].choices = self.get_doctors()
        self.fields['doctor'].widget.attrs = {'class': 'form-control mt-20'}

    def get_doctors(self):
        docs = Group.objects.get(name='Doctor').user_set.all()
        doctors = [(0, 'Select Doctor')]
        for doc in docs:
            doctors.append((doc.id, doc.full_name))
        return doctors

    class Meta:
        model = Appointment
        fields = ['patient_name', 'phone', 'appointment_date', 'message', 'doctor']
        widgets = {
            'patient_name': forms.TextInput(attrs={'id': 'patient', 'class': 'form-control mt-20',
                                                   'onfocus': "this.placeholder = ''", 'placeholder': 'Patient Name',
                                                   'onblur': "this.placeholder = 'Patient name'"}),
            'phone': forms.TextInput(attrs={'id': 'phn', 'class': 'form-control mt-20',
                                            'onfocus': "this.placeholder = ''",  'placeholder': 'Phone',
                                            'onblur': "this.placeholder = 'Phone'"}),
            'appointment_date': forms.DateInput(attrs={'id': 'appointment', 'class': 'form-control mt-20 datepicker',
                                                    'onfocus': "this.placeholder = ''", 'placeholder': 'Appointment',
                                                       'onblur': "this.placeholder = 'Appointment'"}),
            'message': forms.Textarea(attrs={'id': 'msg', 'class': 'form-control mt-20',
                                             'onfocus': "this.placeholder = ''",  'placeholder': 'Message',
                                             'onblur': "this.placeholder = 'Message'"})
        }

    field_order = ['patient_name', 'phone', 'appointment_date', 'message']


class NewsletterForm(forms.ModelForm):

    class Meta:
        model = Newsletter
        fields = ['email']
        widgets = {
            'email': forms.EmailInput(attrs={'id': 'em', 'type': 'email', 'class': 'form-control',
                                             'onfocus': "this.placeholder = ''", 'placeholder': 'Enter Email',
                                             'onblur': "this.placeholder = 'Enter Email'"})
        }

    def clean_email(self):
        email = self.cleaned_data['email']
        if Newsletter.objects.filter(email=email).exists():
            raise forms.ValidationError("This Email is already Subscribed.")
        return email
