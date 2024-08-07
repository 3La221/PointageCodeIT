# Generated by Django 5.0.6 on 2024-07-02 13:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_pointing_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='pointing',
            name='status',
            field=models.CharField(choices=[('W', 'WORKING'), ('B', 'BREAK'), ('WAB', 'WORKING_AFTER_BREAK'), ('D', 'DONE')], default='W', max_length=20),
        ),
        migrations.AlterField(
            model_name='pointing',
            name='clock_in_time',
            field=models.DateTimeField(default=datetime.datetime(2024, 7, 2, 13, 27, 21, 426168, tzinfo=datetime.timezone.utc)),
        ),
    ]
