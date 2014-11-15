""" Admin classes for SMYT test app. """


from django.contrib import admin

from . import models


admin.site.register(models.models)
