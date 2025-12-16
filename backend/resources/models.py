from django.db import models
from django.core.validators import RegexValidator


class ClaimsPage(models.Model):
    title = models.CharField(max_length=200, default='Claims')
    hero_subtitle = models.CharField(max_length=300, blank=True)
    hero_image = models.ImageField(upload_to='claims_hero/', blank=True, null=True)
    body_html = models.TextField(blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Claims Page'
        verbose_name_plural = 'Claims Pages'


class SolutionPage(models.Model):
    title = models.CharField(max_length=200)
    slug = models.CharField(max_length=220, unique=True, blank=True, validators=[RegexValidator('^[A-Za-z0-9_/-]+$', 'Enter a valid path using letters, numbers, underscores, hyphens, and slashes.')])
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.SET_NULL)
    show_in_menu = models.BooleanField(default=True)
    menu_order = models.PositiveIntegerField(default=0)
    hero_subtitle = models.CharField(max_length=300, blank=True)
    hero_image = models.ImageField(upload_to='solutions_hero/', blank=True, null=True)
    body_html = models.TextField(blank=True)
    button_text = models.CharField(max_length=120, blank=True)
    button_url = models.URLField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    cards_title = models.CharField(max_length=200, blank=True)
    cards_intro_html = models.TextField(blank=True)


class SolutionPageButton(models.Model):
    page = models.ForeignKey(SolutionPage, related_name='page_buttons', on_delete=models.CASCADE)
    label = models.CharField(max_length=120)
    url = models.URLField(blank=True)
    file = models.FileField(upload_to='page_button_docs/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Page Button'
        verbose_name_plural = 'Page Buttons'

    def __str__(self):
        return self.label


class SolutionImage(models.Model):
    page = models.ForeignKey(SolutionPage, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='solutions_images/')
    caption = models.CharField(max_length=250, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_logo = models.BooleanField(default=False, help_text='Mark image as a client logo for marquee')

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.page.title} (image {self.id})"


class QuotePage(models.Model):
    title = models.CharField(max_length=200, default='Get A Quote')
    button_text = models.CharField(max_length=120, blank=True)
    button_url = models.URLField(blank=True)
    intro_text = models.CharField(max_length=300, blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Quote Page'
        verbose_name_plural = 'Quote Pages'


class QuoteCard(models.Model):
    page = models.ForeignKey(QuotePage, related_name='cards', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    url = models.URLField(blank=True)
    icon = models.ImageField(upload_to='quote_icons/', blank=True, null=True)
    active = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class SolutionConsultant(models.Model):
    page = models.ForeignKey(SolutionPage, related_name='consultants', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    photo = models.ImageField(upload_to='consultants/', blank=True, null=True)
    intro_html = models.TextField(blank=True, help_text='Short bio/intro shown with the consultant card')
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Consultant'
        verbose_name_plural = 'Consultants'

    def __str__(self):
        return self.name


class ServiceOffering(models.Model):
    page = models.ForeignKey(SolutionPage, related_name='services', on_delete=models.CASCADE)
    title = models.CharField(max_length=200, help_text='Service section title')
    description_html = models.TextField(blank=True, help_text='Main description for this service section')
    pricing_html = models.TextField(blank=True, help_text='Optional pricing/notes section')
    learn_more_url = models.URLField(blank=True, help_text='Optional link for detailed page')
    schedule_url = models.URLField(blank=True, help_text='Optional scheduling link')
    upcoming_url = models.URLField(blank=True, help_text='Optional upcoming classes link')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Consulting Service'
        verbose_name_plural = 'Consulting Services'

    def __str__(self):
        return self.title


class ServiceButton(models.Model):
    offering = models.ForeignKey(ServiceOffering, related_name='buttons', on_delete=models.CASCADE)
    label = models.CharField(max_length=120, help_text='Button text (e.g., “Learn more”)')
    url = models.URLField(blank=True, help_text='Destination URL for the button')
    file = models.FileField(upload_to='service_docs/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Button'
        verbose_name_plural = 'Buttons'

    def __str__(self):
        return self.label


class SolutionVideo(models.Model):
    page = models.ForeignKey(SolutionPage, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=200, help_text='Video title')
    description_html = models.TextField(blank=True, help_text='Short description for the video')
    youtube_url = models.URLField(blank=True, help_text='Paste full YouTube URL (e.g., https://www.youtube.com/watch?v=...)')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Video'
        verbose_name_plural = 'Videos'

    def __str__(self):
        return self.title


class IndustryItem(models.Model):
    page = models.ForeignKey(SolutionPage, related_name='industries', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, help_text='Industry card title')
    icon = models.ImageField(upload_to='industry_icons/', blank=True, null=True, help_text='Square icon (e.g., 64×64 PNG)')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Industry'
        verbose_name_plural = 'Industries'

    def __str__(self):
        return self.name


class SolutionCard(models.Model):
    page = models.ForeignKey(SolutionPage, related_name='cards', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    icon = models.ImageField(upload_to='solution_card_icons/', blank=True, null=True)
    body_html = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Card'
        verbose_name_plural = 'Cards'

    def __str__(self):
        return self.title
