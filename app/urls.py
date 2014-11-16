""" Urls for SMYK app. """


from django.conf.urls import (
    patterns,
    include,
    url,
)
from django.contrib import admin

from rest_framework import routers

from . import (
    models,
    views,
)


router = routers.DefaultRouter()

for model in models.models:
    router.register(
        r'{}'.format(model.__name__.lower()),
        getattr(views, views.get_viewset_name_for_model(model))
    )

urlpatterns = patterns(
    '',
    url(r'^$', views.IndexView.as_view(), name='index'),  # noqa
    url(r'^admin/', include(admin.site.urls)),
    url(r'^models/$', views.models_json, name='models-list'),
    url(r'^', include(router.urls)),
)
