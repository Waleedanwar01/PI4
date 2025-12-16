from django.contrib import admin
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from .models import Category, BlogPost, BlogImage, FAQ, SiteConfig, SiteAddress, PageMeta, ContactMessage, PartnerLogo, AboutPage, AboutStat, AboutImage, PortalPage, PortalFeature, PortalVideo, LegalPage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


class BlogPostAdminForm(forms.ModelForm):
    content_html = forms.CharField(widget=CKEditorUploadingWidget(), required=False)
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all(), widget=forms.SelectMultiple, required=False)
    primary_category = forms.ModelChoiceField(queryset=Category.objects.all(), widget=forms.Select, required=False)

    class Meta:
        model = BlogPost
        fields = '__all__'


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm
    list_display = ("title", "author", "published", "created_at")
    list_filter = ("published", "categories")
    search_fields = ("title", "author", "excerpt")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("title", "slug", "author", "published", "primary_category")}),
        ("Media", {"fields": ("cover_image",)}),
        ("Content", {"fields": ("excerpt", "content_html")}),
        ("Taxonomy", {"fields": ("categories",)}),
        ("Meta", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )
    readonly_fields = ("created_at", "updated_at")


class BlogImageInline(admin.TabularInline):
    model = BlogImage
    extra = 3
    fields = ("image", "caption", "order")

BlogPostAdmin.inlines = [BlogImageInline]


class FAQAdminForm(forms.ModelForm):
    answer_html = forms.CharField(widget=CKEditorUploadingWidget(), required=False)

    class Meta:
        model = FAQ
        fields = "__all__"

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    form = FAQAdminForm
    list_display = ("question", "category", "published", "order")
    list_filter = ("published", "category")
    search_fields = ("question", "answer_html")
    fieldsets = (
        (None, {"fields": ("category", "question", "published", "order")}),
        ("Answer", {"fields": ("answer_html",)}),
    )


@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    list_display = ("site_name", "phone", "email", "updated_at")
    def has_add_permission(self, request):
        from .models import SiteConfig
        return not SiteConfig.objects.exists()
    fieldsets = (
        ("Brand", {"fields": ("site_name", "homepage_title", "logo", "favicon")}),
        ("Contact", {"fields": ("phone", "email")}),
        ("Address", {"fields": ("address_line1", "address_line2", "city", "state", "postal_code")}),
        ("Social", {"fields": ("facebook_url", "twitter_url", "linkedin_url", "instagram_url", "youtube_url")}),
        ("Footer", {"fields": ("footer_about",)}),
    )

class SiteAddressInline(admin.TabularInline):
    model = SiteAddress
    extra = 3
    max_num = 3
    fields = ("label", "line1", "line2", "city", "state", "postal_code", "order")

class PageMetaInline(admin.TabularInline):
    model = PageMeta
    extra = 6
    fields = ("slug", "title", "meta_title", "meta_description")

SiteConfigAdmin.inlines = [SiteAddressInline, PageMetaInline]

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "created_at")
    search_fields = ("name", "email", "phone", "message")
    readonly_fields = ("created_at",)



@admin.register(PartnerLogo)
class PartnerLogoAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    list_editable = ("order",)
    search_fields = ("name",)


class AboutPageForm(forms.ModelForm):
    body_html = forms.CharField(widget=CKEditorUploadingWidget(), required=False)

    class Meta:
        model = AboutPage
        fields = "__all__"

@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    form = AboutPageForm
    list_display = ("title", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "hero_subtitle", "hero_image")}),
        ("Content", {"fields": ("body_html",)}),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
        ("Meta", {"fields": ("updated_at",), "classes": ("collapse",)}),
    )
    readonly_fields = ("updated_at",)

class AboutImageInline(admin.TabularInline):
    model = AboutImage
    extra = 4
    fields = ("image", "caption", "order")

AboutPageAdmin.inlines = [AboutImageInline]

@admin.register(AboutStat)
class AboutStatAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "suffix", "order")
    list_editable = ("value", "suffix", "order")
    search_fields = ("label",)


class PortalFeatureInline(admin.TabularInline):
    model = PortalFeature
    extra = 6
    fields = ("text", "order")


class PortalVideoInline(admin.TabularInline):
    model = PortalVideo
    extra = 3
    fields = ("youtube_url", "order")


@admin.register(PortalPage)
class PortalPageAdmin(admin.ModelAdmin):
    list_display = ("title", "faq_category", "show_partners", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "hero_subtitle", "hero_image")}),
        ("Links", {"fields": ("portal_url", "appstore_ios_url", "appstore_android_url")}),
        ("FAQ Points", {"fields": ("faq_category", "use_faq_points")}),
        ("Logos", {"fields": ("show_partners",)}),
    )
    inlines = [PortalFeatureInline, PortalVideoInline]


class LegalPageForm(forms.ModelForm):
    body_html = forms.CharField(widget=CKEditorUploadingWidget(), required=False)

    class Meta:
        model = LegalPage
        fields = "__all__"


@admin.register(LegalPage)
class LegalPageAdmin(admin.ModelAdmin):
    form = LegalPageForm
    list_display = ("slug", "title", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("slug", "title")}),
        ("Content", {"fields": ("body_html",)}),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
        ("Meta", {"fields": ("updated_at",), "classes": ("collapse",)}),
    )
    readonly_fields = ("updated_at",)
