# Generated by Django 5.0.6 on 2024-07-02 13:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_pointing_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pointing',
            name='code',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pointings', to='api.code'),
        ),
    ]