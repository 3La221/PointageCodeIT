from django.contrib import admin
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"company",CompanyViewSet,basename="company")
router.register(r"employe",EmployeViewSet,basename="employe")
router.register(r"company_admin",CompanyAdminViewSet,basename="company-admin")


urlpatterns = router.urls