# from celery import shared_task
# from django.utils import timezone
# from .models import Employe,Pointing,Code


# @shared_task
# def check_and_mark_absences():
#     today = timezone.now().date()
#     absent_employes = Employe.objects.exclude(pointing__date=today)
#     absence_code , _ = Code.objects.get_or_create(name="A")
    
#     for employe in absent_employes:
#         Pointing.objects.create(
#             employe=employe,
#             code = absence_code
#         )