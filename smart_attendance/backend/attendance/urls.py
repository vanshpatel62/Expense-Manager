from django.urls import path
from .views import StudentAttendanceListCreate, RegisterView, FacultySignupView, FacultyListCreate, StudentLoginView, FacultyLoginView, FacultyAttendanceView, FacultyAttendanceHistoryView, StudentAttendanceHistoryView, BatchListView, StudentsByBatchView, ClassAttendanceView, ClassAttendanceHistoryView, StudentAttendanceStatsView, StudentForgotPasswordView, FacultyForgotPasswordView, StudentProfileUpdateView, FacultyProfileUpdateView, FacultyAbsentTodayView
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework_simplejwt.views import TokenRefreshView
from .views import StudentDataListCreate
from . import views

urlpatterns = [
    path('student-attendance/', StudentAttendanceListCreate.as_view(), name='student-attendance-list-create'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('signup/', RegisterView.as_view(), name='signup'),
    path('students/', StudentDataListCreate.as_view(), name='studentdata-list-create'),
    path('students/login/', StudentLoginView.as_view(), name='student-login'),
    path('students/forgot-password/', StudentForgotPasswordView.as_view(), name='student-forgot-password'),
    path('students/update-profile/<str:enrollment_nu>/', StudentProfileUpdateView.as_view(), name='student-profile-update'),
    path('faculty/signup/', FacultySignupView.as_view(), name='faculty-signup'),
    path('faculty/login/', FacultyLoginView.as_view(), name='faculty-login'),
    path('faculty/forgot-password/', FacultyForgotPasswordView.as_view(), name='faculty-forgot-password'),
    path('faculty/update-profile/<str:email>/', FacultyProfileUpdateView.as_view(), name='faculty-profile-update'),
    path('faculty/absent-today/', FacultyAbsentTodayView.as_view(), name='faculty-absent-today'),
    path('faculty/attendance/', FacultyAttendanceView.as_view(), name='faculty-attendance'),
    path('faculty/attendance/history/', FacultyAttendanceHistoryView.as_view(), name='faculty-attendance-history'),
    path('students/attendance/history/', StudentAttendanceHistoryView.as_view(), name='student-attendance-history'),
    path('students/attendance/stats/', StudentAttendanceStatsView.as_view(), name='student-attendance-stats'),
    path('batches/', BatchListView.as_view(), name='batch-list'),
    path('students/by-batch/', StudentsByBatchView.as_view(), name='students-by-batch'),
    path('class-attendance/', ClassAttendanceView.as_view(), name='class-attendance'),
    path('class-attendance/history/', ClassAttendanceHistoryView.as_view(), name='class-attendance-history'),
    path('my-attendance-chart/', views.my_attendance_chart, name='my_attendance_chart'),
]