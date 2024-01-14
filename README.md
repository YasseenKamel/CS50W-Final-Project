# CS50W-Final-Project
This is my CS50W final project which is a booking system where doctors can make their accounts with their information, and patients can log in and book at certain doctors according to many factors.
## How to run
Running this command in the terminal will run the server on 127.0.0.1:8000.
```
python manage.py runserver
```
## Description
When a new user opens the website, they'll be prompted to log in or sign up.

When signing up, the user can chose either to make a doctor account or a patient account.

The patient account is like any normal account, but the doctor account contains many more information such as:
- Country, state, city
- Address
- An optional bio about the doctor
- Normal working times (can be overnight as well)
- Normal working days of the week
- The doctor's main specialty
- The subspecialties they work in
### Patient
1. #### Search
    Once logged in as a patient, the user can search for doctors based on:
    - Country, state, city
    - Doctor name as a substring
    - rating from 0 and above to 5 stars
    - Specialty and subspecialty
    
    The search fields are not required to be filled but will only act as a filter.
    
    Once the results are displayed, the user can click on any doctor to open their profile.
    #### Doctor's profile and booking
    Once in the doctor's profile, the patient will be able to see all the information about that doctor and the reviews about them.
    
    When the `Book` button is pressed, the user is prompted with a calendar that shows the doctor's schedule which can be exited by clicking anywhere away from it.
    Colors in it represent:
    - Day off
    - An empty shift
    - A busy shift
    
    The colours are scaled between the empty and busy shifts to give a feeling of how busy the doctor is on that day.
    
    By clicking on a day, the user is given the doctor's working times on that day and prompted to write an appropriate description for his case and to book.
    
    To cancel this prompt, one can press on the cancel button or away from the prompt window. Once the booking has been submitted, it's up to the doctor whether to accept or reject it.
2. #### Appointments
    In the appointments page, the patient can filter through the appointment based on these criteria:
    - `Upcoming Appointments` which shows the future appointments which have been confirmed by the doctor, and the patient can cancel the appointment for any reason.
    - `Past Appointments` which shows the past appointments which have been confirmed and finished.
    - `Canceled Appointments` which shows the appointments which got cancelled either by the doctor or the patient.
    - `Pending Requests` which shows the requests that have not yet been confirmed or rejected by the doctor, and the patient can choose to cancel them at any time.
    - `Earliest` which indicates how to sort the results.
    - `Latest` which indicates how to sort the results.
    
    Past appointments can be rated by clicking the review button and entering a review with a rating out of 5 stars.
    
    This review will affect the doctor's overall rating and can be seen in the reviews sesction under the doctor's profile.
### Doctor
1. #### Home
    Once logged in as a doctor, the user will be able to see all his apointments and filter them according to:
    - Upcoming Appointments (earliest or latest)
    - Past Appointments (earliest or latest)
    
    Upcoming appointments have the option to be cancelled in case the doctor could not make it there.
2. #### Bookings
    This tab will show the number of bookings which are still pending to the doctor in the navigation menu. When opened, this page displays all incoming requests and the doctor can sort them by:
    - Date created (earliest or latest)
    - Date requested for the booking (earliest or latest)
    
    The doctor can choose whether to accept the booking or reject it.
    
    When accepting a booking, the doctor will be prompted to input the time expected for this appointment based on the description given by the patient in this format : `HH:MM`.
    
    If there is not enough time in the doctor's schedule for the prompted time, the doctor gets an error message indicating the maximum time an appointment can be to fit his schedule for that day.
    
    Otherwise, if the duration for the appointment is valid, the doctor gets a successful alert which says when the appointment will take place during his schedule.
3. #### Vacations
    On this page, the doctor can manage his schedule at any day or month.
    
    If the doctor clicks on a single day which is not in the past, they will be prompted to enter their new working times for that day or whether or not they wish to take the entire day off, as well as their working times for that day will be indicated.
    
    Moreover, the doctor can select multiple days on the calendar (however they must click a single day if they want to know their schedule for that specific day) and set their working times for all the days simultaneously.
    
    If the newly set working times will get in the way of an already confirmed appointment, the doctor will be warned for each appointment and given the option to set their working times anyway, cancelling the mentioned appointments.
### Notifications
This feature is present for both types of users, where there is a bell icon right next to their username. ![unread](https://github.com/YasseenKamel/CS50W-Final-Project/assets/136619329/e5deb152-7ed9-4e9c-8ab0-6b6308766dbd)

If there are new notifications, the bell icon will have a circle over it like so: ![unread](https://github.com/YasseenKamel/CS50W-Final-Project/assets/136619329/e87cbfb9-7924-4e85-87b9-c687f31cc44f)

When clicked, unread messages will be highlighted in yellow and fade out till normal color, which will mark them as read.

Messages may include:
- Rejection of booking requests to the patient.
- Cancelling of an appointment to either the doctor or the patient.
- Confirmation of a booking request for the patient.

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
