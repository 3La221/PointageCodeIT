# Generated by Django 5.0.6 on 2024-07-02 10:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_rename_date_out_pointing_break_end_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pointing',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
