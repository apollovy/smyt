""" Views for SMYK app. """


import sys

from rest_framework import viewsets

from . import (
    models,
    serializers,
)


__module__ = sys.modules[__name__]


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
                queryset=model.objects.all(),
                serializer_class=getattr(
                    serializers, serializers.get_serializer_name_by_model(
                        model
                    )
                )
            )
        )
    )
