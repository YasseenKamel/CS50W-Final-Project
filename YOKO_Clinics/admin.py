from django.contrib import admin
from .models import User,types,reviews,expertise,repeated_vacations,vacations,appointments,bookings,messages

class User_admin(admin.ModelAdmin):
    list_display = ("id" , "username" , "is_doctor" , "rating" , "country" , "state" , "city" , "address" , "bio" , "start_time" , "end_time" , "main_specialty")

class types_admin(admin.ModelAdmin):
    list_display = ("id" , "type_name")

class reviews_admin(admin.ModelAdmin):
    list_display = ("id" , "rating" , "patient_id" , "doctor_id" , "description")

class expertise_admin(admin.ModelAdmin):
    list_display = ("id" , "type_id" , "doctor_id")

class repeated_vacations_admin(admin.ModelAdmin):
    list_display = ("id" , "doctor_id" , "day")

class vacations_admin(admin.ModelAdmin):
    list_display = ("id" , "start_date" , "end_date" , "doctor_id" , "vacation")

class appointments_admin(admin.ModelAdmin):
    list_display = ("id" , "patient_id" , "doctor_id" , "start_date" , "end_date" , "description" , "left_review" , "status")

class bookings_admin(admin.ModelAdmin):
    list_display = ("id" , "patient_id" , "doctor_id" , "day" , "description" , "date_created" , "status")

class messages_admin(admin.ModelAdmin):
    list_display = ("id" , "patient_id" , "doctor_id" , "status")

# Register your models here.
admin.site.register(User, User_admin)
admin.site.register(types, types_admin)
admin.site.register(reviews, reviews_admin)
admin.site.register(expertise, expertise_admin)
admin.site.register(repeated_vacations, repeated_vacations_admin)
admin.site.register(vacations, vacations_admin)
admin.site.register(appointments, appointments_admin)
admin.site.register(bookings, bookings_admin)
admin.site.register(messages, messages_admin)
