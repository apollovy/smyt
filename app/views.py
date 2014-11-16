""" Views for SMYK app. """


import sys
import json

from django.http.response import HttpResponse
from django.core.urlresolvers import reverse_lazy
from django.views.generic import TemplateView

from rest_framework import viewsets

from . import (
    models,
    serializers,
)


__module__ = sys.modules[__name__]


MODELS_JSON = None

def _get_models_json():
    """ Cache value of models json and prevent circular import. """
    global MODELS_JSON
    MODELS_JSON = json.dumps(
        dict(
            [
                (key, dict(value.items() + [
                    ('url', str(reverse_lazy('{}-list'.format(key)))),
                    ('name', key),
                ])) for key, value in models.LOADED_YAML.iteritems()
            ]
        )
    ) if not MODELS_JSON else MODELS_JSON
    return MODELS_JSON


class IndexView(TemplateView):

    """ Index of app. """

    template_name = 'app/index.html'


def models_json(request):
    """ Return response with json list of models. """
    response = HttpResponse(_get_models_json())
    response['Content-Type'] = 'application/json'
    return response


def get_viewset_name_for_model(_model):
    """ Return name of Viewset for given model. """
    return '{}ViewSet'.format(_model.__name__)


for model in models.models:
    class_name = get_viewset_name_for_model(model)
    setattr(
        __module__,
        class_name,
        type(
            class_name,
            (viewsets.ModelViewSet, ),
            dict(
                model=model,
                serializer_class=getattr(
                    serializers, serializers.get_serializer_name_by_model(
                        model
                    )
                )
            )
        )
    )
