# Generated by Django 4.2.6 on 2023-12-28 12:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('YOKO_Clinics', '0012_messages_content'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bookings',
            name='type_id',
        ),
    ]
