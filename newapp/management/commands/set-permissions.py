from django.core.management import BaseCommand
from django.contrib.auth.models import Group, ContentType, Permission


class Command(BaseCommand):
    def handle(self, *args, **options):
        permissions_defs = {
            'can_add_admin': 'Can add an admin',
            'can_remove_admin': 'Can remove an admin',
            'can_add_doctor': 'Can add a doctor',
            'can_remove_doctor': 'Can remove a doctor',
            'can_see_patient': 'Can see a patient',
        }
        groups_and_permissions = {
            'Admin': [
                'can_add_admin',
                'can_remove_admin',
                'can_add_doctor',
                'can_remove_doctor'
            ],
            'Doctor': {
                'can_see_patient'
            }
        }

        for perm in permissions_defs:
            ct, _ = ContentType.objects.get_or_create(app_label='auth', model='permission')
            Permission.objects.create(codename=perm, name=permissions_defs[perm], content_type=ct)

        for group in groups_and_permissions:
            grp, _ = Group.objects.get_or_create(name=group)
            for perm in groups_and_permissions[group]:
                p = Permission.objects.get(codename=perm)
                grp.permissions.add(p)
