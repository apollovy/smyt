""" Models for SMYT test app. """


import os.path
import sys
import yaml

from django.db import models


__module__ = sys.modules[__name__]

DEFAULT_FIELD_NAMES_MAPPING = {
    'title': 'verbose_name',
}

FIELD_TYPES_MAPPING = {
    'char': {
        'class': models.CharField,
        'mapping': DEFAULT_FIELD_NAMES_MAPPING,
        'defaults': {
            'max_length': 100,
        },
    },
    'int': {
        'class': models.IntegerField,
        'mapping': DEFAULT_FIELD_NAMES_MAPPING,
    },
    'date': {
        'class': models.DateField,
        'mapping': DEFAULT_FIELD_NAMES_MAPPING,
    }
}


LOADED_YAML = yaml.load(
    file(
        os.path.join(os.path.dirname(__file__), 'models.yaml')
    ).read()
)


def _get_model_name(_str):
    return _str.capitalize()


for model_name, params in LOADED_YAML.iteritems():
    class_name = _get_model_name(model_name)
    setattr(
        __module__,
        class_name,
        type(
            class_name,
            (models.Model, ),
            dict(
                [('__module__', __name__, )] + [
                    (
                        field['id'],
                        FIELD_TYPES_MAPPING[field['type']]['class'](
                            **dict(
                                FIELD_TYPES_MAPPING[field['type']].get(
                                    'defaults', {}
                                ).items() +
                                [
                                    (value, field[key]) for key,
                                    value in FIELD_TYPES_MAPPING[
                                        field['type']
                                    ]['mapping'].iteritems()
                                ]
                            )
                        ),
                    )
                    for field in params['fields']
                ]
            )
        ),
    )

models = [
    getattr(__module__, model_name) for model_name in [
        _get_model_name(model_name) for model_name in LOADED_YAML
    ]
]
