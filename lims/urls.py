from django.conf.urls import patterns, include, url
from lims import views

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),

    # Login / logout.
    # Note: login.html is actually served by the reports project:
    # that is, reports/templates/login.html version; 
    # this is done because at this time only the reports project has
    # all of the necessary css and javascript installed
    (r'^accounts/login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    url(r'^accounts/logout/$', views.logout_page, name='logout'),
    
    url(r'^lims/$', views.main, name="home"),
    url(r'^db/', include('db.urls')),
    url(r'^reports/', include('reports.urls')),
)
