from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.shortcuts import render
from django import forms
from django.urls import reverse
from django.contrib import messages
from django import forms
from django.core.paginator import Paginator
import datetime
from django.core.serializers import serialize
import json
from django.contrib.auth.decorators import login_required
from .models import User,types,reviews,expertise,repeated_vacations,vacations,appointments,bookings,messages
from django.http import JsonResponse
from django.db.models import Q
import calendar
import pytz
# Create your views here.

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        if User.objects.filter(username=username).count() != 1:
            return render(request, "YOKO_Clinics/login.html", {
                "message": "Invalid username and/or password."
            })
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.is_doctor:
                request.session['type'] = 'doctor'
            else:
                request.session['type'] = 'patient'
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "YOKO_Clinics/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "YOKO_Clinics/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "YOKO_Clinics/register.html", {
                "message": "Passwords must match."
            })
        user_cnt = User.objects.filter(username=username).count()
        if user_cnt != 0:
            return render(request, "YOKO_Clinics/register.html", {
                "message": "Username already taken."
            })
        user_cnt = User.objects.filter(email=email).count()
        if user_cnt != 0:
            return render(request, "YOKO_Clinics/register.html", {
                "message": "Email already taken."
            })
        # # Attempt to create new user
        if (request.POST.get('doctor', False) == 'on') == False:
            try:
                user = User.objects.create_user(username=username, email=email, password=password, is_doctor=False)
            except IntegrityError as e:
                print(f"IntegrityError: {e}")
                return render(request, "YOKO_Clinics/register.html", {
                    "message": "Username already taken."
                })
            login(request, user)
            request.session['type'] = 'patient'
            return HttpResponseRedirect(reverse("index"))
        else:
            country = request.POST.get('country')
            state = request.POST.get('state')
            city = request.POST.get('city')
            address = request.POST.get('address')
            bio = request.POST.get('bio')
            start_time = request.POST.get('start_time')
            end_time = request.POST.get('end_time')
            days = request.POST.getlist('days')
            specialties = request.POST.getlist('sub_specialties')
            offset = request.POST.get('timezoneOffset')
            if(len(str(start_time).split(':')) == 2):
                start_time = str(start_time) + ":00"
            if(len(str(end_time).split(':')) == 2):
                end_time = str(end_time) + ":00"
            start_temp = datetime.datetime.strptime(start_time, "%H:%M:%S")
            end_temp = datetime.datetime.strptime(end_time, "%H:%M:%S")
            start_time = (start_temp + datetime.timedelta(minutes=int(offset))).strftime("%H:%M:%S")
            end_time = (end_temp + datetime.timedelta(minutes=int(offset))).strftime("%H:%M:%S")
            if country == None or state == None or city == None or address == None or start_time == None or end_time == None or days == [] or specialties == []:
                return render(request, "YOKO_Clinics/register.html", {
                    "message": "Please fill in all fields."
                })
            if start_time == end_time:
                return render(request, "YOKO_Clinics/register.html", {
                    "message": "Start time cannot be equal to end time."
                })
            try:
                user = User.objects.create_user(username=username, email=email, password=password, is_doctor=True, country=country, state=state, city=city, address=address, bio=bio, start_time=start_time, end_time=end_time)
            except IntegrityError as e:
                print(f"IntegrityError: {e}")
                return render(request, "YOKO_Clinics/register.html", {
                    "message": "Username already taken."
                })
            login(request, user)
            for day in days:
                vac = repeated_vacations(doctor_id=request.user.id,day=day)
                vac.save()
            for specialty in specialties:
                spec = expertise(type_id=specialty,doctor_id=request.user.id)
                spec.save()
            request.session['type'] = 'doctor'
            return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "YOKO_Clinics/register.html")

@login_required
def index(request):
    bookings_cnt = bookings.objects.filter(doctor_id=request.user.id,status="Pending").count()
    return render(request, "YOKO_Clinics/index.html",{
        "bookings_cnt": bookings_cnt
    })

@login_required
def bookings1(request):
    sorting = -1
    order = 0
    books1 = []
    if request.GET.get('sort_by') != None and request.GET.get('sort_by') != 'No order':
        if request.GET.get('sort_by') == "Date created":
            sorting = 0
        else:
            sorting = 1
    if sorting == 1:
        if request.GET.get('order_by') == 'Ascending':
            books1 = bookings.objects.filter(doctor_id=request.user.id,status="Pending").order_by('day')
        else:
            books1 = bookings.objects.filter(doctor_id=request.user.id,status="Pending").order_by('-day')
            order = 1
    elif sorting == 0:
        if request.GET.get('order_by') == 'Ascending':
            books1 = bookings.objects.filter(doctor_id=request.user.id,status="Pending").order_by('date_created')
        else:
            books1 = bookings.objects.filter(doctor_id=request.user.id,status="Pending").order_by('-date_created')
            order = 1
    else:
        books1 = bookings.objects.filter(doctor_id=request.user.id,status="Pending")
    books = []
    for book in books1:
        patient = User.objects.get(id=book.patient_id)
        books.append({
            'id': book.id,
            'patient_id': book.patient_id,
            'doctor_id': book.doctor_id,
            'day': book.day,
            'description': book.description,
            'date_created': book.date_created.isoformat,
            'status': book.status,
            'patient_username': patient.username
        })
    paginator = Paginator(books, 10)
    page_num = request.GET.get('page')
    if page_num == None:
        page_num = 1
    page_obj = paginator.get_page(page_num)
    return render(request, "YOKO_Clinics/bookings.html",{
        'bookings_cnt': books1.count(),
        'page_obj': page_obj,
        'sorting': sorting,
        'order': order
    })

@login_required
def vacation(request):
    bookings_cnt = bookings.objects.filter(doctor_id=request.user.id,status="Pending").count()
    vacay = repeated_vacations.objects.filter(doctor_id=request.user.id).values_list('day',flat=True)
    days = [1,2,3,4,5,6,7]
    vaycays = []
    for i in days:
        if(i not in vacay):
            vaycays.append(i)
    return render(request, "YOKO_Clinics/vacations.html",{
        'current_time': datetime.datetime.now(),
        'repeated': vaycays,
        "bookings_cnt": bookings_cnt
    })
        


@login_required
def vacation_add(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        start = datetime.datetime.fromisoformat(data['start'][:-1])
        end = datetime.datetime.fromisoformat(data['end'][:-1])
        is_vacation = data['is_vacation']
        
        vacays = vacations.objects.filter((Q(start_date__date__lte=start.date(), end_date__date__gte=start.date()) | Q(start_date__date__lte=end.date(), end_date__date__gte=end.date()) | (Q(start_date__date__gte=start.date(), end_date__date__lte=end.date()))) & (Q(start_date__month=start.month, start_date__year=start.year) | Q(end_date__month=start.month, end_date__year=start.year)),vacation=True,doctor_id = request.user.id)
        altered = vacations.objects.filter((Q(start_date__date__lte=start.date(), end_date__date__gte=start.date()) | Q(start_date__date__lte=end.date(), end_date__date__gte=end.date()) | (Q(start_date__date__gte=start.date(), end_date__date__lte=end.date()))) & (Q(start_date__month=start.month, start_date__year=start.year) | Q(end_date__month=start.month, end_date__year=start.year)),vacation=False,doctor_id = request.user.id)
        appoints = appointments.objects.filter((~Q(status="Canceled")) & Q(start_date__date__lte=end.date(), start_date__date__gte=start.date()) & (Q(start_date__month=start.month, start_date__year=start.year) | Q(end_date__month=start.month, end_date__year=start.year)),doctor_id = request.user.id)
        for i in vacays:
            if i.start_date.date() >= start.date() and i.end_date.date() <= end.date():
                i.delete()
            elif i.start_date.date() < start.date() and i.end_date.date() > end.date():
                s1 = i.start_date
                idx = i.doctor_id
                e2 = i.end_date
                e1 = start - datetime.timedelta(days=1)
                s2 = end + datetime.timedelta(days=1)
                i.delete()
                item = vacations(start_date=s1,end_date=e1,doctor_id=idx,vacation=True)
                item.save()
                item = vacations(start_date=s2,end_date=e2,doctor_id=idx,vacation=True)
                item.save()
                #split and delete middle
            elif i.start_date.date() >= start.date() and i.start_date.date() <= end.date():
                i.start_date = i.start_date.replace(day=(end.day + 1))
                i.save()
                #trim start
            elif i.end_date.date() >= start.date() and i.end_date.date() <= end.date():
                i.end_date = i.end_date.replace(day=(start.day - 1))
                i.save()
                #trim end
        
        for i in altered:
            if i.start_date.date() >= start.date() and i.end_date.date() <= end.date():
                i.delete()
            elif i.start_date.date() < start.date() and i.end_date.date() > end.date():
                s1 = i.start_date
                idx = i.doctor_id
                e2 = i.end_date
                e1 = start - datetime.timedelta(days=1)
                s2 = end + datetime.timedelta(days=1)
                i.delete()
                item = vacations(start_date=s1,end_date=e1,doctor_id=idx,vacation=False)
                item.save()
                item = vacations(start_date=s2,end_date=e2,doctor_id=idx,vacation=False)
                item.save()
                #split and delete middle
            elif i.start_date.date() >= start.date() and i.start_date.date() <= end.date():
                i.start_date = i.start_date.replace(day=(end.day + 1))
                i.save()
                #trim start
            elif i.end_date.date() >= start.date() and i.end_date.date() <= end.date():
                i.end_date = i.end_date.replace(day=(start.day - 1))
                i.save()
                #trim end
        
        for i in appoints:
            i.status = "Canceled"
            i.save()
            msg = messages(patient_id=i.patient_id,doctor_id=i.doctor_id,status="Unread",content=("Your appointment has been canceled due to some circumstances. Please book your appointment again."))
            msg.save()

        item = vacations(start_date=start,end_date=end,doctor_id=request.user.id,vacation=is_vacation)
        item.save()
        return JsonResponse({'message': 'Vacation added successfully.'})


@login_required
def appointment(request,id):
    pass
    

@login_required
def profile(request,id):
    target = User.objects.get(id=id)
    if target.is_doctor == False:
        raise Http404("This page does not exist")
    if request.method == "POST":
        pass
    else:
        bookings_cnt = bookings.objects.filter(doctor_id=request.user.id,status="Pending").count()
        specialties = expertise.objects.filter(doctor_id=id).values_list('type_id',flat=True)
        day = repeated_vacations.objects.filter(doctor_id=id).values_list('day',flat=True)
        days = [0,0,0,0,0,0,0]
        for d in day:
            days[d - 1] = 1
        sub = []
        for specialty in specialties:
            sub.append(types.objects.get(id=specialty))
        vacay = repeated_vacations.objects.filter(doctor_id=id).values_list('day',flat=True)
        days1 = [1,2,3,4,5,6,7]
        vaycays = []
        for i in days1:
            if(i not in vacay):
                vaycays.append(i)
        return render(request, "YOKO_Clinics/profile.html",{
            'target': target,
            'sub': sub,
            'days': days,
            'repeated': vaycays,
            "bookings_cnt": bookings_cnt
        })
    
@login_required
def edit_profile(request,banana):
    if request.method == "PUT":
        data = json.loads(request.body)
        country = data['country']
        state = data['state']
        city = data['city']
        address = data['address']
        bio = data['bio']
        start_time = data['start_time']
        end_time = data['end_time']
        days = data['days']
        sub_specialties = data['sub_specialties']
        offset = data['timezoneOffset']
        if(len(str(start_time).split(':')) == 2):
            start_time = str(start_time) + ":00"
        if(len(str(end_time).split(':')) == 2):
            end_time = str(end_time) + ":00"
        start_temp = datetime.datetime.strptime(start_time, "%H:%M:%S")
        end_temp = datetime.datetime.strptime(end_time, "%H:%M:%S")
        start_time = (start_temp + datetime.timedelta(minutes=int(offset))).strftime("%H:%M:%S")
        end_time = (end_temp + datetime.timedelta(minutes=int(offset))).strftime("%H:%M:%S")
        appoints = appointments.objects.filter(~Q(status="Canceled"),doctor_id = request.user.id,start_date__gte=datetime.datetime.now())
        bad_appoints = []
        for i in appoints:
            #check if there's a special schedule set:
            altered = vacations.objects.filter(Q(start_date__lte=i.start_date,end_date__gte=i.end_date),doctor_id = request.user.id,vacation=False).count()
            if altered != 0:
                continue
            weekday = int(i.start_date.strftime("%w"))
            if days[weekday] == False:
                bad_appoints.append({
                    'id': i.id,
                    'patient_id': i.patient_id,
                    'doctor_id': i.doctor_id,
                    'start_date': i.start_date.isoformat(),
                    'end_date': i.end_date.isoformat(),
                    'description': i.description,
                    'left_review': i.left_review,
                    'status': i.status
                })
                continue
            start1 = i.start_date
            start1 = start1.replace(hour=datetime.datetime.strptime(start_time, "%H:%M:%S").time().hour, minute=datetime.datetime.strptime(start_time, "%H:%M:%S").time().minute, second=datetime.datetime.strptime(start_time, "%H:%M:%S").time().second)
            end1 = i.end_date
            if start_time > end_time:
                end1 += datetime.timedelta(days=1)
            end1 = end1.replace(hour=datetime.datetime.strptime(end_time, "%H:%M:%S").time().hour, minute=datetime.datetime.strptime(end_time, "%H:%M:%S").time().minute, second=datetime.datetime.strptime(end_time, "%H:%M:%S").time().second)
            if not(i.start_date >= start1 and i.end_date <= end1):
                bad_appoints.append({
                    'id': i.id,
                    'patient_id': i.patient_id,
                    'doctor_id': i.doctor_id,
                    'start_date': i.start_date.isoformat(),
                    'end_date': i.end_date.isoformat(),
                    'description': i.description,
                    'left_review': i.left_review,
                    'status': i.status
                })
                continue
        if len(bad_appoints) > 0:
            return JsonResponse({
                'message': 'Bad',
                'appointments': bad_appoints
            })
        doc = User.objects.get(id=request.user.id)
        if doc == None:
            return JsonResponse({'message': 'Failed'})
        doc.country = country
        doc.state = state
        doc.city = city
        doc.address = address
        doc.bio = bio
        doc.start_time = start_time
        doc.end_time = end_time
        doc.main_specialty = data['main_specialty']
        doc.save()
        repeated_vacations.objects.filter(doctor_id=request.user.id).delete()
        idx = 1
        for x in days:
            if x:
                item = repeated_vacations(doctor_id=request.user.id,day=idx)
                item.save()
            idx += 1
        expertise.objects.filter(doctor_id=request.user.id).delete()
        for x in sub_specialties:
            item = expertise(type_id=int(x),doctor_id=request.user.id)
            item.save()
        return JsonResponse({'message': 'Profile edited successfully.'})


@login_required
def appointments1(request):
    pass

@login_required
def search(request):
    if request.method == "GET":
        country = request.GET.get('country')
        state = request.GET.get('state')
        city = request.GET.get('city')
        name = request.GET.get('name')
        rating = len(request.GET.getlist('star'))
        specialties = request.GET.getlist('sub_specialties')
        docs = []
        if country == None or country == "Select Country":
            country = ""
        elif state == None:
            state = ""
        elif city == None:
            city = ""
        if specialties != []:
            docs = expertise.objects.filter(type_id__in=specialties).values_list('doctor_id',flat=True)
        if docs == []:
            if country == "":
                docs = User.objects.filter(username__icontains=name, rating__gte=rating, is_doctor=True)
            elif state == "":
                docs = User.objects.filter(username__icontains=name, rating__gte=rating, country=country, is_doctor=True)
            elif city == "":
                docs = User.objects.filter(username__icontains=name, rating__gte=rating, country=country, state=state, is_doctor=True)
            else:
                docs = User.objects.filter(username__icontains=name, rating__gte=rating, country=country, state=state, city=city, is_doctor=True)
        else:
            if country == "":
                docs = User.objects.filter(id__in=docs, username__icontains=name, rating__gte=rating, is_doctor=True)
            elif state == "":
                docs = User.objects.filter(id__in=docs, username__icontains=name, rating__gte=rating, country=country, is_doctor=True)
            elif city == "":
                docs = User.objects.filter(id__in=docs, username__icontains=name, rating__gte=rating, country=country, state=state, is_doctor=True)
            else:
                docs = User.objects.filter(id__in=docs, username__icontains=name, rating__gte=rating, country=country, state=state, city=city, is_doctor=True)
        # print(docs)
        docs = docs.order_by('-rating')
        paginator = Paginator(docs, 10)
        page_num = request.GET.get('page')
        if page_num == None:
            page_num = 1
        page_obj = paginator.get_page(page_num)
        return render(request, "YOKO_Clinics/search.html",{
            'page_obj': page_obj
        })

@login_required
def get_cal_data(request,banana="banana"):
    if request.method == "POST":
        data = json.loads(request.body)
        id1 = data.get('id1',request.user.id)
        month = data['month']
        year = data['year']
        years = [year]
        if month == 1:
            years.append(year - 1)
        if month == 12:
            years.append(year + 1)
        appoints = appointments.objects.filter(~Q(status="Canceled"),doctor_id = id1,start_date__month=month,start_date__year = year)
        vacays = vacations.objects.filter(doctor_id = id1,start_date__month__in=[month,(month - 1 + (month == 1) * 12),(month + 1) % 12 + (month == 11) * 12],start_date__year__in = years,vacation=True)
        altered = vacations.objects.filter(doctor_id = id1,start_date__month__in=[month,(month - 1 + (month == 1) * 12),(month + 1) % 12 + (month == 11) * 12],start_date__year__in = years,vacation=False)
        if appoints != None:
            appoints = serialize('json', appoints)
        else:
            appoints = 0
        if vacays != None:
            vacays = serialize('json', vacays)
        else:
            vacays = 0
        if altered != None:
            altered = serialize('json', altered)
        else:
            altered = 0
        return JsonResponse({
            'appointments' : appoints,
            'vacays': vacays,
            'altered': altered
        })
    
@login_required
def get_cal_data1(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id1 = data.get('id1',request.user.id)
        month = data['month']
        year = data['year']
        prev_month = month - 1
        next_month = month + 1
        prev_year = year
        next_year = year
        if month == 1:
            prev_month = 12
            prev_year -= 1
        if month == 12:
            next_month = 1
            next_year += 1
        banana = User.objects.get(id=id1)
        default_start = banana.start_time
        default_end = banana.end_time
        vacay = repeated_vacations.objects.filter(doctor_id=id1).values_list('day',flat=True)
        # prev_month
        _, num_days_prev = calendar.monthrange(prev_year, prev_month)
        prev_month_data = []
        prev_month_shifts = []
        for i in range(1,num_days_prev + 1):
            vacays = vacations.objects.filter(Q(start_date__day__lte=i,end_date__day__gte=i),doctor_id = id1,start_date__month=prev_month,start_date__year = prev_year,vacation=True).count()
            if vacays != 0:
                prev_month_data.append(-1)
                prev_month_shifts.append({'start':datetime.datetime.now(),'end':datetime.datetime.now()})
                continue
            vacays = vacations.objects.filter(Q(start_date__day__lte=i,end_date__day__gte=i),doctor_id = id1,start_date__month=prev_month,start_date__year = prev_year,vacation=False)
            if len(vacays) > 0:
                prev_month_shifts.append({'start':datetime.time(vacays[0].start_date.hour,vacays[0].start_date.minute,0),'end':datetime.time(vacays[0].end_date.hour,vacays[0].end_date.minute,0)})
            else:
                prev_month_shifts.append({'start':default_start,'end':default_end})
                if ((datetime.datetime(prev_year,prev_month,i,prev_month_shifts[i - 1]['start'].hour,prev_month_shifts[i - 1]['start'].minute,0, tzinfo=pytz.UTC).weekday() + 1) % 7 + 1) not in vacay:
                    prev_month_data.append(-1)
                    continue
            # search for appointments in this day
            shift_start = datetime.datetime(prev_year,prev_month,i,prev_month_shifts[i - 1]['start'].hour,prev_month_shifts[i - 1]['start'].minute,0, tzinfo=pytz.UTC)
            shift_end = datetime.datetime(prev_year,prev_month,i,prev_month_shifts[i - 1]['end'].hour,prev_month_shifts[i - 1]['end'].minute,0, tzinfo=pytz.UTC)
            if prev_month_shifts[i - 1]['start'] > prev_month_shifts[i - 1]['end']:
                shift_end += datetime.timedelta(days=1)
            time_frame = shift_end - shift_start
            appoints = appointments.objects.filter(~Q(status="Canceled"),doctor_id = id1,start_date__gte=shift_start,end_date__lte=shift_end).order_by('start_date')
            if len(appoints) > 0:
                time_frame = max(appoints[0].start_date - shift_start,shift_end - appoints[len(appoints)-1].end_date)
                for j in range(1,len(appoints)):
                    time_frame = max(appoints[j].start_date - appoints[j - 1].end_date,time_frame)
            prev_month_data.append((time_frame.total_seconds() / (shift_end-shift_start).total_seconds()) * 100)

        # cur_month
        _, num_days = calendar.monthrange(year, month)
        month_data = []
        month_shifts = []
        for i in range(1,num_days + 1):
            vacays = vacations.objects.filter(Q(start_date__day__lte=i,end_date__day__gte=i),doctor_id = id1,start_date__month=month,start_date__year = year,vacation=True).count()
            if vacays != 0:
                month_data.append(-1)
                month_shifts.append({'start':datetime.datetime.now(),'end':datetime.datetime.now()})
                continue
            vacays = vacations.objects.filter(Q(start_date__day__lte=i,end_date__day__gte=i),doctor_id = id1,start_date__month=month,start_date__year = year,vacation=False)
            if len(vacays) > 0:
                month_shifts.append({'start':datetime.time(vacays[0].start_date.hour,vacays[0].start_date.minute,0),'end':datetime.time(vacays[0].end_date.hour,vacays[0].end_date.minute,0)})
            else:
                month_shifts.append({'start':default_start,'end':default_end})
                if ((datetime.datetime(year,month,i,month_shifts[i - 1]['start'].hour,month_shifts[i - 1]['start'].minute,0, tzinfo=pytz.UTC).weekday() + 1) % 7 + 1) not in vacay:
                    month_data.append(-1)
                    continue
            # search for appointments in this day
            shift_start = datetime.datetime(year,month,i,month_shifts[i - 1]['start'].hour,month_shifts[i - 1]['start'].minute,0, tzinfo=pytz.UTC)
            shift_end = datetime.datetime(year,month,i,month_shifts[i - 1]['end'].hour,month_shifts[i - 1]['end'].minute,0, tzinfo=pytz.UTC)
            if month_shifts[i - 1]['start'] > month_shifts[i - 1]['end']:
                shift_end += datetime.timedelta(days=1)
            time_frame = shift_end - shift_start
            appoints = appointments.objects.filter(~Q(status="Canceled"),doctor_id = id1,start_date__gte=shift_start,end_date__lte=shift_end).order_by('start_date')
            if len(appoints) > 0:
                time_frame = max(appoints[0].start_date - shift_start,shift_end - appoints[len(appoints)-1].end_date)
                for j in range(1,len(appoints)):
                    time_frame = max(appoints[j].start_date - appoints[j - 1].end_date,time_frame)
            month_data.append((time_frame.total_seconds() / (shift_end-shift_start).total_seconds()) * 100)

        # next_month
        _, num_days_next = calendar.monthrange(next_year, next_month)
        next_month_data = []
        next_month_shifts = []
        for i in range(1,num_days_next + 1):
            vacays = vacations.objects.filter(Q(start_date__day__lte=i,end_date__day__gte=i),doctor_id = id1,start_date__month=next_month,start_date__year = next_year,vacation=True).count()
            if vacays != 0:
                next_month_data.append(-1)
                next_month_shifts.append({'start':datetime.datetime.now(),'end':datetime.datetime.now()})
                continue
            vacays = vacations.objects.filter(Q(start_date__day__lte=i,end_date__day__gte=i),doctor_id = id1,start_date__month=next_month,start_date__year = next_year,vacation=False)
            if len(vacays) > 0:
                next_month_shifts.append({'start':datetime.time(vacays[0].start_date.hour,vacays[0].start_date.minute,0),'end':datetime.time(vacays[0].end_date.hour,vacays[0].end_date.minute,0)})
            else:
                next_month_shifts.append({'start':default_start,'end':default_end})
                if ((datetime.datetime(next_year,next_month,i,next_month_shifts[i - 1]['start'].hour,next_month_shifts[i - 1]['start'].minute,0, tzinfo=pytz.UTC).weekday() + 1) % 7 + 1) not in vacay:
                    next_month_data.append(-1)
                    continue
            # search for appointments in this day
            shift_start = datetime.datetime(next_year,next_month,i,next_month_shifts[i - 1]['start'].hour,next_month_shifts[i - 1]['start'].minute,0, tzinfo=pytz.UTC)
            shift_end = datetime.datetime(next_year,next_month,i,next_month_shifts[i - 1]['end'].hour,next_month_shifts[i - 1]['end'].minute,0, tzinfo=pytz.UTC)
            if next_month_shifts[i - 1]['start'] > next_month_shifts[i - 1]['end']:
                shift_end += datetime.timedelta(days=1)
            time_frame = shift_end - shift_start
            appoints = appointments.objects.filter(~Q(status="Canceled"),doctor_id = id1,start_date__gte=shift_start,end_date__lte=shift_end).order_by('start_date')
            if len(appoints) > 0:
                time_frame = max(appoints[0].start_date - shift_start,shift_end - appoints[len(appoints)-1].end_date)
                for j in range(1,len(appoints)):
                    time_frame = max(appoints[j].start_date - appoints[j - 1].end_date,time_frame)
            next_month_data.append((time_frame.total_seconds() / (shift_end-shift_start).total_seconds()) * 100)

        return JsonResponse({
            'prev_month_data': prev_month_data,
            'prev_month_shifts': prev_month_shifts,
            'month_data': month_data,
            'month_shifts': month_shifts,
            'next_month_data': next_month_data,
            'next_month_shifts': next_month_shifts
        })
    
@login_required
def book_appointment(request):
    if request.method == "POST":
        data = json.loads(request.body)
        desc = data['description']
        pat_id = request.user.id
        doc_id = data['id1']
        date_created = datetime.datetime.now(datetime.timezone.utc)
        date_requested = datetime.date(int(data['year']),int(data['month']),int(data['day']))
        if bookings.objects.filter(Q(date_created__date=date_created.date()),patient_id = pat_id).count() > 0 or bookings.objects.filter(patient_id = pat_id,day=date_requested).count() > 0:
            return JsonResponse({'message': 'You can not book multiple appointments on the same day.'})
        item = bookings(patient_id = pat_id,doctor_id = doc_id,day = date_requested,description = desc,date_created = date_created)
        item.save()
        return JsonResponse({'message': 'OK'})