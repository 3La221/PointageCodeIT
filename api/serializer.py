from rest_framework import serializers


from .models import *

class EmployeEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = ["first_name","last_name","email","phone_number","username",'is_first_login']
        
    def to_internal_value(self, data):
        try:
            
            data["first_name"] = data["first_name"].upper()
            data["last_name"] = data["last_name"].upper()
                
            phone_number = data["phone_number"]
            data["username"] = f'{data["first_name"].strip().lower()}.{data["last_name"].lower()}{phone_number[-4:]}'
        except KeyError:
            pass
            
        return super().to_internal_value(data)
        
       

class EmployeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = "__all__"
        
    
    def to_internal_value(self, data):
        data["first_name"] = data["first_name"].upper()
        data["last_name"] = data["last_name"].upper()
        
        phone_number = data["phone_number"]
        data["username"] = f'{data["first_name"].strip().lower()}.{data["last_name"].lower()}{phone_number[-4:]}'
        
        return super().to_internal_value(data)
    
    def to_representation(self, instance):
        
        old_representation =  super().to_representation(instance)
        new_representation = {}
        new_representation["id"] = old_representation["id"]
        new_representation["username"] = old_representation["username"]
        new_representation["first_name"] = old_representation["first_name"]
        new_representation["last_name"] = old_representation["last_name"]
        
        new_representation["company"] = instance.company.name
        new_representation["email"] = instance.email
        new_representation["phone_number"] = instance.phone_number
        new_representation["gender"] = instance.gender
        new_representation["active"] = instance.active
        new_representation["function"] = instance.function
        new_representation["is_first_login"] = instance.is_first_login
        
        
        return new_representation
    
    def create(self, validated_data):
        employe = Employe.objects.create_user(**validated_data)
        return employe


class WifiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wifi 
        fields = "__all__"

class CompanySerializer(serializers.ModelSerializer):
    employes = EmployeSerializer(many=True,read_only=True)
    wifis = WifiSerializer(many=True)
    class Meta:
        model = Company
        fields = "__all__"
        
    def create(self, validated_data):
        wifis = validated_data.pop("wifis")
        company = Company.objects.create(**validated_data)
        
        for wifi in wifis:
            w = Wifi.objects.create(bssid = wifi["bssid"] , ssid = wifi["ssid"] , company = company)
        
        company.save()
        
        return company


class CompanyAdminSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Company_Admin
        fields = "__all__"
    
    def create(self, validated_data):
        company_admin = Company_Admin.objects.create_user(**validated_data)
        return company_admin


class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = "__all__"



class BreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Break
        fields = ["start_time","end_time","duration"]

class PointingSerializer(serializers.ModelSerializer):
    code = CodeSerializer()
    breaks = BreakSerializer(many=True)
    class Meta:
        model = Pointing
        fields = ["id","employe","date","clock_in_time","clock_out_time","code","status","breaks_duration","breaks"]
        
        
    
class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = "__all__"
