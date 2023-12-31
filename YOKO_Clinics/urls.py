from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("bookings", views.bookings1, name="bookings"),
    path("vacation", views.vacation, name="vacation"),
    path("appointment/<int:id>", views.appointment, name="appointment"),
    path("profile/<int:id>", views.profile, name="profile"),
    path("appointments", views.appointments1, name="appointments"),
    path("search", views.search, name="search"),
    #fetch
    path("<str:banana>/edit_profile", views.edit_profile, name="edit_profile"),
    path("get_cal_data", views.get_cal_data, name="get_cal_data"),
    path("profile/get_cal_data1", views.get_cal_data1, name="get_cal_data1"),
    path("profile/book_appointment", views.book_appointment, name="book_appointment"),
    path("get_selected", views.get_selected, name="get_selected"),
    path("profile/get_selected", views.get_selected, name="get_selected"),
    path("booking_final", views.booking_final, name="booking_final"),
    path("vacation_add", views.vacation_add, name="vacation_add")
]