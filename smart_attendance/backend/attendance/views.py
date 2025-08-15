from django.shortcuts import render
from rest_framework import generics
from .models import StudentAttendance, StudentData, Faculty, FacultyAttendance
from .serializers import StudentAttendanceSerializer, StudentDataSerializer, FacultySerializer, FacultyAttendanceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.core.exceptions import ValidationError
from django.utils import timezone
import re
import io
import pandas as pd
import matplotlib.pyplot as plt
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .models import StudentAttendance  # Use the correct model name
from datetime import date

class StudentAttendanceListCreate(generics.ListCreateAPIView):
    queryset = StudentAttendance.objects.all()
    serializer_class = StudentAttendanceSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        # Instead of User.objects.create_user, use User.objects.create for plain text password
        user = User.objects.create(username=username, password=password)
        return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)

class StudentDataListCreate(generics.ListCreateAPIView):
    queryset = StudentData.objects.all()
    serializer_class = StudentDataSerializer


class FacultySignupView(APIView):
    permission_classes = [AllowAny]

    def validate_name(self, name):
        """Validate name contains only letters and spaces"""
        if not re.match(r'^[A-Za-z\s]+$', name):
            return False, "Name can only contain letters (A-Z) and spaces"
        return True, ""

    def validate_email(self, email):
        """Validate email format"""
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            return False, "Please enter a valid email address"
        return True, ""

    def validate_phone(self, phone):
        """Validate phone number is exactly 10 digits"""
        if not re.match(r'^\d{10}$', phone):
            return False, "Phone number must be exactly 10 digits"
        return True, ""

    def validate_password(self, password):
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        return True, ""
    
    
    def validate_confirmpassword(self,password,confirmpassword):
        
        if password!=confirmpassword:
            return False,"Password and confirmpassword is not match"
        return True,""

    def post(self, request):
        try:
            # Extract data from request
            name = request.data.get('name', '').strip()
            email = request.data.get('email', '').strip()
            phone = request.data.get('phone', '').strip()
            password = request.data.get('password', '')
            confirmpassword=request.data.get('confirmpassword','')

            # Validate required fields
            if not all([name, email, phone, password,confirmpassword]):
                return Response({
                    'error': 'All fields are required: name, email, department, employee_id, phone, password'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate name format
            is_valid_name, name_error = self.validate_name(name)
            if not is_valid_name:
                return Response({'error': name_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate email format
            is_valid_email, email_error = self.validate_email(email)
            if not is_valid_email:
                return Response({'error': email_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate phone format
            is_valid_phone, phone_error = self.validate_phone(phone)
            if not is_valid_phone:
                return Response({'error': phone_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate password strength
            is_valid_password, password_error = self.validate_password(password)
            if not is_valid_password:
                return Response({'error': password_error}, status=status.HTTP_400_BAD_REQUEST)
            
            
            is_valid_confirmpassword, confirmpassword_error = self.validate_confirmpassword(password,confirmpassword)
            if not is_valid_confirmpassword:
                return Response({'error': confirmpassword_error}, status=status.HTTP_400_BAD_REQUEST)
            
            
            # if password != confirmpassword:
            #     return Response({
            #         'error': 'Passwords do not match'
            #     }, status=status.HTTP_400_BAD_REQUEST)

            # Check if faculty with same email or employee_id already exists
            if Faculty.objects.filter(email=email).exists():
                return Response({
                    'error': 'Faculty with this email already exists.'
                }, status=status.HTTP_400_BAD_REQUEST)

            

            # Hash the password
            # hashed_password = make_password(password)
            # hashed_conformassword = make_password(confirmpassword)
            

            # Create faculty object
            faculty = Faculty.objects.create(
                name=name,
                email=email,
                phone=phone,
                password=password,
                confirmpassword=confirmpassword
            )

            return Response({
                'message': 'Faculty registered successfully.',
                'faculty_id': faculty.id,
                'name': faculty.name,
                'email': faculty.email,
                'phone':faculty.phone,
                
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': f'Registration failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacultyListCreate(generics.ListCreateAPIView):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer


class StudentLoginView(APIView):
    permission_classes = [AllowAny]

    def validate_enrollment_number(self, enrollment_nu):
        """Validate enrollment number is exactly 14 digits"""
        if not re.match(r'^\d{14}$', enrollment_nu):
            return False, "Enrollment number must be exactly 14 digits"
        return True, ""

    def post(self, request):
        try:
            # Extract data from request
            enrollment_nu = request.data.get('enrollment_nu', '').strip()
            password = request.data.get('password', '')

            # Validate required fields
            if not enrollment_nu or not password:
                return Response({
                    'error': 'Enrollment number and password are required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate enrollment number format
            is_valid_enrollment, enrollment_error = self.validate_enrollment_number(enrollment_nu)
            if not is_valid_enrollment:
                return Response({'error': enrollment_error}, status=status.HTTP_400_BAD_REQUEST)

            # Check if student exists
            try:
                student = StudentData.objects.get(enrollment_nu=enrollment_nu)
            except StudentData.DoesNotExist:
                return Response({
                    'error': 'Student not found with this enrollment number.'
                }, status=status.HTTP_404_NOT_FOUND)

            # Check if student has a password set
            if not student.password:
                return Response({
                    'error': 'Student account not properly set up. Please contact administrator.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Check password (plain text comparison)
            if password != student.password:
                return Response({
                    'error': 'Invalid password.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Return success response with student data
            return Response({
                'message': 'Login successful!',
                'student': {
                    'id': student.id,
                    'name': student.name,
                    'enrollment_nu': student.enrollment_nu,
                    'roll_nu': student.roll_nu,
                    'branch': student.branch,
                    'batch': student.batch,
                    'date_of_birth': student.date_of_birth
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Login failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacultyAttendanceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Extract data from request
            faculty_name = request.data.get('faculty_name', '')
            email = request.data.get('email', '')
            phone_no = request.data.get('phone_no', '')
            present = request.data.get('present', 0)
            date = request.data.get('date', None)

            # Validate required fields
            if not all([faculty_name, email, phone_no]):
                return Response({
                    'error': 'Faculty name, email, and phone number are required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Process the date
            if date:
                # Convert string date to date object
                try:
                    from datetime import datetime
                    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
                except ValueError:
                    return Response({
                        'error': 'Invalid date format. Please use YYYY-MM-DD format.'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Use today's date if no date provided
                date_obj = timezone.now().date()

            # Check if attendance already exists for this faculty on this specific date
            existing_attendance = FacultyAttendance.objects.filter(
                email=email, 
                date=date_obj
            ).first()

            if existing_attendance:
                # Update existing attendance for the same date
                existing_attendance.present = present
                existing_attendance.save()
                message = f"Attendance updated successfully for {date_obj}!"
            else:
                # Create new attendance record for this date
                attendance_data = {
                    'faculty_name': faculty_name,
                    'email': email,
                    'phone_no': phone_no,
                    'present': present,
                    'date': date_obj
                }
                
                FacultyAttendance.objects.create(**attendance_data)
                message = f"Attendance marked successfully for {date_obj}!"

            return Response({
                'message': message,
                'faculty_name': faculty_name,
                'email': email,
                'present': present,
                'date': str(date_obj)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': f'Failed to mark attendance: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacultyAttendanceHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            email = request.query_params.get('email', '')
            
            if not email:
                return Response({
                    'error': 'Email parameter is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get all attendance records for this faculty
            attendance_records = FacultyAttendance.objects.filter(
                email=email
            ).order_by('-date')  # Most recent first

            # Serialize the data
            attendance_data = []
            for record in attendance_records:
                attendance_data.append({
                    'id': record.id,
                    'faculty_name': record.faculty_name,
                    'email': record.email,
                    'phone_no': record.phone_no,
                    'present': record.present,
                    'date': record.date,
                    'status': 'Present' if record.present == 1 else 'Absent'
                })

            return Response({
                'faculty_email': email,
                'total_records': len(attendance_data),
                'attendance_history': attendance_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to fetch attendance history: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacultyLoginView(APIView):
    permission_classes = [AllowAny]

    def validate_email(self, email):
        """Validate email format"""
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            return False, "Please enter a valid email address"
        return True, ""

    def post(self, request):
        try:
            # Extract data from request
            email = request.data.get('email', '').strip()
            password = request.data.get('password', '')

            # Validate required fields
            if not email or not password:
                return Response({
                    'error': 'Email and password are required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate email format
            is_valid_email, email_error = self.validate_email(email)
            if not is_valid_email:
                return Response({'error': email_error}, status=status.HTTP_400_BAD_REQUEST)

            # Check if faculty exists
            try:
                faculty = Faculty.objects.get(email=email)
            except Faculty.DoesNotExist:
                return Response({
                    'error': 'Faculty not found with this email.'
                }, status=status.HTTP_404_NOT_FOUND)

            # Check if faculty has a password set
            if not faculty.password:
                return Response({
                    'error': 'Faculty account not properly set up. Please contact administrator.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Check password (plain text comparison)
            if password != faculty.password:
                return Response({
                    'error': 'Invalid password.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Return success response with faculty data
            return Response({
                'message': 'Login successful!',
                'faculty': {
                    'id': faculty.id,
                    'name': faculty.name,
                    'email': faculty.email,
                    'phone': faculty.phone
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Login failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentAttendanceHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            from django.utils import timezone
            enrollment_nu = request.GET.get('enrollment_nu')
            
            if not enrollment_nu:
                return Response({
                    'error': 'Enrollment number is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get all attendance records
            attendance_records = StudentAttendance.objects.filter(
                enrollment_no=enrollment_nu
            ).order_by('-date')

            # Serialize the data
            attendance_data = []
            today = timezone.now().date()
            today_attendance = None
            for record in attendance_records:
                record_data = {
                    'id': record.id,
                    'date': record.date,
                    'present': record.present,
                    'status': 'Present' if record.present == 1 else 'Absent'
                }
                attendance_data.append(record_data)
                if record.date == today:
                    today_attendance = record_data

            if today_attendance is None:
                today_attendance = {'message': 'Today attendance not available'}

            return Response({
                'today_attendance': today_attendance,
                'attendance_history': attendance_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to fetch attendance history: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BatchListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            print("BatchListView: Fetching all batches...")
            # Get all unique batches from StudentData
            batches = StudentData.objects.values_list('batch', flat=True).distinct().order_by('batch')
            
            batch_list = list(batches)
            print(f"BatchListView: Found batches: {batch_list}")
            
            response_data = {
                'batches': batch_list,
                'total_batches': len(batch_list)
            }
            print(f"BatchListView: Returning response: {response_data}")
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to fetch batches: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentsByBatchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            batch = request.query_params.get('batch', '')
            print(f"Received request for batch: '{batch}'")
            
            if not batch:
                return Response({
                    'error': 'Batch parameter is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get all students from the specified batch
            students = StudentData.objects.filter(batch=batch).order_by('roll_nu')
            print(f"Found {students.count()} students for batch '{batch}'")
            
            # Debug: Print all available batches
            all_batches = StudentData.objects.values_list('batch', flat=True).distinct()
            print(f"All available batches: {list(all_batches)}")

            # Serialize the data
            students_data = []
            for student in students:
                students_data.append({
                    'id': student.id,
                    'name': student.name,
                    'roll_nu': student.roll_nu,
                    'enrollment_nu': student.enrollment_nu,
                    'branch': student.branch,
                    'batch': student.batch
                })

            response_data = {
                'batch': batch,
                'students': students_data,
                'total_students': len(students_data)
            }
            print(f"Returning response: {response_data}")
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to fetch students: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClassAttendanceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            attendance_data = request.data.get('attendance_data', [])
            faculty_name = request.data.get('faculty_name', '')
            date = request.data.get('date', None)

            if not attendance_data:
                return Response({
                    'error': 'Attendance data is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Process the date
            if date:
                try:
                    from datetime import datetime
                    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
                except ValueError:
                    return Response({
                        'error': 'Invalid date format. Please use YYYY-MM-DD format.'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                date_obj = timezone.now().date()

            # Delete existing attendance records for this date and batch
            if attendance_data:
                first_student = attendance_data[0]
                batch = first_student.get('batch', '')
                if batch:
                    StudentAttendance.objects.filter(date=date_obj, batch=batch).delete()

            # Create new attendance records
            created_records = []
            for student_data in attendance_data:
                # Get student data to populate additional fields
                try:
                    student = StudentData.objects.get(enrollment_nu=student_data.get('enrollment_no', ''))
                    attendance_record = StudentAttendance.objects.create(
                        name=student.name,
                        enrollment_no=student.enrollment_nu,
                        batch=student.batch,
                        branch=student.branch,
                        roll_no=student.roll_nu,
                        present=student_data.get('present', 0),
                        date=date_obj,
                        faculty_name=faculty_name
                    )
                    created_records.append({
                        'id': attendance_record.id,
                        'name': attendance_record.name,
                        'enrollment_no': attendance_record.enrollment_no,
                        'batch': attendance_record.batch,
                        'branch': attendance_record.branch,
                        'roll_no': attendance_record.roll_no,
                        'present': attendance_record.present,
                        'date': attendance_record.date
                    })
                except StudentData.DoesNotExist:
                    # If student not found, create with provided data
                    attendance_record = StudentAttendance.objects.create(
                        name=student_data.get('student_name', ''),
                        enrollment_no=student_data.get('enrollment_no', ''),
                        batch=student_data.get('batch', ''),
                        branch=student_data.get('branch', ''),
                        roll_no=student_data.get('roll_no', ''),
                        present=student_data.get('present', 0),
                        date=date_obj,
                        faculty_name=faculty_name
                    )
                    created_records.append({
                        'id': attendance_record.id,
                        'name': attendance_record.name,
                        'enrollment_no': attendance_record.enrollment_no,
                        'batch': attendance_record.batch,
                        'branch': attendance_record.branch,
                        'roll_no': attendance_record.roll_no,
                        'present': attendance_record.present,
                        'date': attendance_record.date
                    })

            # Order the created_records by roll_no
            created_records = sorted(created_records, key=lambda x: x.get('roll_no', ''))

            return Response({
                'message': f'Class attendance marked successfully for {date_obj}!',
                'total_students': len(created_records),
                'attendance_records': created_records
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': f'Failed to mark class attendance: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClassAttendanceHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            batch = request.query_params.get('batch', '')
            date = request.query_params.get('date', '')
            
            if not batch:
                return Response({
                    'error': 'Batch parameter is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Build the filter
            filter_params = {'batch': batch}
            if date:
                try:
                    from datetime import datetime
                    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
                    filter_params['date'] = date_obj
                except ValueError:
                    return Response({
                        'error': 'Invalid date format. Please use YYYY-MM-DD format.'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Get attendance records
            attendance_records = StudentAttendance.objects.filter(**filter_params).order_by('-date', 'roll_no')

            # Serialize the data
            attendance_data = []
            for record in attendance_records:
                attendance_data.append({
                    'id': record.id,
                    'student_name': record.name,
                    'roll_no': record.roll_no,
                    'enrollment_no': record.enrollment_no,
                    'batch': record.batch,
                    'branch': record.branch,
                    'present': record.present,
                    'date': record.date,
                    'faculty_name': record.faculty_name,
                    'status': 'Present' if record.present == 1 else 'Absent'
                })

            return Response({
                'batch': batch,
                'total_records': len(attendance_data),
                'attendance_history': attendance_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to fetch class attendance history: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentAttendanceStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            enrollment_nu = request.query_params.get('enrollment_nu', '')
            
            if enrollment_nu:
                # Get stats for specific student
                attendance_records = StudentAttendance.objects.filter(
                    enrollment_no=enrollment_nu
                )

                # Calculate statistics
                total_records = attendance_records.count()
                present_count = attendance_records.filter(present=1).count()
                absent_count = attendance_records.filter(present=0).count()
                
                attendance_percentage = (present_count / total_records * 100) if total_records > 0 else 0

                return Response({
                    'enrollment_nu': enrollment_nu,
                    'total_records': total_records,
                    'present_count': present_count,
                    'absent_count': absent_count,
                    'attendance_percentage': round(attendance_percentage, 2)
                }, status=status.HTTP_200_OK)
            else:
                # Get stats for all students
                students_stats = []
                
                # Get all unique students from StudentData
                students = StudentData.objects.all()
                
                for student in students:
                    # Get attendance records for this student
                    attendance_records = StudentAttendance.objects.filter(
                        enrollment_no=student.enrollment_nu
                    )
                    
                    # Calculate statistics
                    total_lectures = attendance_records.count()
                    present_lectures = attendance_records.filter(present=1).count()
                    absent_lectures = attendance_records.filter(present=0).count()
                    
                    attendance_percentage = (present_lectures / total_lectures * 100) if total_lectures > 0 else 0
                    
                    students_stats.append({
                        'student_id': student.id,
                        'name': student.name,
                        'roll_nu': student.roll_nu,
                        'enrollment_nu': student.enrollment_nu,
                        'batch': student.batch,
                        'branch': student.branch,
                        'total_lectures': total_lectures,
                        'present_lectures': present_lectures,
                        'absent_lectures': absent_lectures,
                        'attendance_percentage': round(attendance_percentage, 2)
                    })

                return Response({
                    'students_stats': students_stats,
                    'total_students': len(students_stats)
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to fetch attendance stats: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def validate_enrollment_number(self, enrollment_nu):
        """Validate enrollment number is exactly 14 digits"""
        if not re.match(r'^\d{14}$', enrollment_nu):
            return False, "Enrollment number must be exactly 14 digits"
        return True, ""

    def validate_password(self, password):
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        return True, ""

    def validate_confirmpassword(self, password, confirmpassword):
        """Validate password confirmation"""
        if password != confirmpassword:
            return False, "Password and confirm password do not match"
        return True, ""

    def post(self, request):
        try:
            # Extract data from request
            enrollment_nu = request.data.get('enrollment_nu', '').strip()
            new_password = request.data.get('new_password', '')
            confirm_password = request.data.get('confirm_password', '')

            # Validate required fields
            if not enrollment_nu or not new_password or not confirm_password:
                return Response({
                    'error': 'Enrollment number, new password, and confirm password are required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate enrollment number format
            is_valid_enrollment, enrollment_error = self.validate_enrollment_number(enrollment_nu)
            if not is_valid_enrollment:
                return Response({'error': enrollment_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate password strength
            is_valid_password, password_error = self.validate_password(new_password)
            if not is_valid_password:
                return Response({'error': password_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate password confirmation
            is_valid_confirm, confirm_error = self.validate_confirmpassword(new_password, confirm_password)
            if not is_valid_confirm:
                return Response({'error': confirm_error}, status=status.HTTP_400_BAD_REQUEST)

            # Check if student exists
            try:
                student = StudentData.objects.get(enrollment_nu=enrollment_nu)
            except StudentData.DoesNotExist:
                return Response({
                    'error': 'Student not found with this enrollment number.'
                }, status=status.HTTP_404_NOT_FOUND)

            # Update password and confirm password
            student.password = new_password
            student.confirmpassword = confirm_password
            student.save()

            return Response({
                'message': 'Password updated successfully! You can now login with your new password.'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Password update failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacultyForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def validate_email(self, email):
        """Validate email format"""
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            return False, "Please enter a valid email address"
        return True, ""

    def validate_password(self, password):
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        return True, ""

    def validate_confirmpassword(self, password, confirmpassword):
        if password != confirmpassword:
            return False, "Password and confirm password do not match"
        return True, ""

    def post(self, request):
        try:
            # Extract data from request
            email = request.data.get('email', '').strip()
            password = request.data.get('password', '')
            confirmpassword = request.data.get('confirmpassword', '')

            # Validate required fields
            if not all([email, password, confirmpassword]):
                return Response({
                    'error': 'All fields are required: email, password, confirmpassword'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate email format
            is_valid_email, email_error = self.validate_email(email)
            if not is_valid_email:
                return Response({'error': email_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate password strength
            is_valid_password, password_error = self.validate_password(password)
            if not is_valid_password:
                return Response({'error': password_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate confirm password
            is_valid_confirm, confirm_error = self.validate_confirmpassword(password, confirmpassword)
            if not is_valid_confirm:
                return Response({'error': confirm_error}, status=status.HTTP_400_BAD_REQUEST)

            # Check if faculty exists
            try:
                faculty = Faculty.objects.get(email=email)
            except Faculty.DoesNotExist:
                return Response({
                    'error': 'Faculty with this email does not exist.'
                }, status=status.HTTP_404_NOT_FOUND)

            # Update faculty password
            faculty.password = password
            faculty.save()

            return Response({
                'message': 'Password updated successfully. You can now login with your new password.'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentProfileUpdateView(APIView):
    permission_classes = [AllowAny]

    def validate_name(self, name):
        """Validate name contains only letters and spaces"""
        if not name or not name.strip():
            return False, "Name is required"
        if not re.match(r'^[A-Za-z\s]+$', name.strip()):
            return False, "Name can only contain letters (A-Z) and spaces"
        if len(name.strip()) < 2:
            return False, "Name must be at least 2 characters long"
        return True, ""

    def validate_roll_number(self, roll_nu):
        """Validate roll number"""
        if not roll_nu or not roll_nu.strip():
            return False, "Roll number is required"
        return True, ""

    def validate_date_of_birth(self, date_of_birth):
        """Validate date of birth"""
        if not date_of_birth:
            return False, "Date of birth is required"
        try:
            from datetime import datetime
            dob = datetime.strptime(date_of_birth, '%Y-%m-%d')
            today = datetime.now()
            if dob > today:
                return False, "Date of birth cannot be in the future"
            return True, ""
        except ValueError:
            return False, "Invalid date format"

    def validate_password(self, password):
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        return True, ""

    def put(self, request, enrollment_nu):
        try:
            # Extract data from request
            name = request.data.get('name', '').strip()
            roll_nu = request.data.get('roll_nu', '').strip()
            date_of_birth = request.data.get('date_of_birth', '')
            new_password = request.data.get('new_password', '')
            confirm_password = request.data.get('confirm_password', '')

            # Validate required fields
            if not all([name, roll_nu, date_of_birth]):
                return Response({
                    'error': 'All fields are required: name, roll_nu, date_of_birth'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate name
            is_valid_name, name_error = self.validate_name(name)
            if not is_valid_name:
                return Response({'error': name_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate roll number
            is_valid_roll, roll_error = self.validate_roll_number(roll_nu)
            if not is_valid_roll:
                return Response({'error': roll_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate date of birth
            is_valid_dob, dob_error = self.validate_date_of_birth(date_of_birth)
            if not is_valid_dob:
                return Response({'error': dob_error}, status=status.HTTP_400_BAD_REQUEST)

            # Password validation (if provided)
            if new_password or confirm_password:
                if not new_password:
                    return Response({'error': 'New password is required if changing password.'}, status=status.HTTP_400_BAD_REQUEST)
                if not confirm_password:
                    return Response({'error': 'Please confirm your new password.'}, status=status.HTTP_400_BAD_REQUEST)
                if new_password != confirm_password:
                    return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
                is_valid_pw, pw_error = self.validate_password(new_password)
                if not is_valid_pw:
                    return Response({'error': pw_error}, status=status.HTTP_400_BAD_REQUEST)

            # Check if student exists
            try:
                student = StudentData.objects.get(enrollment_nu=enrollment_nu)
            except StudentData.DoesNotExist:
                return Response({
                    'error': 'Student with this enrollment number does not exist.'
                }, status=status.HTTP_404_NOT_FOUND)

            # Update student profile
            student.name = name
            student.roll_nu = roll_nu
            student.date_of_birth = date_of_birth
            if new_password:
                student.password = new_password  # NOTE: This assumes password is stored in plain text. Use hashing in production!
            student.save()

            return Response({
                'success': True,
                'message': 'Profile updated successfully.' + (' Password changed.' if new_password else ''),
                'student': {
                    'name': student.name,
                    'enrollment_nu': student.enrollment_nu,
                    'roll_nu': student.roll_nu,
                    'date_of_birth': student.date_of_birth,
                    'branch': student.branch,
                    'batch': student.batch
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacultyProfileUpdateView(APIView):
    permission_classes = [AllowAny]

    def validate_name(self, name):
        """Validate name contains only letters and spaces"""
        if not name or not name.strip():
            return False, "Name is required"
        if not re.match(r'^[A-Za-z\s]+$', name.strip()):
            return False, "Name can only contain letters (A-Z) and spaces"
        if len(name.strip()) < 2:
            return False, "Name must be at least 2 characters long"
        return True, ""

    def validate_email(self, email):
        """Validate email format"""
        if not email or not email.strip():
            return False, "Email is required"
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email.strip()):
            return False, "Please enter a valid email address"
        return True, ""

    def validate_phone(self, phone):
        """Validate phone number is exactly 10 digits"""
        if not phone or not phone.strip():
            return False, "Phone number is required"
        if not re.match(r'^\d{10}$', phone.strip()):
            return False, "Phone number must be exactly 10 digits"
        return True, ""

    def validate_password(self, password):
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        return True, ""

    def put(self, request, email):
        try:
            # Extract data from request
            name = request.data.get('name', '').strip()
            new_email = request.data.get('email', '').strip()
            phone = request.data.get('phone', '').strip()
            new_password = request.data.get('new_password', '')
            confirm_password = request.data.get('confirm_password', '')

            # Validate required fields
            if not all([name, new_email, phone]):
                return Response({
                    'error': 'All fields are required: name, email, phone'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate name
            is_valid_name, name_error = self.validate_name(name)
            if not is_valid_name:
                return Response({'error': name_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate email
            is_valid_email, email_error = self.validate_email(new_email)
            if not is_valid_email:
                return Response({'error': email_error}, status=status.HTTP_400_BAD_REQUEST)

            # Validate phone
            is_valid_phone, phone_error = self.validate_phone(phone)
            if not is_valid_phone:
                return Response({'error': phone_error}, status=status.HTTP_400_BAD_REQUEST)

            # Password validation (if provided)
            if new_password or confirm_password:
                if not new_password:
                    return Response({'error': 'New password is required if changing password.'}, status=status.HTTP_400_BAD_REQUEST)
                if not confirm_password:
                    return Response({'error': 'Please confirm your new password.'}, status=status.HTTP_400_BAD_REQUEST)
                if new_password != confirm_password:
                    return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
                is_valid_pw, pw_error = self.validate_password(new_password)
                if not is_valid_pw:
                    return Response({'error': pw_error}, status=status.HTTP_400_BAD_REQUEST)

            # Check if faculty exists
            try:
                faculty = Faculty.objects.get(email=email)
            except Faculty.DoesNotExist:
                return Response({
                    'error': 'Faculty with this email does not exist.'
                }, status=status.HTTP_404_NOT_FOUND)

            # Check if new email already exists (if changing email)
            if new_email != email:
                if Faculty.objects.filter(email=new_email).exists():
                    return Response({
                        'error': 'Email address is already in use by another faculty member.'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Update faculty profile
            faculty.name = name
            faculty.email = new_email
            faculty.phone = phone
            if new_password:
                faculty.password = new_password  # NOTE: This assumes password is stored in plain text. Use hashing in production!
            faculty.save()

            return Response({
                'success': True,
                'message': 'Profile updated successfully.' + (' Password changed.' if new_password else ''),
                'faculty': {
                    'name': faculty.name,
                    'email': faculty.email,
                    'phone': faculty.phone,
                    
                    
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacultyAbsentTodayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        branch = request.GET.get('branch', None)
        today = date.today()
        # Get all students in the branch
        students_qs = StudentData.objects.all()
        if branch:
            students_qs = students_qs.filter(branch=branch)
        students = list(students_qs)
        # Get all students who are present today
        present_ids = set(
            StudentAttendance.objects.filter(date=today, present=1).values_list('student_id', flat=True)
        )
        # Absent students = all students in branch - present students
        absent_students = [
            {
                'name': s.name,
                'enrollment_nu': s.enrollment_nu,
                'roll_nu': s.roll_nu,
                'batch': s.batch
            }
            for s in students if s.id not in present_ids
        ]
        return Response({'absent_students': absent_students})

@login_required
def my_attendance_chart(request):
    # Fetch attendance data for the logged-in student
    student = request.user
    attendance_qs = StudentAttendance.objects.filter(student=student).order_by('date')
    if not attendance_qs.exists():
        # Handle no data case
        return HttpResponse("No attendance data.", status=404)

    # Convert to DataFrame
    data = pd.DataFrame(list(attendance_qs.values('date', 'status')))
    # Example: status is 'Present' or 'Absent'
    data['date'] = pd.to_datetime(data['date'])
    data = data.sort_values('date')

    # Calculate cumulative attendance
    data['Present'] = data['status'] == 'Present'
    data['Cumulative'] = data['Present'].cumsum()

    # Plot
    plt.figure(figsize=(8, 4))
    plt.plot(data['date'], data['Cumulative'], marker='o')
    plt.title('My Attendance Over Time')
    plt.xlabel('Date')
    plt.ylabel('Cumulative Presents')
    plt.tight_layout()

    # Save to buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)

    return HttpResponse(buf.getvalue(), content_type='image/png')