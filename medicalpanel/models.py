from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UserManager(BaseUserManager):
    """
    Custom User manager
    """

    def _create_user(self, email, password, is_staff, is_superuser, **extra_fields):
        """
        Class method to create a User
        :param email: takes user email
        :param password: takes password
        :param is_staff: Boolean, True if User is staff else False
        :param is_superuser: Boolean, True if User is super user else False
        :param extra_fields: takes extra fields i.e first_name, last_name at the time of user creation
        :return: object of User
        """
        now = timezone.now()
        if not email or not password:
            raise Exception("Email or Password is not given")

        email = self.normalize_email(email)
        user = self.model(email=email, is_staff=is_staff, is_superuser=is_superuser, is_active=True,
                          date_joined=now, last_login=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        """
        This function creates and returns a user
        :param email: takes user email
        :param password: takes password
        :param extra_fields: takes extra fields i.e first_name, last_name at the time of user creation
        :return: object of User
        """
        return self._create_user(email, password, False, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """
        This function creates and returns a super user
        :param email: takes user email
        :param password: takes password
        :param extra_fields: takes extra fields i.e first_name, last_name at the time of user creation
        :return: object of User that is super user
        """
        return self._create_user(email, password, True, True, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Model for the Project
    """
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=80, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'

    class Meta:
        ordering = ['date_joined']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        """
        Function that is called wherever the object is converting to string or printed
        :return: Full name of the user if first_name and last_name exists, else returns email
        """
        if self.first_name and self.last_name:
            return '{} {}'.format(self.first_name, self.last_name)
        return self.email

    @property
    def full_name(self):
        """
        Property to get the full_name of the user, no need to do user.first_name + user.last_name
        :return: Full name of the user
        """
        return '{} {}'.format(self.first_name, self.last_name)
