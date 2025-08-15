from django.db import models





class StudentAttendance(models.Model):
    name = models.CharField(max_length=100)
    enrollment_no = models.CharField(max_length=50)
    batch = models.CharField(max_length=50)
    branch = models.CharField(max_length=100)
    roll_no = models.CharField(max_length=50)
    present = models.IntegerField(default=0)  # 1 for present, 0 for absent
    date = models.DateField()  # Removed auto_now_add=True to allow manual date input
    faculty_name = models.CharField(max_length=100, null=True, blank=True)  # Added faculty name

    def __str__(self):
        return f"{self.name} ({self.enrollment_no}) - {'Present' if self.present == 1 else 'Absent'} - {self.date}"


class StudentData(models.Model):
    name = models.CharField(max_length=100)
    roll_nu = models.CharField(max_length=50)
    enrollment_nu = models.CharField(max_length=50)
    branch = models.CharField(max_length=100)
    batch = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    password = models.CharField(max_length=128, null=True, blank=True)
    confirmpassword = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.roll_nu})"


class Faculty(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=128)
    confirmpassword = models.CharField(max_length=128)  # Store hashed password
    # Store hashed password
    

    def __str__(self):
        return f"{self.name} ({self.email})"


class FacultyAttendance(models.Model):
    faculty_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_no = models.CharField(max_length=15)
    present = models.IntegerField(default=0)  # 1 for present, 0 for absent
    date = models.DateField()

    def __str__(self):
        return f"{self.faculty_name} ({self.email}) - {'Present' if self.present == 1 else 'Absent'} - {self.date}"


