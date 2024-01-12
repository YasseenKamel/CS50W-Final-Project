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
#### Search
Once logged in as a patient, the user can search for doctors based on:
- Country, state, city
- Doctor name as a substring
- rating from 0 and above to 5 stars
- Specialty and subspecialty

The search fields are not required to be filled but will only act as a filter. Once the results are displayed, the user can click on any doctor to open their profile.
#### Doctor's profile and booking
Once in the doctor's profile, the patient will be able to see all the information about that doctor and the reviews about them. When the `Book` button is pressed, the user is prompted with a calendar that shows the doctor's schedule which can be exited by clicking anywhere away from it.
Colors in it represent:
- Day off
- An empty shift
- A busy shift

The colours are scaled between the empty and busy shifts to give a feeling of how busy the doctor is on that day. By clicking on a day, the user is given the doctor's working times on that day and prompted to write an appropriate description for his case and to book. To cancel this prompt, one can press on the cancel button or away from the prompt window. Once the booking has been submitted, it's up to the doctor whether to accept or reject it.
#### Appointments
In the appointments page, the patient can filter through the appointment based on these criteria:
- `Upcoming Appointments` which shows the future appointments which have been confirmed by the doctor, and the patient can cancel the appointment for any reason.
- `Past Appointments` which shows the past appointments which have been confirmed and finished.
- `Canceled Appointments` which shows the appointments which got cancelled either by the doctor or the patient.
- `Pending Requests` which shows the requests that have not yet been confirmed or rejected by the doctor, and the patient can choose to cancel them at any time.

And by date.
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
