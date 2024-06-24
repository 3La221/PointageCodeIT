from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets , status
from rest_framework.response import Response
from . models import *
from . serializer import *
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action,authentication_classes,permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .pagination import CustomPagination
from django.db.models import Q
from datetime import datetime
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from .permissions import IsCompanyAdmin
    



class CompanyViewSet(viewsets.ViewSet):
    permission_classes_by_action = {"employes":[IsCompanyAdmin] }
    
    def get_permissions(self):
        try:
            # Return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action.get(self.action, [IsAdminUser])]
        except KeyError:
            # Default to AllowAny if not specified otherwise
            return [IsAdminUser()]
    
    
    def list(self,request):
        queryset = Company.objects.all()
        serializer = CompanySerializer(queryset,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def retrieve(self,request,pk=None):
        queryset = Company.objects.all()
        company = get_object_or_404(queryset,pk=pk)
        serializer = CompanySerializer(company)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def create(self,request):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self,request,pk=None):
        queryset = Company.objects.all()
        company = get_object_or_404(queryset,pk=pk)
        company.delete()
        return Response({"message":"Company Deleted"},status=status.HTTP_204_NO_CONTENT)

    
    @action(detail=True,methods=['get'])
    def employes(self,request,pk=None):
        queryset = Company.objects.all()
        company = get_object_or_404(queryset , pk=pk)
        company_employes = company.employes.all()
        serializer = EmployeSerializer(company_employes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class EmployeViewSet(viewsets.ViewSet):
    permission_classes_by_action = {'check_in': [IsAuthenticated],
                                    'pointings':[IsCompanyAdmin],
                                    'create':[IsCompanyAdmin],
                                    'list':[IsAdminUser],
                                    }
    
    def get_permissions(self):
        try:
            # Return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action.get(self.action, [AllowAny])]
        except KeyError:
            # Default to AllowAny if not specified otherwise
            return [AllowAny()]
    
    def list(self,request):
        queryset = Employe.objects.all()
        serializer = EmployeSerializer(queryset,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    def create(self,request):
        serializer = EmployeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False,methods=["post"])
    def login(self,request):
        try:
            username = request.data["username"]
            password = request.data["password"]
            
            user = authenticate(
            username = username,
            password = password
        )
            if user:
                tokens = RefreshToken.for_user(user)
                return Response({
                    "id":user.id,
                    "access":str(tokens.access_token),
                    "first_name":user.first_name,
                    "last_name":user.last_name,
                    "username":user.username,
                },status=status.HTTP_200_OK)
            else:
                return Response({"message":"Invalid Credentials"},status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({"message":"Please provide username and password"},status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True,methods=["post"])
    def check_in(self,request,pk=None):
        employe = Employe.objects.get(id=pk)
        try:
            wifi = request.data["wifi"]
            company = employe.company
            if wifi in company.wifis:
                code , _ = Code.objects.get_or_create(name="T")
                pointing = Pointing.objects.create(employe=employe,code=code)
                pointing.save()
                return Response({"message":"Check In Successfull"},status=status.HTTP_200_OK)
            else:
                return Response({"message":"Invalid Wifi"},status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({"message":"Please provide wifi"},status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True,methods=["get"])
    def pointings(self,request,pk=None):
        try:
            employe = Employe.objects.get(id=pk)
        except Employe.DoesNotExist:
            return Response({"message":"Employee not found"},status=status.HTTP_404_NOT_FOUND)
        
        date = request.query_params.get('date')
        if date:
            try:
                year,month = map(int,date.split('-'))
                start_date = datetime(year,month,1)
                if month == 12 :
                    end_date = datetime(year+1,1,1)
                else : 
                    end_date = datetime(year , month+1 ,1)
            except ValueError:
                return Response({"message:Invalid month format.Use YYYY-MM"} ,
                                status=status.HTTP_400_BAD_REQUEST)
            
            employe_pointings = employe.pointings.filter(
                Q(date__gte=start_date) & Q(date__lt=end_date))    
        else:
            employe_pointings = employe.pointings.all()
        
        paginator = CustomPagination()
        page = paginator.paginate_queryset(employe_pointings,request)
        
        serializer = PointingSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
    


class CompanyAdminViewSet(viewsets.ViewSet):
    
    permission_classes_by_action = {"login":[AllowAny]}
    
    def get_permissions(self):
        try:
            # Return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action.get(self.action, [IsCompanyAdmin])]
        except KeyError:
            # Default to AllowAny if not specified otherwise
            return [IsCompanyAdmin()]
    
    
    def create(self,request):
        serializer = CompanyAdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False,methods=["post"])
    def login(self,request):
        try:
            username = request.data["username"]
            password = request.data["password"]
            
            user = authenticate(
            username = username,
            password = password
        )
            if user:
                if hasattr(user,'company_admin'):
                    tokens = RefreshToken.for_user(user)
                    return Response({
                        "id":user.id,
                        "access":str(tokens.access_token),
                        "is_companyAdmin":True,
                        "company_id":user.company_admin.company.id
                    },status=status.HTTP_200_OK)
                else:
                    return Response({"message":"User is not a company admin"},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message":"Invalid Credentials"},status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({"message":"Please provide username and password"},status=status.HTTP_400_BAD_REQUEST)
    