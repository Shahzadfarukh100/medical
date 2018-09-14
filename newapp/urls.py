from django.conf.urls import url
from .views import IndexView, SubscribeView


app_name = 'newapp'

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),

    url(r'subscribe/$', SubscribeView.as_view(), name='subscribe'),
]
