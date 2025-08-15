# Generated manually

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0009_remove_classattendance_update_studentattendance'),
    ]

    operations = [
        # Update the date field to remove auto_now_add=True
        migrations.AlterField(
            model_name='studentattendance',
            name='date',
            field=models.DateField(),
        ),
    ] 