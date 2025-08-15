#!/usr/bin/env python
"""
Script to migrate ClassAttendance data to StudentAttendance before removing ClassAttendance model.
Run this before applying the migration that removes ClassAttendance.
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from attendance.models import ClassAttendance, StudentAttendance, StudentData

def migrate_class_attendance_data():
    print("Starting migration of ClassAttendance data to StudentAttendance...")
    
    # Get all ClassAttendance records
    class_attendance_records = ClassAttendance.objects.all()
    print(f"Found {class_attendance_records.count()} ClassAttendance records to migrate")
    
    migrated_count = 0
    skipped_count = 0
    
    for record in class_attendance_records:
        try:
            # Check if a StudentAttendance record already exists for this student and date
            existing = StudentAttendance.objects.filter(
                enrollment_no=record.enrollment_no,
                date=record.date
            ).first()
            
            if existing:
                print(f"Skipping duplicate record for {record.student_name} on {record.date}")
                skipped_count += 1
                continue
            
            # Try to find the student in StudentData to get complete information
            try:
                student = StudentData.objects.get(enrollment_nu=record.enrollment_no)
                # Create StudentAttendance record with complete student data
                StudentAttendance.objects.create(
                    name=student.name,
                    enrollment_no=student.enrollment_nu,
                    batch=student.batch,
                    branch=student.branch,
                    roll_no=student.roll_nu,
                    present=record.present,
                    date=record.date,
                    faculty_name=record.faculty_name
                )
            except StudentData.DoesNotExist:
                # If student not found in StudentData, create with ClassAttendance data
                StudentAttendance.objects.create(
                    name=record.student_name,
                    enrollment_no=record.enrollment_no,
                    batch=record.batch,
                    branch=record.branch,
                    roll_no='',  # No roll number available from ClassAttendance
                    present=record.present,
                    date=record.date,
                    faculty_name=record.faculty_name
                )
            
            migrated_count += 1
            print(f"Migrated record for {record.student_name} on {record.date}")
            
        except Exception as e:
            print(f"Error migrating record {record.id}: {e}")
            skipped_count += 1
    
    print(f"\nMigration completed!")
    print(f"Successfully migrated: {migrated_count} records")
    print(f"Skipped: {skipped_count} records")
    
    # Show summary of StudentAttendance records
    total_student_attendance = StudentAttendance.objects.count()
    print(f"Total StudentAttendance records: {total_student_attendance}")

if __name__ == "__main__":
    migrate_class_attendance_data() 