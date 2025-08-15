from django.contrib import admin
from .models import StudentAttendance, StudentData, Faculty, FacultyAttendance
from import_export.admin import ImportExportModelAdmin

admin.site.register(StudentAttendance)
# admin.site.register(StudentData)
admin.site.register(Faculty)
admin.site.register(FacultyAttendance)

@admin.register(StudentData)
class StudentDataAdmin(ImportExportModelAdmin):
    pass

  