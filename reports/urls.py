from django.conf.urls import patterns, url, include
from reports import views
from tastypie.api import Api

from reports.api import MetaHashResource, VocabulariesResource, ResourceResource,\
    ApiLogResource, UserResource, UserGroupResource, PermissionResource


v1_api = Api(api_name='v1')
v1_api.register(MetaHashResource())
v1_api.register(VocabulariesResource())
v1_api.register(ResourceResource())
v1_api.register(ApiLogResource())
v1_api.register(UserResource())
v1_api.register(UserGroupResource())
v1_api.register(PermissionResource())

urlpatterns = patterns('',
#     url(r'^$', views.main, name="home"),
    (r'^api/', include(v1_api.urls)),
)