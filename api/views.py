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
from datetime import datetime, timedelta
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
        qury_params = request.query_params
        queryset = Company.objects.all()
        company = get_object_or_404(queryset , pk=pk)
        company_employes = company.employes.all()
        try:
            if qury_params.get('active') == 'false':
                company_employes = company.employes.filter(active=False)
            elif qury_params.get('active') == 'true':
                company_employes = company.employes.filter(active=True)
        except Exception as e:
            print(e)
        serializer = EmployeSerializer(company_employes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class EmployeViewSet(viewsets.ViewSet):
    permission_classes_by_action = {'clock_in': [IsAuthenticated],
                                    'start_break': [IsAuthenticated],
                                    'end_break': [IsAuthenticated],
                                    'clock_out': [IsAuthenticated],
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
    
    
    @action(detail=True,methods=["delete"])
    def deactivate(self,request,pk=None):
        employe = Employe.objects.get(id=pk)
        employe.active = False
        employe.save()
        return Response({"message":"Employe Deactivated"},status=status.HTTP_200_OK)
    
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
    
    
    @action(detail=True,methods=["POST"])
    def clock_in(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        
        try:
            ssid = request.data["ssid"]
            bssid = request.data["bssid"]
            company = employe.company
            wifis = company.wifis.all()
            today = timezone.localdate()
            for w in wifis:
                if ssid == w.ssid and bssid == w.bssid :
                    code = Code.objects.get(name="W")
                    pointing , created = Pointing.objects.get_or_create(employe=employe,date = today)
                    if created:
                        pointing.code = code 
                        pointing.status = "W"
                        pointing.save()
                        return Response({"message":"Clock In Successful"},status=status.HTTP_200_OK)
                    return Response({"message":"You have already clocked in"})
            return Response({"message": "WiFi not authorized."}, status=400)
        except KeyError:
            return Response({"message": "SSID or BSSID not provided."}, status=400)
        
    @action(detail=True,methods=["POST"])
    def start_break(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        
        try:
            ssid = request.data["ssid"]
            bssid = request.data["bssid"]
            company = employe.company
            wifis = company.wifis.all()
            today = timezone.localdate()
            for w in wifis :
                if ssid == w.ssid and bssid == w.bssid :
                    code = Code.objects.get(name="P")
                    pointing = Pointing.objects.get(employe= employe,date =today )
                    if pointing.status == "B" :
                        return Response({"message":"You have already started a break."},status=400)
                    pointing.status = "B"
                    pointing.break_start_time = timezone.now()
                    pointing.code = code 
                    pointing.save()
                    return Response({"message":"Break started successfully."},status=200)
                return Response({"message": "WiFi not authorized."}, status=400)
        except Pointing.DoesNotExist:
            return Response({"message": "No clock-in record found for today."}, status=404)
        except KeyError:
            return Response({"message": "SSID or BSSID not provided."}, status=400)
       
    
    @action(detail=True,methods=["POST"])
    def end_break(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        
        try:
            ssid = request.data["ssid"]
            bssid = request.data["bssid"]
            company = employe.company
            wifis = company.wifis.all()
            today = timezone.localdate()
            for w in wifis :
                if ssid == w.ssid and bssid == w.bssid :
                    code = Code.objects.get(name="W")
                    pointing = Pointing.objects.get(employe= employe,date = today )
                    if pointing.status == "WAB" :
                        return Response({"message":"You have already ended your break."},status=400)
                    if pointing.status != "B" :
                        return Response({"message":"You have not started a break."},status=400)
                    
                    
                    pointing.break_end_time = timezone.now()
                    pointing.code = code
                    pointing.status = "WAB" 
                    pointing.save()
                    return Response({"message":"Break ended successfully."},status=200)
                return Response({"message": "WiFi not authorized."}, status=400)
        except Pointing.DoesNotExist:
            return Response({"message": "No clock-in record found for today."}, status=404)
        except KeyError:
            return Response({"message": "SSID or BSSID not provided."}, status=400)
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=500)
        
    @action(detail=True,methods=["POST"])
    def clock_out(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        
        try:
            ssid = request.data["ssid"]
            bssid = request.data["bssid"]
            company = employe.company
            wifis = company.wifis.all()
            today = timezone.localdate()
            for w in wifis :
                if ssid == w.ssid and bssid == w.bssid :
                    code = Code.objects.get(name="T")
                    pointing = Pointing.objects.get(employe= employe,date = today )
                    if pointing.status == "D" :
                        return Response({"message":"You have already clocked out."},status=400)
                    if pointing.status == "B" :
                        return Response({"message":"You have not ended your break."},status=400)
                    
                    pointing.clock_out_time = timezone.now()
                    pointing.status = "D"
                    pointing.code = code 
                    pointing.save()
                    return Response({"message": "Clock-out recorded successfully."})
                return Response({"message": "WiFi not authorized."}, status=400)
        except Pointing.DoesNotExist:
            return Response({"message": "No clock-in record found for today."}, status=404)
        except KeyError:
            return Response({"message": "SSID or BSSID not provided."}, status=400)
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=500)
        
    

        
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
    
    @action(detail=True,methods=["get"])
    def history(self,request,pk=None):
        query_params = request.query_params
        days = query_params.get("day")
        employe = get_object_or_404(Employe,id=pk)
        last_seven_days_pointings = employe.pointings.filter(date__gte=datetime.now()-timedelta(days=int(days)))
        serializer = PointingSerializer(last_seven_days_pointings,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    


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
    
    
class SuperAdminViewSet(viewsets.ViewSet):
    
    permission_classes_by_action = {"login":[AllowAny]}
    
    def get_permissions(self):
        try:
            # Return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action.get(self.action, [IsAdminUser])]
        except KeyError:
            # Default to AllowAny if not specified otherwise
            return [IsAdminUser()]
    
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
                if user.is_superuser:
                    tokens = RefreshToken.for_user(user)
                    return Response({
                        "id":user.id,
                        "access":str(tokens.access_token),
                        "is_superuser":True
                    },status=status.HTTP_200_OK)
                else:
                    return Response({"message":"User is not a super admin"},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message":"Invalid Credentials"},status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({"message":"Please provide username and password"},status=status.HTTP_400_BAD_REQUEST)