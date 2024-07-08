# Generated by Django 5.0.6 on 2024-07-04 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_code_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='role',
            field=models.CharField(blank=True, choices=[('DONE', 'DONE'), ('WORKING', 'WORKING'), ('BREAK', 'BREAK'), ('ABSENT', 'ABSENT'), ('OTHER', 'OTHER')], max_length=20, null=True),
        ),
    ]