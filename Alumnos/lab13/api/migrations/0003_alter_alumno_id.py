# Generated by Django 3.2 on 2023-06-19 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20230619_1049'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alumno',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
