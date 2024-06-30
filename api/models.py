from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import  UserManager
from enum import Enum 
import datetime

class Gender(Enum):
    MALE = 'Male'
    FEMALE = 'Female'


# Create your models here.
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
    def __str__(self) -> str:
        return f'{self.name}'

class Pointing(models.Model):
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    employe = models.ForeignKey(Employe,on_delete=models.CASCADE,related_name="pointings")
    date = models.DateField(default=datetime.date.today)
    code = models.ForeignKey(Code,on_delete=models.CASCADE,related_name="pointings")
    
    
    def __str__(self) -> str:
        return f'{self.employe.username} {self.date} {self.code} '

class Company(models.Model):
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    name = models.CharField(max_length=80,null=True , blank=True)
    wifis = models.JSONField(default=list)
    phone_number = models.CharField(max_length=12,null=True,blank=True)
    email = models.CharField(max_length=80,null=True,blank=True)
    
    def __str__(self) -> str:
        return f'{self.name} Company'


