# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='ohlol',
            field=models.CharField(default='ohlol', max_length=100, verbose_name='\u041e\u0439 \u0432\u0435\u0439!'),
            preserve_default=False,
        ),
    ]
