from django.db import models
from django.utils.text import slugify


class TeamGroup(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    group = models.ForeignKey(TeamGroup, related_name="members", on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    rank = models.CharField(max_length=200, blank=True)
    linkedin_url = models.URLField(blank=True)
    photo = models.ImageField(upload_to="team_photos/", blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.group.name})"
