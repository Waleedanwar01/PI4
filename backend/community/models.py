from django.db import models


class CommunityPage(models.Model):
    title = models.CharField(max_length=200, default="Community Outreach")
    hero_subtitle = models.CharField(max_length=300, blank=True)
    hero_image = models.ImageField(upload_to="community_hero/", blank=True, null=True)

    def __str__(self):
        return self.title


class CommunitySection(models.Model):
    page = models.ForeignKey(CommunityPage, related_name="sections", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.title} (#{self.order})"


class CommunityItem(models.Model):
    section = models.ForeignKey(CommunitySection, related_name="items", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="community_items/", blank=True, null=True)
    button_text = models.CharField(max_length=100, blank=True)
    button_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Nomination(models.Model):
    nonprofit_name = models.CharField(max_length=200)
    years_established = models.CharField(max_length=100, blank=True)
    areas_served = models.CharField(max_length=200, blank=True)
    community_impact = models.TextField(blank=True)
    your_name = models.CharField(max_length=200, blank=True)
    your_email = models.EmailField(blank=True)
    your_phone = models.CharField(max_length=50, blank=True)
    relationship_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Nomination: {self.nonprofit_name} by {self.your_name}"

