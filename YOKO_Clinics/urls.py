from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("bookings", views.bookings, name="bookings"),
    path("vacation", views.vacation, name="vacation"),
    path("appointment/<int:id>", views.appointment, name="appointment"),
    path("profile/<int:id>", views.profile, name="profile"),
    path("appointments", views.appointments, name="appointments"),
    path("search", views.search, name="search"),
    #fetch
    path("<str:banana>/edit_profile", views.edit_profile, name="edit_profile")
]