"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()



# class StudentAttendanceHistoryView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         try:
#             enrollment_nu = request.GET.get('enrollment_nu')
            
#             if not enrollment_nu:
#                 return Response({
#                     'error': 'Enrollment number is required.'
#                 }, status=status.HTTP_400_BAD_REQUEST)

#             # Get student attendance records
#             attendance_records = StudentAttendance.objects.filter(
#                 enrollment_no=enrollment_nu
#             ).order_by('-date')

#             # Serialize the data
#             attendance_data = []
#             for record in attendance_records:
#                 attendance_data.append({
#                     'id': record.id,
#                     'date': record.date,
#                     'present': record.present,
#                     'status': 'Present' if record.present == 1 else 'Absent'
#                 })

#             return Response({
#                 'attendance_history': attendance_data
#             }, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({
#                 'error': f'Failed to fetch attendance history: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)