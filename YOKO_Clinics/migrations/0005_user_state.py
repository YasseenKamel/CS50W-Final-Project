# Generated by Django 4.2.6 on 2023-11-28 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('YOKO_Clinics', '0004_alter_user_address_alter_user_bio_alter_user_city_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='state',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
