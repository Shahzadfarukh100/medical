from django.views import generic
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from newapp.forms import AppointmentForm, NewsletterForm
from newapp import models as new_model
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse, reverse_lazy


class IndexView(generic.FormView):
    template_name = 'newapp/index.html'
    form_class = AppointmentForm
    success_url = reverse_lazy('newapp:index')

    def dispatch(self, request, *args, **kwargs):
        self.is_ajax = 'ajax' in request.POST
        return super(IndexView, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        appointment = form.save(commit=True)
        appointment.doctor = form.cleaned_data['doctor']
        appointment.save()
        if self.is_ajax:
            return JsonResponse({'status': 'ok', 'message': 'Appointment Confirmed.'})
        return super(IndexView, self).form_valid(form)

    def form_invalid(self, form):
        if self.is_ajax:
            error_message = dict(
                [(key, [error for error in value]) for key, value in form.errors.items()])
            return JsonResponse({'status': 'error', "message": error_message})

            # return JsonResponse({'status': 'error', 'message': form.errors})
        return super(IndexView, self).form_invalid(form)

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['appointment'] = new_model.Appointment.objects.all()
        context['banner_header'] = new_model.Banner.objects.filter(code=new_model.Banner.HEADER)
        context['banner_feature'] = new_model.Banner.objects.filter(code=new_model.Banner.FEATURE)
        context['banner_consultants'] = new_model.Banner.objects.filter(code=new_model.Banner.CONSULTANTS)
        context['banner_recent_blog'] = new_model.Banner.objects.filter(code=new_model.Banner.RECENT_BLOG)
        context['banner_contact'] = new_model.Banner.objects.filter(code=new_model.Banner.CONTACT_US)
        context['banner_footer'] = new_model.Banner.objects.filter(code=new_model.Banner.FOOTER)
        context['consultants'] = new_model.Consultant.objects.all()
        context['inputs'] = new_model.Input.objects.all()
        context['blog_post'] = new_model.BlogPost.objects.all()
        context['newsletter_form'] = NewsletterForm
        return context


class SubscribeView(generic.View):

    def post(self, request, *args, **kwargs):
        newsletter_form = NewsletterForm(data=request.POST)
        if newsletter_form.is_valid():
            newsletter_form.save(commit=True)
            to_email = newsletter_form.cleaned_data.get('email')
            current_site = get_current_site(request)
            mail_subject = 'Congratulations'
            message = render_to_string('newapp/newletter_email.html', {
                'email': to_email,
                'domain': current_site.domain,
            })
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()
            return JsonResponse({'status': 'ok', 'message': 'You are Subscribed to newsletter now.'})
        else:
            return JsonResponse({'status': 'error', 'message': newsletter_form.errors})
