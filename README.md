# CS50W-Final-Project
This is my CS50W final project which is a booking system where doctors can make their accounts with their information, and patients can log in and book at certain doctors according to many factors.
## How to run
Running this command in the terminal will run the server on 127.0.0.1:8000.
```
python manage.py runserver
```
In order to run outside the local network the public IP address has to be added to YOKO/settings.py in 2 locations.
![image](https://github.com/user-attachments/assets/1defe1c5-1093-4c08-8f97-a69e72df5044)

Replace 197.48.122.100 with the public IP address and replace 192.168.1.11 with the local IP address.
To run, run this command with the local IP address followed by port (ex. 197.48.122.100:8000).
```
python manage.py runserver (local_IP_Address:Port)
```
Any user can open the website via the public IP address through the port 8000.

## Video demonstration
https://www.youtube.com/watch?v=B-5KUskOzfo

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

### Testings
I have tested this website on:
1. Windows
    - Firefox
    - Google Chrome
2. Android
    - Samsung Internet
    - Google Chrome
3. MacOS
    - Safari
    
## Files
### manage.py
This is the file that runs the server and it's given by default when creating a new django project.

### db.sqlite3
This is the database file. It contains a lot of data use to test the website during development and I chose to keep this data for the sake of demonstration. All users have a password of `123`
### YOKO_Clinics/admin.py
This file contains the data responsible for viewing the database in admin view properly.
### YOKO_Clinics/urls.py
This file contains all the urls for the website which includes both fetch api's and html pages.
### YOKO_Clinics/views.py
This file contains the functions responsible for running the server pages and api's.
It manages routes and data sent to pages either by api's or html rendering.
### YOKO_Clinics/models.py
This file contains the structure of the models in the database.
### YOKO_Clinics/admin.py
This file is a default django file which I added the admin user information in.
### YOKO_Clinics/templates/YOKO_Clinics/layout.html
This is the layout html which all the other html pages inherit from.
### YOKO_Clinics/templates/YOKO_Clinics/
All the other html files are corresponding to their name for their pages.
### YOKO_Clinics/static/YOKO_Clinics/Poppins/
This folder contains the data of the font I'm using in the website.
### YOKO_Clinics/static/YOKO_Clinics/styles.css
This is the style sheet for the entire website which includes mobile support as well.
### YOKO_Clinics/static/YOKO_Clinics/
All pictures in this folder are pictures used in the website both in dark mode and light mode.
### YOKO_Clinics/static/YOKO_Clinics/countries.json
This json file contains all the countries, states and cities.

Mainly used for:
- Location selection when making a doctor account.
- Searching for doctors by location.
- Editting the doctor profile which can edit this data.
### YOKO_Clinics/static/YOKO_Clinics/specialties.json
This json works the same as the previous json but contains the data of the specialties doctors can have on this website.
### YOKO_Clinics/static/YOKO_Clinics/logic.js
This file contains the main javascript which is used in all pages such as the javascript for dark and light modes.

### YOKO_Clinics/static/YOKO_Clinics/appointments.js
This js file is used for the `Appointments` page for the patients which is responsible for things like:
- Cancelling appointments
- Reviewing past appointments


### YOKO_Clinics/static/YOKO_Clinics/booking.js
This js file is responsible for the booking procedure which takes place when a patient is on a doctor's profile.

Features this file runs include:
- Functioning calendar for booking
- Colour coded days to view how busy the doctor is in a given day
- The ability to book a certain day


### YOKO_Clinics/static/YOKO_Clinics/bookings.js
This file is responsible for the `Bookings` page for the doctors.

It manages the ability to set durations for bookings and register them if valid.

### YOKO_Clinics/static/YOKO_Clinics/home.js
This file mainly manages the ability to cancel appointments from the doctor's side at `Home` page.

### YOKO_Clinics/static/YOKO_Clinics/index.js
This file manages the ability to search for doctors at `Home` page for patients.

### YOKO_Clinics/static/YOKO_Clinics/messages.js
This file is included in all html pages where the user is authenticated.

It manages the notifications feature which opens the inbox and marks messages as read after a few seconds.

### YOKO_Clinics/static/YOKO_Clinics/profile.js
This file mainly manages the ability of a doctor to edit their profile and makes sure their newly set schedule doesnt interfere with already set appointments.

### YOKO_Clinics/static/YOKO_Clinics/register.js
This file mainly manages the `Sign Up` page which includes:
- The swap between a doctor and a patient accounts
- The data fetched for the creation of the user

### YOKO_Clinics/static/YOKO_Clinics/reviews.js
This file is included in any `Profile` page of any doctor to load reviews in sets of 10.

### YOKO_Clinics/static/YOKO_Clinics/vacations.js
This file manages the `Vacations` page in the doctors' accounts.

It manages things like:
- The interactive calendar with day selection
- Prompting for vacation/schedule data
- Checking the validity of given data

## Distinctiveness and Complexity
I believe this project is distinct due to the fact that I got this idea as I waited for an appointment at a clinic myself, and all the features I've added are features I've come up with myself.

In terms of complexity, I believe it maches the project's requirements as I've added a decent amount of features and data which does not clash or bug in any way.

Moreover, I've made use of binary search to further optimise the code in a js file as well.

In conclusion, I mainly believe it suits the requirements due to the variety of data included and managed precisely without any form of bugging or clashing.
