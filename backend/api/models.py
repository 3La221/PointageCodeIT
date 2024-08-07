from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import  UserManager
from enum import Enum 
from datetime import datetime, timedelta , date
from django.utils import timezone 
from .utils import haversine


class Gender(Enum):
    MALE = 'Male'
    FEMALE = 'Female'


class Status(Enum):
    WORKING = "W"
    BREAK = "B"
    WORKING_AFTER_BREAK = "WAB"
    DONE = "D"
    
class CodeRole(Enum):
    DONE = "DONE"
    WORKING = "WORKING"
    BREAK = "BREAK"
    ABSENT = "ABSENT"
    OTHER = "OTHER"

class Profile(AbstractUser):
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    gender = models.CharField(max_length=10, choices=[(tag.value, tag.name) for tag in Gender],null=True , blank = True)
    phone_number = models.CharField(max_length=12,null=True,blank=True)
    email = models.EmailField(max_length=80,null=True,blank=True)
    active = models.BooleanField(default=True)
    
    PASSWORD_FIELD = "password"
    REQUIRED_FIELDS = []    
    
    objects = UserManager()
    

class Company_Admin(Profile):
    company = models.ForeignKey("Company",on_delete=models.CASCADE,related_name="admins")
    is_company_admin = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f'{self.username} Company Admin'    


class Employe(Profile):
    company = models.ForeignKey("Company",on_delete=models.CASCADE,related_name="employes")
    current_station = models.ForeignKey("Station",on_delete=models.SET_NULL,related_name="employes",null=True)
    function = models.CharField(max_length=50,null=True,blank=True)
    is_first_login = models.BooleanField(default=True)
    mac_address = models.CharField(max_length=30,null=True,blank=True)
    def __str__(self) -> str:
        return f'{self.username} Employe'
    
    @property
    def week_working_time(self):
        # Current date and time
        now = datetime.now()
        # Calculate the start of the week (Monday)
        start_of_week = now - timedelta(days=now.weekday(), weeks=1)
        # Filter pointings for the last week
        last_week_pointings = [p for p in self.pointings.all() if p.clock_in_time.date() >= start_of_week.date() and p.status == Status.DONE.value]
        # Calculate the sum of working hours for the last week
        return sum([p.clock_out_time - p.clock_in_time for p in last_week_pointings], timedelta())
    
    
    
    class Meta:
        verbose_name = "Employe"
        verbose_name_plural = "Employes"

class Code(models.Model):
    name = models.CharField(max_length=6 , null=False , blank=False)
    company = models.ForeignKey("Company",  on_delete=models.CASCADE , related_name="codes" )
    meaning = models.CharField(max_length=50,null=True,blank=True)
    role = models.CharField(max_length=20,choices=[(tag.value, tag.name) for tag in CodeRole],null=True,blank=True)
    color = models.CharField(max_length=20,null=True,blank=True,default="#95a5a6")
    
    
    
    def __str__(self) -> str:
        return f'{self.name}'

class Pointing(models.Model):
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    employe = models.ForeignKey(Employe,on_delete=models.CASCADE,related_name="pointings")
    date = models.DateField(default=date.today)
    clock_in_time  = models.DateTimeField(default=timezone.now, null=False, blank=False)
    clock_out_time  = models.DateTimeField(null=True,blank=True)
    code = models.ForeignKey(Code,on_delete=models.CASCADE,related_name="pointings",null=True)
    status = models.CharField(max_length=20,choices=[(tag.value, tag.name) for tag in Status],null=True,blank=True)
    
    @property
    def breaks_duration(self):
        return sum([b.duration for b in self.breaks.all()],timedelta())
    
    def __str__(self) -> str:
        return f'{self.employe.username} {self.date} {self.code} '
    
class Break(models.Model):
    start_time = models.DateTimeField(null=False,blank=False)
    end_time = models.DateTimeField(null=True,blank=True)
    pointing = models.ForeignKey(Pointing,on_delete=models.CASCADE,related_name="breaks")
    @property
    def duration(self):
        if self.end_time is None:
            return timedelta(0)
        return (self.end_time - self.start_time)/60/60
    
    

class Company(models.Model):
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    name = models.CharField(max_length=80,null=True , blank=True)
    phone_number = models.CharField(max_length=12,null=True,blank=True)
    email = models.CharField(max_length=80,null=True,blank=True)
    logo = models.ImageField(upload_to="company_logo",null=True,blank=True)
    
    def __str__(self) -> str:
        return f'{self.name} Company'

class Station(models.Model):
    company = models.ForeignKey(Company,on_delete=models.CASCADE,related_name="stations")
    name = models.CharField(max_length=50,blank=False,null=False)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    
    def is_employee_nearby(self, latitude, longitude, radius_km=0.5): 
        distance = haversine(self.latitude, self.longitude, latitude, longitude)
        return distance <= radius_km
    
    def __str__(self) -> str:
        return f'{self.company} Station {self.name}'                   

class Wifi(models.Model):
    ssid = models.CharField(max_length=50,blank=False,null=False)
    bssid = models.CharField(max_length=120,blank=False,null=False)
    company = models.ForeignKey(Company,on_delete=models.CASCADE , related_name="wifis")
    
    
    def __str__(self) -> str:
        return f'{self.company} Wifi {self.ssid}'