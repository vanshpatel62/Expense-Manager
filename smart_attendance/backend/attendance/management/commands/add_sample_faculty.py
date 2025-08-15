from django.core.management.base import BaseCommand
from attendance.models import Faculty

class Command(BaseCommand):
    help = 'Add sample faculty data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Adding sample faculty data...')
        
        # Sample faculty
        sample_faculty = [
            {
                'name': 'Dr. Robert Johnson',
                'email': 'robert.johnson@university.edu',
                'phone': '9876543210',
                'password': 'Faculty@123',
                'confirmpassword': 'Faculty@123'
            },
            {
                'name': 'Prof. Mary Williams',
                'email': 'mary.williams@university.edu',
                'phone': '9876543211',
                'password': 'Faculty@123',
                'confirmpassword': 'Faculty@123'
            }
        ]
        
        # Create faculty
        created_faculty = []
        for faculty_data in sample_faculty:
            faculty, created = Faculty.objects.get_or_create(
                email=faculty_data['email'],
                defaults={
                    'name': faculty_data['name'],
                    'phone': faculty_data['phone'],
                    'password': faculty_data['password'],
                    'confirmpassword': faculty_data['confirmpassword']
                }
            )
            if created:
                created_faculty.append(faculty)
                self.stdout.write(f'Created faculty: {faculty.name}')
            else:
                self.stdout.write(f'Faculty already exists: {faculty.name}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully added {len(created_faculty)} new faculty members'
            )
        )
        
        # Print login credentials
        self.stdout.write('\nFaculty Login Credentials:')
        for faculty in Faculty.objects.all():
            self.stdout.write(f'Email: {faculty.email}, Password: Faculty@123') 