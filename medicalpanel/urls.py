from django.conf.urls import url
from .views import *
from . import views


app_name = 'medicalpanel'

urlpatterns = [
    url('login/', AppLoginView.as_view(), name='login'),

    url('dashboard/', DashboardView.as_view(), name='dashboard'),

    url('api/blog/', BlogGetView.as_view(), name='blog'),

    url(r'api/retrieveblog/(?P<pk>[0-9]+)$', BlogRUDView.as_view(), name='blog-rud-post'),

    url('api/banner/', BannerGetView.as_view(), name='banner'),

    url(r'api/retrievebanner/(?P<pk>[0-9]+)$', BannerRUDView.as_view(), name='banner-rud-post'),

    url('banns/', DBannerView.as_view(), name='Dbans-view'),

    url('api/consultant/', ConsultantGetView.as_view(), name='consultant'),

    url(r'api/retrieveconsultant/(?P<pk>[0-9]+)$', ConsultantRUDView.as_view(), name='consultant-rud-post'),

    url('consultant/', DConsulantView.as_view(), name='consultant-view'),

    url('api/appointment/', AppointmentGetView.as_view(), name='appointment'),

    url(r'api/retrieveappointment/(?P<pk>[0-9]+)$', AppointmentRUDView.as_view(), name='appointment-rud-post'),

    url('appointment/', DAppointmentView.as_view(), name='appointment-view'),

    url('api/newsletter/', NewsletterGetView.as_view(), name='newsletter'),

    url(r'api/retrievenewsletter/(?P<pk>[0-9]+)$', NewsletterRUDView.as_view(), name='newsletter-rud-post'),

    url('newsletter/', DNewsletterView.as_view(), name='newsletter-view'),

    url('api/input/', InputGetView.as_view(), name='inputs'),

    url(r'api/retrieveinput/(?P<pk>[0-9]+)$', InputRUDView.as_view(), name='input-rud-post'),

    url('inputs/', DInputView.as_view(), name='input-view'),

    url('logout/', views.logout, name='logout'),

]
