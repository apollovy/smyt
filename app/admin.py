""" Admin classes for SMYT test app. """


from django.contrib import admin

from . import models


admin.site.register([
    getattr(models, model_name) for model_name in models.__all__
])
