# Generated by Django 2.1.1 on 2018-09-10 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newapp', '0010_auto_20180910_1315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consultant',
            name='image',
            field=models.ImageField(upload_to=''),
        ),
    ]
