""" RESTful serializers for SMYT project. """


import sys

from rest_framework import serializers

from . import models


__module__ = sys.modules[__name__]


def get_serializer_name_by_model(_model):
    """ Return name of serializer for a model. """
    return '{}Serializer'.format(_model.__name__)


for model in models.models:
    class_name = get_serializer_name_by_model(model)
    setattr(
        __module__,
        class_name,
        type(
            class_name,
            (serializers.HyperlinkedModelSerializer, ),
            dict(
                Meta=type(
                    'Meta',
                    (object, ),
                    dict(model=model, __module__=__file__)
                ),
                __module__=__file__,
            )
        )
    )
