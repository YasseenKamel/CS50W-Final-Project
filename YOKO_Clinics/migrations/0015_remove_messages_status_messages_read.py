# Generated by Django 4.2.6 on 2023-12-31 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('YOKO_Clinics', '0014_rename_doctor_id_messages_receiver_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='messages',
            name='status',
        ),
        migrations.AddField(
            model_name='messages',
            name='read',
            field=models.BooleanField(default=False),
        ),
    ]
