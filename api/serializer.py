from rest_framework import serializers


from .models import *

class EmployeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = "__all__"
        
    
    def to_internal_value(self, data):
        first_name = data["first_name"].replace(" ","")
        last_name = data["last_name"].replace(" ", "")
        phone_number = data["phone_number"]
        data["username"] = f'{first_name.strip().lower()}.{last_name.lower()}{phone_number[-4:]}'
        
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
        
        
        return new_representation
    
    def create(self, validated_data):
        employe = Employe.objects.create_user(**validated_data)
        return employe


class WifiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wifi 
        fields = ["bssid","ssid"]

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


class PointingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pointing
        fields = "__all__"
        
        
    def to_representation(self, instance):
        
        representation =  super().to_representation(instance)
        code = Code.objects.get(id=representation["code"])
        representation["code"] = code.name
        
        return representation
    
