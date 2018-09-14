from django.db import models


class GenericMode(models.Model):

    class Meta:
        abstract = True


class Banner(GenericMode):
    HEADER = 'Header'
    FEATURE = 'Feature'
    CONSULTANTS = 'Consultants'
    RECENT_BLOG = 'Recent Blog'
    CONTACT_US = 'Contact Us'
    FOOTER = 'Footer'
    AVAILABLE_CHOICES = [
        (HEADER, HEADER),
        (FEATURE, FEATURE),
        (CONSULTANTS, CONSULTANTS),
        (RECENT_BLOG, RECENT_BLOG),
        (CONTACT_US, CONTACT_US),
        (FOOTER, FOOTER)
    ]
    title = models.CharField(max_length=500)
    code = models.CharField(max_length=50, choices=AVAILABLE_CHOICES)
    short_description = models.CharField(max_length=1500)
    image = models.ImageField(null=True, blank=True)
    number = models.CharField(null=True, blank=True, max_length=20)

    def __str__(self):
        return '{}-{}'.format(self.title, self.code)


class Appointment(GenericMode):
    patient_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    appointment_date = models.DateField()
    message = models.TextField()

    def __str__(self):
        return '{}'.format(self.patient_name)


class Consultant(GenericMode):
    name = models.CharField(max_length=100)
    image = models.ImageField()
    description = models.CharField(max_length=100)

    def __str__(self):
        return '{}'.format(self.name)


class Input(GenericMode):
    clients_served = models.CharField(max_length=100000)
    x_rays_done = models.CharField(max_length=100000)
    worldwide_stuff = models.CharField(max_length=100000)
    lives_saved = models.CharField(max_length=100000)

    def __str__(self):
        return "Input"


class BlogPost(GenericMode):
    blog_title = models.CharField(max_length=250)
    image = models.ImageField()
    blog_description = models.TextField()
    author = models.CharField(max_length=250, null=True, blank=True)
    # user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    created_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '{}'.format(self.blog_title)


class Newsletter(GenericMode):
    email = models.EmailField(max_length=250)
    dated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '{}'.format(self.email)
