from rest_framework import serializers
from .models import StudentAttendance, StudentData, Faculty, FacultyAttendance


class StudentAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttendance
        fields = '__all__'


class StudentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentData
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'confirmpassword': {'write_only': True}
        }

    def create(self, validated_data):
        # Store password as plain text (not recommended for production)
        return StudentData.objects.create(**validated_data)


class FacultyAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyAttendance
        fields = '__all__'





class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }