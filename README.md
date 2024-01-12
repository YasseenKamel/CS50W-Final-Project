# CS50W-Final-Project
This is my CS50W final project which is a booking system where doctors can make their accounts with their information, and patients can log in and book at certain doctors according to many factors.
## How to run
Running this command in the terminal will run the server on 127.0.0.1:8000.
```
python manage.py runserver
```
## Description
When a new user opens the website, they'll be prompted to log in or sign up. When signing up, the user can chose either to make a doctor account or a patient account. The patient account is like any normal account, but the doctor account contains many more information such as:
- Country, state, city
- Address
- An optional bio about the doctor
- Normal working times (can be overnight as well)
- Normal working days of the week
- The doctor's main specialty
- The subspecialties they work in
### Patient
### Doctor
## Files
### manage.py
This is file that runs the server and it's given by default when creating a new django project.
### db.sqlite3
This is the database file. It contains a lot of data use to test the website during development and I chose to keep this data for the sake of demonstration. All users have a password of `123`
### YOKO_Clinics/admin.py
This file contains the data responsible for viewing the database in admin view properly.
### YOKO_Clinics/urls.py
This file contains all the urls for the website which includes both fetch api's and html pages.
### YOKO_Clinics/views.py
This file contains the functions responsible for running the server pages and api's.
#### login_view
This function is responsible for rendering the log in page and logging in the user if successful.
#### logout_view
This function is responsible just for logging out the user.
#### register
This function is responsible for registering the user and logging them in for both types of users (patients and doctors).
