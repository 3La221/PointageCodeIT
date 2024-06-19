from rest_framework import serializers


from .models import *

class EmployeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = "__all__"
        
    
    def to_internal_value(self, data):
        first_name = data["first_name"].replace(" ","")
        last_name = data["last_name"].replace(" ", "")
        data["username"] = f'{first_name.strip()}.{last_name}'
        
        return super().to_internal_value(data)
    
    def to_representation(self, instance):
        
        old_representation =  super().to_representation(instance)
        new_representation = {}
        new_representation["id"] = old_representation["id"]
        new_representation["username"] = old_representation["username"]
        new_representation["first_name"] = old_representation["first_name"]
        new_representation["last_name"] = old_representation["last_name"]
        new_representation["company"] = old_representation["company"]
        
        
        return new_representation
    
    def create(self, validated_data):
        employe = Employe.objects.create_user(**validated_data)
        return employe


class CompanySerializer(serializers.ModelSerializer):
    employes = EmployeSerializer(many=True,read_only=True)
    class Meta:
        model = Company
        fields = "__all__"


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
    
