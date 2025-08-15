from django.core.management.base import BaseCommand
from attendance.models import StudentData, StudentAttendance
from django.utils import timezone
from datetime import date, timedelta
import random

class Command(BaseCommand):
    help = 'Add sample student data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Adding sample student data...')
        
        # Sample students
        sample_students = [
            {
                'name': 'John Doe',
                'roll_nu': '101',
                'enrollment_nu': '12345678901234',
                'branch': 'Computer Science',
                'batch': 'CS2023',
                'date_of_birth': date(2000, 1, 15)
            },
            {
                'name': 'Jane Smith',
                'roll_nu': '102',
                'enrollment_nu': '12345678901235',
                'branch': 'Computer Science',
                'batch': 'CS2023',
                'date_of_birth': date(2000, 3, 20)
            },
            {
                'name': 'Mike Johnson',
                'roll_nu': '103',
                'enrollment_nu': '12345678901236',
                'branch': 'Computer Science',
                'batch': 'CS2023',
                'date_of_birth': date(2000, 5, 10)
            },
            {
                'name': 'Sarah Wilson',
                'roll_nu': '201',
                'enrollment_nu': '12345678901237',
                'branch': 'Electrical',
                'batch': 'EE2023',
                'date_of_birth': date(2000, 7, 25)
            },
            {
                'name': 'David Brown',
                'roll_nu': '202',
                'enrollment_nu': '12345678901238',
                'branch': 'Electrical',
                'batch': 'EE2023',
                'date_of_birth': date(2000, 9, 5)
            }
        ]
        
        # Create students
        created_students = []
        for student_data in sample_students:
            student, created = StudentData.objects.get_or_create(
                enrollment_nu=student_data['enrollment_nu'],
                defaults=student_data
            )
            if created:
                created_students.append(student)
                self.stdout.write(f'Created student: {student.name}')
            else:
                self.stdout.write(f'Student already exists: {student.name}')
        
        # Add some attendance records for the last 10 days
        self.stdout.write('Adding sample attendance records...')
        
        for student in StudentData.objects.all():
            for i in range(10):
                attendance_date = timezone.now().date() - timedelta(days=i)
                
                # Check if attendance record already exists
                existing = StudentAttendance.objects.filter(
                    enrollment_no=student.enrollment_nu,
                    date=attendance_date
                ).first()
                
                if not existing:
                    # Randomly mark present or absent (70% present rate)
                    present = 1 if random.random() < 0.7 else 0
                    
                    StudentAttendance.objects.create(
                        name=student.name,
                        enrollment_no=student.enrollment_nu,
                        batch=student.batch,
                        branch=student.branch,
                        roll_no=student.roll_nu,
                        present=present,
                        date=attendance_date,
                        faculty_name="Sample Faculty"  # Add faculty name
                    )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully added {len(created_students)} new students and attendance records'
            )
        ) 