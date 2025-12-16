from django.contrib import admin
import re
from django import forms
from ckeditor.widgets import CKEditorWidget
from nested_admin import NestedModelAdmin, NestedTabularInline
from django.db import models as dj_models

from .models import (
    SolutionPageProxy,
)
from resources.models import (
    SolutionImage,
    SolutionConsultant,
    ServiceOffering,
    ServiceButton,
    SolutionVideo,
    IndustryItem,
    SolutionCard,
    SolutionPageButton,
)


class SolutionPageForm(forms.ModelForm):
    body_html = forms.CharField(widget=CKEditorWidget(), required=False)
    button_url = forms.CharField(required=False, widget=forms.TextInput())
    cards_intro_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = SolutionPageProxy
        fields = '__all__'


class SolutionImageInline(NestedTabularInline):
    model = SolutionImage
    extra = 0
    fields = ('image', 'caption', 'order', 'is_logo')
    classes = ()
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }


class SolutionConsultantForm(forms.ModelForm):
    intro_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = SolutionConsultant
        fields = '__all__'


class SolutionConsultantInline(NestedTabularInline):
    model = SolutionConsultant
    form = SolutionConsultantForm
    extra = 0
    fields = ('name', 'title', 'photo', 'intro_html', 'email', 'phone', 'order')
    classes = ()
    show_change_link = True
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }


class ServiceOfferingForm(forms.ModelForm):
    description_html = forms.CharField(widget=CKEditorWidget(), required=False)
    pricing_html = forms.CharField(widget=CKEditorWidget(), required=False)
    learn_more_url = forms.CharField(required=False, widget=forms.TextInput())
    schedule_url = forms.CharField(required=False, widget=forms.TextInput())
    upcoming_url = forms.CharField(required=False, widget=forms.TextInput())

    class Meta:
        model = ServiceOffering
        fields = '__all__'


class ServiceButtonInline(NestedTabularInline):
    model = ServiceButton
    extra = 0
    fields = ('label', 'url', 'file', 'order')
    classes = ()
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }


class ServiceOfferingInline(NestedTabularInline):
    model = ServiceOffering
    form = ServiceOfferingForm
    extra = 0
    fields = ('title', 'description_html', 'pricing_html', 'learn_more_url', 'schedule_url', 'upcoming_url', 'order')
    inlines = [ServiceButtonInline]
    classes = ()
    show_change_link = True
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }


class SolutionVideoForm(forms.ModelForm):
    description_html = forms.CharField(widget=CKEditorWidget(), required=False)
    youtube_url = forms.CharField(required=False, widget=forms.TextInput())

    class Meta:
        model = SolutionVideo
        fields = '__all__'


class SolutionVideoInline(NestedTabularInline):
    model = SolutionVideo
    form = SolutionVideoForm
    extra = 0
    fields = ('title', 'description_html', 'youtube_url', 'order')
    classes = ()
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }


class IndustryItemInline(NestedTabularInline):
    model = IndustryItem
    extra = 0
    fields = ('name', 'icon', 'order')
    classes = ()
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }


@admin.register(SolutionPageProxy)
class SolutionPageAdmin(NestedModelAdmin):
    form = SolutionPageForm
    list_display = ('title', 'slug', 'parent', 'show_in_menu', 'menu_order')
    list_filter = ('show_in_menu',)
    search_fields = ('title', 'slug')
    save_on_top = True
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }
    fieldsets = (
        (None, { 'fields': ('title', 'slug', 'parent') }),
        ('Menu', { 'fields': ('show_in_menu', 'menu_order') }),
        ('Hero', { 'fields': ('hero_subtitle', 'hero_image') }),
        ('Content', { 'fields': ('body_html',) }),
        ('Cards Section', { 'fields': ('cards_title', 'cards_intro_html') }),
        ('CTA', { 'fields': ('button_text', 'button_url', 'phone') }),
        ('SEO', { 'fields': ('meta_title', 'meta_description') }),
    )
    inlines = []

    def save_model(self, request, obj, form, change):
        try:
            if not obj.slug and obj.title:
                s = obj.title.lower()
                s = re.sub(r"\s+", "-", s)
                s = re.sub(r"[^A-Za-z0-9_/-]", "", s)
                obj.slug = s or "page"
            if obj.parent_id and obj.parent and obj.slug:
                prefix = obj.parent.slug.rstrip('/')
                if not obj.slug.startswith(prefix + '/'):
                    obj.slug = f"{prefix}/{obj.slug.lstrip('/')}"
        except Exception:
            pass
        super().save_model(request, obj, form, change)

    def get_inline_instances(self, request, obj=None):
        def _is_consulting(o):
            try:
                s = (o.slug or "").rstrip('/')
                return s.endswith("special-programs/consulting-services")
            except Exception:
                return False
        instances = []
        def _is_dental(o):
            try:
                s = (o.slug or "").rstrip('/')
                return s.endswith("special-programs/dental-practice")
            except Exception:
                return False
        def _is_franchise(o):
            try:
                s = (o.slug or "").rstrip('/')
                return s.endswith("special-programs/franchise-protection")
            except Exception:
                return False
        def _is_private_client(o):
            try:
                s = (o.slug or "").rstrip('/')
                return s.endswith("special-programs/private-client")
            except Exception:
                return False
        def _is_workers_comp(o):
            try:
                s = (o.slug or "").rstrip('/')
                return s.endswith("special-programs/workers-compensation")
            except Exception:
                return False
        if obj and _is_consulting(obj):
            for inline_cls in [SolutionVideoInline, ServiceOfferingInline, IndustryItemInline, SolutionConsultantInline, SolutionImageInline, SolutionPageButtonInline]:
                instances.append(inline_cls(self.model, self.admin_site))
        elif obj and (_is_dental(obj) or _is_franchise(obj) or _is_private_client(obj) or _is_workers_comp(obj)):
            for inline_cls in [SolutionCardInline, ServiceOfferingInline, SolutionImageInline, SolutionPageButtonInline]:
                instances.append(inline_cls(self.model, self.admin_site))
        else:
            for inline_cls in [ServiceOfferingInline, SolutionImageInline, SolutionPageButtonInline]:
                instances.append(inline_cls(self.model, self.admin_site))
        return instances


# Keep inline registrations only under SolutionPage; omit separate list pages for submodels in Solutions app for simplicity
class SolutionCardForm(forms.ModelForm):
    body_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = SolutionCard
        fields = '__all__'


class SolutionCardInline(NestedTabularInline):
    model = SolutionCard
    form = SolutionCardForm
    extra = 0
    fields = ('title', 'icon', 'body_html', 'order')
    classes = ()


class SolutionPageButtonInline(NestedTabularInline):
    model = SolutionPageButton
    extra = 0
    fields = ('label', 'url', 'file', 'order')
    classes = ()
    formfield_overrides = {
        dj_models.URLField: {'widget': forms.TextInput(attrs={'type': 'text'})},
    }
