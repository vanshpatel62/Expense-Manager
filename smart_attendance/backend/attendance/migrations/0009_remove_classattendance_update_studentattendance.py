# Generated manually

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0008_classattendance'),
    ]

    operations = [
        # Add faculty_name field to StudentAttendance
        migrations.AddField(
            model_name='studentattendance',
            name='faculty_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        # Remove ClassAttendance model
        migrations.DeleteModel(
            name='ClassAttendance',
        ),
    ] 