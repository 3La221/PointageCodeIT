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
import openpyxl
from .utils import extract_time,increment_column,is_employe_in_job
import os
from django.conf import settings




class CompanyViewSet(viewsets.ViewSet):
    permission_classes_by_action = {"employes":[IsCompanyAdmin],
                                    "codes":[IsCompanyAdmin],
                                    "wifis":[IsCompanyAdmin],
                                    "daily_attendance":[IsCompanyAdmin],
                                    'today_in_csv':[IsCompanyAdmin],
                                    'today_pointings':[IsCompanyAdmin]}
    
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
    
    
    @action(detail=True,methods=["get"])
    def codes (self,request,pk=None):
        queryset = Company.objects.all()
        company = get_object_or_404(queryset,pk=pk)
        codes = company.codes.all()
        serializer = CodeSerializer(codes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    @action(detail=True,methods=["get"])
    def wifis(self,request,pk=None):
        queryset = Company.objects.all()
        company = get_object_or_404(queryset,pk=pk)
        wifis = company.wifis.all()
        serializer = WifiSerializer(wifis,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    @action(detail=True,methods=["get"])
    def daily_attendance(self,request,pk=None):
        pointings = Pointing.objects.filter(date=timezone.localdate(),employe__company_id=pk)
        serializer = PointingSerializer(pointings,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)        
    
    @action(detail=True, methods=["get"])
    def today_in_csv(self, request, pk=None):
        pointings = Pointing.objects.filter(date=timezone.localdate(), employe__company_id=pk)
        wb = openpyxl.load_workbook("./excel/POINTAGE.xlsx")
        sheet = wb.active
        i = 5
        for pointing in pointings:
            sheet[f'B{i}'] = f'{pointing.employe.first_name} {pointing.employe.last_name}'
            clock_in = extract_time(pointing.clock_in_time.isoformat())
            sheet[f'C{i}'] = clock_in
            break_in = extract_time(pointing.break_start_time.isoformat()) if pointing.break_start_time else ''
            sheet[f'D{i}'] = break_in
            break_out = extract_time(pointing.break_end_time.isoformat()) if pointing.break_end_time else ''
            sheet[f'E{i}'] = break_out
            clock_out = extract_time(pointing.clock_out_time.isoformat()) if pointing.clock_out_time else ''
            sheet[f'F{i}'] = clock_out
            i += 1

        # Construct the filename and path
        filename = f'{timezone.localdate()}.xlsx'
        file_path = os.path.join(settings.MEDIA_ROOT, 'excel', filename)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save the file
        wb.save(file_path)
        
        # Construct the file URL
        file_url = os.path.join(settings.MEDIA_URL, 'excel', filename)
        
        return JsonResponse({"file_url": file_url}, status=status.HTTP_200_OK)
    
    @action(detail=True,methods=["get"])
    def today_pointings(self,request,pk=None):
        company = get_object_or_404(Company,id=pk)
        today = timezone.localdate()
        pointings = Pointing.objects.filter(date=today,employe__company=company)
        serializer = PointingSerializer(pointings,many=True)
        
        return Response(serializer.data,status=status.HTTP_200_OK)
            
        

class EmployeViewSet(viewsets.ViewSet):
    permission_classes_by_action = {'clock_in': [IsAuthenticated],
                                    'start_break': [IsAuthenticated],
                                    'end_break': [IsAuthenticated],
                                    'clock_out': [IsAuthenticated],
                                    'pointings':[IsCompanyAdmin],
                                    'create':[IsCompanyAdmin],
                                    'list':[IsAdminUser],
                                    'activate':[IsCompanyAdmin],
                                    'deactivate':[IsCompanyAdmin],
                                    'one_month_pointings_to_csv':[IsCompanyAdmin],
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
    
    
    def retrieve(self,request,pk=None):
        queryset = Employe.objects.all()
        employe = get_object_or_404(queryset,pk=pk)
        serializer = EmployeSerializer(employe)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    @action(detail=True,methods=["patch"])
    def activate(self,request,pk=None):
        employe = Employe.objects.get(id=pk)
        employe.active = True
        employe.save()
        return Response({"message":"Employe Activated"},status=status.HTTP_200_OK)
    
    @action(detail=True,methods=["delete"])
    def deactivate(self,request,pk=None):
        employe = Employe.objects.get(id=pk)
        employe.active = False
        employe.save()
        return Response({"message":"Employe Deactivated"},status=status.HTTP_200_OK)
    
    @action(detail=True,methods=["POST"])
    def change_code(self,request,pk=None):
        date = request.data["date"]
        code_id = request.data["code_id"]
        employe = Employe.objects.get(id=pk)
        pointing , created = Pointing.objects.get_or_create(employe=employe,date = date)
        code = Code.objects.get(id=code_id)
        pointing.code = code 
        pointing.save()
        
        return Response({"message":"DONE"},status=200)
    
    
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
                    "company":user.company.name,
                    "email":user.email,
                    "phone_number":user.phone_number,
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
            longitude = request.data["longitude"]
            latitude = request.data["latitude"]
            in_job = is_employe_in_job(employe,longitude,latitude,ssid,bssid)
            today = timezone.localdate()
            if in_job:
                code = Code.objects.get(name="W")
                pointing , created = Pointing.objects.get_or_create(employe=employe,date = today)
                if created:
                    pointing.code = code 
                    pointing.status = "W"
                    pointing.save()
                    return Response({"message":"Clock In Successful"},status=status.HTTP_200_OK)
                return Response({"message":"You have already clocked in"})
            return Response({"message": "WiFi not authorized. + You're not in location"}, status=400)
        except KeyError:
            return Response({"message": "SSID,BSSID,longitude,latitude not provided."}, status=400)
        
    @action(detail=True,methods=["POST"])
    def start_break(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        
        try:
            ssid = request.data["ssid"]
            bssid = request.data["bssid"]
            longitude = request.data["longitude"]
            latitude = request.data["latitude"]
            in_job = is_employe_in_job(employe,longitude,latitude,ssid,bssid)
            today = timezone.localdate()
            if in_job:
                code = Code.objects.get(name="P")
                pointing = Pointing.objects.get(employe= employe,date =today )
                if pointing.status == "B" :
                    return Response({"message":"You have already started a break."},status=400)
                break_instance = Break.objects.create(start_time=timezone.now(),pointing=pointing)
                break_instance.save()
                pointing.status = "B"
                pointing.code = code 
                pointing.save()
                serializer = PointingSerializer(pointing)
                return Response(serializer.data,status=200)
            return Response({"message": "WiFi not authorized. + You're not in location"}, status=400)
        except Pointing.DoesNotExist:
            return Response({"message": "No clock-in record found for today."}, status=404)
        except KeyError:
            return Response({"message": "SSID,BSSID,longitude,latitude not provided."}, status=400)
       
    
    @action(detail=True,methods=["POST"])
    def end_break(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        
        try:
            ssid = request.data["ssid"]
            bssid = request.data["bssid"]
            longitude = request.data["longitude"]
            latitude = request.data["latitude"]
            in_job = is_employe_in_job(employe,longitude,latitude,ssid,bssid)
            today = timezone.localdate()
            if in_job:
                code = Code.objects.get(name="W")
                pointing = Pointing.objects.get(employe= employe,date = today )
                if pointing.status == "WAB" :
                    return Response({"message":"You have already ended your break."},status=400)
                if pointing.status != "B" :
                    return Response({"message":"You have not started a break."},status=400)
                    
                break_instance = Break.objects.get(pointing=pointing,end_time=None)
                break_instance.end_time = timezone.now()
                break_instance.save()
                pointing.code = code
                pointing.status = "WAB" 
                pointing.save()
                serializer = PointingSerializer(pointing)
                return Response(serializer.data,status=200)
            return Response({"message": "WiFi not authorized. + You're not in location"}, status=400)
        except Pointing.DoesNotExist:
            return Response({"message": "No clock-in record found for today."}, status=404)
        except KeyError:
            return Response({"message": "SSID,BSSID,longitude,latitude not provided."}, status=400)
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=500)
        
    @action(detail=True,methods=["POST"])
    def clock_out(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        
        try:
            ssid = request.data["ssid"]
            bssid = request.data["bssid"]
            longitude = request.data["longitude"]
            latitude = request.data["latitude"]
            in_job = is_employe_in_job(employe,longitude,latitude,ssid,bssid)
            today = timezone.localdate()
            if in_job:
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
                serializer = PointingSerializer(pointing)
                return Response(serializer.data,status=200)
            return Response({"message": "WiFi not authorized."}, status=400)
        except Pointing.DoesNotExist:
            return Response({"message": "No clock-in record found for today."}, status=404)
        except KeyError:
            return Response({"message": "SSID,BSSID,longitude,latitude not provided."}, status=400)
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=500)
        
    
    @action(detail=True,methods=["POST"])
    def one_month_pointings_to_csv(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        first_date = request.data["first_date"]
        last_date = request.data["last_date"]
        pointings = employe.pointings.filter(date__gte=first_date,date__lte=last_date)
        wb = openpyxl.load_workbook("./excel/template_mois.xlsx")
        sheet = wb.active
        sheet["S4"] = first_date
        sheet["W4"] = last_date
        cell = 'B'
    
        for p in pointings:
            sheet["A7"] = f'{p.employe.company.name}'
            sheet["H11"] = f'{p.employe.first_name}'
            sheet["R11"] = f'{p.employe.last_name}'
            
            sheet[f'{cell}17'] = f'{p.date.day}'
            sheet[f'{cell}18'] = f'{p.code}'
            cell = increment_column(cell)
        filename = f'{employe.first_name}_{first_date}_{last_date}.xlsx'
        file_path = os.path.join(settings.MEDIA_ROOT, 'excel', filename)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save the file
        wb.save(file_path)
        
        file_url = os.path.join(settings.MEDIA_URL, 'excel', filename)
        
        return Response({"message": "File created" , "file_url":file_url}, status=status.HTTP_200_OK)
            
    @action(detail=True,methods=["get"])
    def today_pointings(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        today = timezone.localdate()
        pointings = employe.pointings.filter(date=today)
        serializer = PointingSerializer(pointings,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
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
    
    @action(detail=True,methods=["get"])
    def export_attendance_to_csv(self,request,pk=None):
        employe = get_object_or_404(Employe,id=pk)
        pointings = employe.pointings.all()
        serializer = PointingSerializer(pointings,many=True)
        response = Response(serializer.data,status=status.HTTP_200_OK)
        response['Content-Disposition'] = 'attachment; filename="employe_attendance.csv"'
        return response
    


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
                        "company_id":user.company_admin.company.id,
                        'logo':user.company_admin.company.logo.url,
                        'company_name':user.company_admin.company.name,
                        'first_name':user.first_name,
                        'last_name':user.last_name 
                        
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
        

class CodeViewSet(viewsets.ViewSet):
    
    permission_classes_by_action = {"create":[IsCompanyAdmin] , "partial_update":[IsCompanyAdmin]}
    
    def get_permissions(self):
        try:
            # Return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action.get(self.action, [IsAdminUser])]
        except KeyError:
            # Default to AllowAny if not specified otherwise
            return [IsAdminUser()]
    
    def list(self,request):
        queryset = Code.objects.all()
        serializer = CodeSerializer(queryset,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def create(self,request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self,request,pk=None):
        queryset = Code.objects.all()
        code = get_object_or_404(queryset,pk=pk)
        serializer = CodeSerializer(code,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self,request,pk=None):
        queryset = Code.objects.all()
        code = get_object_or_404(queryset,pk=pk)
        code.delete()
        return Response({"message":"Code Deleted"},status=status.HTTP_204_NO_CONTENT)
    

class WifiViewSet(viewsets.ViewSet):
        
        permission_classes_by_action = {"create":[IsCompanyAdmin] , "partial_update":[IsCompanyAdmin]}
        
        def get_permissions(self):
            try:
                # Return permission_classes depending on `action`
                return [permission() for permission in self.permission_classes_by_action.get(self.action, [IsAdminUser])]
            except KeyError:
                # Default to AllowAny if not specified otherwise
                return [IsAdminUser()]
        
        def list(self,request):
            queryset = Wifi.objects.all()
            serializer = WifiSerializer(queryset,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        def create(self,request):
            serializer = WifiSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        def partial_update(self,request,pk=None):
            queryset = Wifi.objects.all()
            wifi = get_object_or_404(queryset,pk=pk)
            serializer = WifiSerializer(wifi,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        def destroy(self,request,pk=None):
            queryset = Wifi.objects.all()
            wifi = get_object_or_404(queryset,pk=pk)
            wifi.delete()
            return Response({"message":"Wifi Deleted"},status=status.HTTP_204_NO_CONTENT)
        

    