# Generated by Django 5.0.6 on 2024-07-04 04:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_pointing_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='color',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='code',
            name='meaning',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
