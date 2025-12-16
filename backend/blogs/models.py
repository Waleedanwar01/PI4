from django.db import models
from django.utils.text import slugify
from django.core.validators import RegexValidator
from urllib.parse import urlparse
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    author = models.CharField(max_length=120, default="GASPAR")
    cover_image = models.ImageField(upload_to="blog_covers/", blank=True, null=True)
    excerpt = models.TextField(blank=True)
    content_html = models.TextField(blank=True)
    categories = models.ManyToManyField(Category, related_name="posts", blank=True)
    primary_category = models.ForeignKey(Category, related_name="primary_posts", on_delete=models.SET_NULL, blank=True, null=True)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class BlogImage(models.Model):
    post = models.ForeignKey(BlogPost, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="blog_images/")
    caption = models.CharField(max_length=250, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.post.title} (image {self.id})"


class FAQ(models.Model):
    category = models.ForeignKey(Category, related_name="faqs", on_delete=models.CASCADE)
    question = models.CharField(max_length=300)
    answer_html = models.TextField(blank=True)
    published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category__name", "order", "id"]

    def __str__(self):
        return self.question


class SiteConfig(models.Model):
    site_name = models.CharField(max_length=150, default="Gaspar Insurance Services")
    homepage_title = models.CharField(max_length=200, blank=True, default="")
    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    favicon = models.ImageField(upload_to="site/", blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, default="")
    email = models.EmailField(blank=True, null=True)
    address_line1 = models.CharField(max_length=200, blank=True, default="")
    address_line2 = models.CharField(max_length=200, blank=True, default="")
    city = models.CharField(max_length=120, blank=True, default="")
    state = models.CharField(max_length=60, blank=True, default="")
    postal_code = models.CharField(max_length=20, blank=True, default="")
    facebook_url = models.URLField(blank=True, default="")
    twitter_url = models.URLField(blank=True, default="")
    linkedin_url = models.URLField(blank=True, default="")
    instagram_url = models.URLField(blank=True, default="")
    youtube_url = models.URLField(blank=True, default="")
    footer_about = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"

    def __str__(self):
        return self.site_name


class SiteAddress(models.Model):
    config = models.ForeignKey(SiteConfig, related_name="addresses", on_delete=models.CASCADE)
    label = models.CharField(max_length=120, blank=True, default="")
    line1 = models.CharField(max_length=200, blank=True, default="")
    line2 = models.CharField(max_length=200, blank=True, default="")
    city = models.CharField(max_length=120, blank=True, default="")
    state = models.CharField(max_length=60, blank=True, default="")
    postal_code = models.CharField(max_length=20, blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        base = self.label or "Address"
        return f"{base} ({self.city})".strip()


class PageMeta(models.Model):
    config = models.ForeignKey(SiteConfig, related_name="pages_meta", on_delete=models.CASCADE)
    slug = models.CharField(
        max_length=220,
        validators=[RegexValidator(r'^[A-Za-z0-9_/-]+$', 'Enter a valid path using letters, numbers, underscores, hyphens, and slashes.')],
        db_index=True,
    )
    title = models.CharField(max_length=200, blank=True, default="")
    meta_title = models.CharField(max_length=200, blank=True, default="")
    meta_description = models.TextField(blank=True, default="")

    class Meta:
        unique_together = ("config", "slug")
        ordering = ["slug", "id"]

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        s = (self.slug or "").strip()
        if "://" in s:
            try:
                p = urlparse(s)
                s = p.path or s
            except Exception:
                pass
        if s.startswith("/"):
            s = s[1:]
        while "//" in s:
            s = s.replace("//", "/")
        self.slug = s
        super().save(*args, **kwargs)


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, default="")
    message = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.name} ({self.email})"


class HomeAbout(models.Model):
    title = models.CharField(max_length=250, blank=True, default="")
    intro_html = models.TextField(blank=True, default="")
    hero_image = models.ImageField(upload_to="home/", blank=True, null=True)
    years_experience = models.PositiveIntegerField(default=0)
    enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Homepage About"
        verbose_name_plural = "Homepage About"
        ordering = ["-updated_at", "-id"]

    def __str__(self):
        return self.title or "Homepage About"


class PartnerLogo(models.Model):
    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to="partners/")
    url = models.URLField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


class AboutPage(models.Model):
    title = models.CharField(max_length=200, default="About Us")
    hero_subtitle = models.CharField(max_length=300, blank=True, default="")
    hero_image = models.ImageField(upload_to="pages/about/", blank=True, null=True)
    body_html = models.TextField(blank=True, default="")
    meta_title = models.CharField(max_length=200, blank=True, default="")
    meta_description = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About Page"
        verbose_name_plural = "About Page"

    def __str__(self):
        return self.title


class AboutStat(models.Model):
    label = models.CharField(max_length=120)
    value = models.BigIntegerField(default=0)
    suffix = models.CharField(max_length=120, blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.label}: {self.value}"


class AboutImage(models.Model):
    page = models.ForeignKey(AboutPage, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="pages/about/images/")
    caption = models.CharField(max_length=250, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        base = self.caption or "Image"
        return f"{self.page.title} - {base}"


class PortalPage(models.Model):
    title = models.CharField(max_length=200, default="Customer Portal")
    hero_subtitle = models.CharField(max_length=300, blank=True, default="")
    hero_image = models.ImageField(upload_to="pages/portal/", blank=True, null=True)
    portal_url = models.URLField(blank=True, default="")
    faq_category = models.CharField(max_length=200, blank=True, default="")
    use_faq_points = models.BooleanField(default=True)
    show_partners = models.BooleanField(default=True)
    appstore_ios_url = models.URLField(blank=True, default="")
    appstore_android_url = models.URLField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Portal Page"
        verbose_name_plural = "Portal Page"

    def __str__(self):
        return self.title


class PortalFeature(models.Model):
    page = models.ForeignKey(PortalPage, related_name="features", on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.text


class PortalVideo(models.Model):
    page = models.ForeignKey(PortalPage, related_name="videos", on_delete=models.CASCADE)
    youtube_url = models.URLField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.youtube_url


class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    phone = models.CharField(max_length=50, blank=True, default="")
    policy_number = models.CharField(max_length=120, blank=True, default="")

    def __str__(self):
        return self.user.username


class LegalPage(models.Model):
    slug = models.SlugField(max_length=220, unique=True)
    title = models.CharField(max_length=200)
    body_html = models.TextField(blank=True, default="")
    meta_title = models.CharField(max_length=200, blank=True, default="")
    meta_description = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Legal Page"
        verbose_name_plural = "Legal Pages"
        ordering = ["slug", "id"]

    def __str__(self):
        return self.title
