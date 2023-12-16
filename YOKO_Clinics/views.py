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
    return render(request, "YOKO_Clinics/index.html")

@login_required
def bookings(request):
    pass

@login_required
def vacation(request):
    vacay = repeated_vacations.objects.filter(doctor_id=request.user.id).values_list('day',flat=True)
    days = [1,2,3,4,5,6,7]
    vaycays = []
    for i in days:
        if(i not in vacay):
            vaycays.append(i)
    return render(request, "YOKO_Clinics/vacations.html",{
        'current_time': datetime.datetime.now(),
        'repeated': vaycays
    })
        


@login_required
def vacation_add(request):
    if request.method == 'PUT':
        vacay = repeated_vacations.objects.filter(doctor_id=request.user.id).values_list('day',flat=True)
        days = [1,2,3,4,5,6,7]
        vaycays = []
        for i in days:
            if(i not in vacay):
                vaycays.append(i)
        is_vacation = request.POST.get('is_vacation')
        if is_vacation == None:
            is_vacation = False
        else:
            is_vacation = True
        start_time = request.POST.get('start_time')
        end_time = request.POST.get('end_time')
        start_day = request.POST.get('start_day').split('/')[0]
        end_day = request.POST.get('end_day').split('/')[0]
        month = request.POST.get('start_day').split('/')[1]
        year = request.POST.get('start_day').split('/')[2]
        print(is_vacation)
        print(start_time)
        print(end_time)
        print(start_day)
        print(end_day)
        print(month)
        print(year)
        if is_vacation:
            pass
        else:
            pass
        return render(request, "YOKO_Clinics/vacations.html",{
            'current_time': datetime.datetime.now(),
            'repeated': vaycays
        })


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
        specialties = expertise.objects.filter(doctor_id=id).values_list('type_id',flat=True)
        day = repeated_vacations.objects.filter(doctor_id=id).values_list('day',flat=True)
        days = [0,0,0,0,0,0,0]
        for d in day:
            days[d - 1] = 1
        sub = []
        for specialty in specialties:
            sub.append(types.objects.get(id=specialty))
        return render(request, "YOKO_Clinics/profile.html",{
            'target': target,
            'sub': sub,
            'days': days
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
        return JsonResponse({'message': 'Post edited successfully.'})


@login_required
def appointment(request):
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
def get_cal_data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        month = data['month']
        year = data['year']
        years = [year]
        if month == 1:
            years.append(year - 1)
        if month == 12:
            years.append(year + 1)
        appoints = appointments.objects.filter(doctor_id = request.user.id,start_date__month=month,start_date__year = year)
        vacays = vacations.objects.filter(doctor_id = request.user.id,start_date__month__in=[month,(month - 1 + (month == 1) * 12),(month + 1) % 12 + (month == 11) * 12],start_date__year__in = years,vacation=True)
        altered = vacations.objects.filter(doctor_id = request.user.id,start_date__month__in=[month,(month - 1 + (month == 1) * 12),(month + 1) % 12 + (month == 11) * 12],start_date__year__in = years,vacation=False)
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