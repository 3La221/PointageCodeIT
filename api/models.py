from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import  UserManager
from enum import Enum 
import datetime
from django.utils import timezone 



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
    def __str__(self) -> str:
        return f'{self.username} Employe'
    
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
    date = models.DateField(default=datetime.date.today)
    clock_in_time  = models.DateTimeField(default=timezone.now, null=False, blank=False)
    break_start_time  = models.DateTimeField(null=True,blank=True)
    break_end_time  = models.DateTimeField(null=True,blank=True)
    clock_out_time  = models.DateTimeField(null=True,blank=True)
    code = models.ForeignKey(Code,on_delete=models.CASCADE,related_name="pointings",null=True)
    status = models.CharField(max_length=20,choices=[(tag.value, tag.name) for tag in Status],null=True,blank=True)
    
    
    def __str__(self) -> str:
        return f'{self.employe.username} {self.date} {self.code} '

class Company(models.Model):
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    name = models.CharField(max_length=80,null=True , blank=True)
    phone_number = models.CharField(max_length=12,null=True,blank=True)
    email = models.CharField(max_length=80,null=True,blank=True)
    latitude  = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    logo = models.ImageField(upload_to="company_logo",null=True,blank=True)
    
    def __str__(self) -> str:
        return f'{self.name} Company'



class Wifi(models.Model):
    ssid = models.CharField(max_length=50,blank=False,null=False)
    bssid = models.CharField(max_length=120,blank=False,null=False)
    company = models.ForeignKey(Company,on_delete=models.CASCADE , related_name="wifis")
    
    
    def __str__(self) -> str:
        return f'{self.company} Wifi {self.ssid}'