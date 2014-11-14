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


for model_name, params in yaml.load(
    file(
        os.path.join(os.path.dirname(__file__), 'models.yaml')
    ).read()
).iteritems():
    class_name = model_name.capitalize()
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
