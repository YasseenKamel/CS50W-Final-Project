from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

# Create your models here.
class User(AbstractUser):
    is_doctor = models.BooleanField(default=False)
    rating = models.DecimalField(null=True, max_digits=3, decimal_places=2, default=0)
    country = models.CharField(null=True, max_length=100, blank=True)
    state = models.CharField(null=True, max_length=100, blank=True)
    city = models.CharField(null=True, max_length=100, blank=True)
    address = models.CharField(null=True, max_length=1000, blank=True)
    bio = models.CharField(null=True, max_length=10000, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)


class types(models.Model):
    type_name = models.CharField(max_length=1000)

class reviews(models.Model):
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    patient_id = models.IntegerField()
    doctor_id = models.IntegerField()
    description = models.CharField(max_length=10000)

class expertise(models.Model):
    type_id = models.IntegerField()
    doctor_id = models.IntegerField()

class repeated_vacations(models.Model):
    doctor_id = models.IntegerField()
    day = models.IntegerField(default=0)

class vacations(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    doctor_id = models.IntegerField()
    vacation = models.BooleanField()

class appointments(models.Model):
    patient_id = models.IntegerField()
    doctor_id = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    description = models.CharField(max_length=10000)
    left_review = models.BooleanField(default=False)

class bookings(models.Model):
    patient_id = models.IntegerField()
    doctor_id = models.IntegerField()
    day = models.DateField()
    description = models.CharField(max_length=10000)
    date_created = models.DateTimeField()
    type_id = models.IntegerField(default=0)
    status = models.CharField(max_length=100,default="Pending")

class messages(models.Model):
    patient_id = models.IntegerField()
    doctor_id = models.IntegerField()
    status = models.CharField(max_length=100)