from django.contrib import admin
from django import forms
from ckeditor.widgets import CKEditorWidget
from nested_admin import NestedModelAdmin, NestedTabularInline
from .models import ClaimsPage, QuotePage, QuoteCard


class ClaimsPageForm(forms.ModelForm):
    body_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = ClaimsPage
        fields = '__all__'


@admin.register(ClaimsPage)
class ClaimsPageAdmin(admin.ModelAdmin):
    form = ClaimsPageForm
    list_display = ('title',)
    fieldsets = (
        (None, {
            'fields': ('title', 'hero_subtitle', 'hero_image')
        }),
        ('Content', {
            'fields': ('body_html',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description')
        }),
    )


class SolutionPageForm(forms.ModelForm):
    body_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = None
        fields = ()


class SolutionImageInline(NestedTabularInline):
    model = None
    extra = 0
    fields = ()


class SolutionConsultantForm(forms.ModelForm):
    intro_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = None
        fields = ()


class SolutionConsultantInline(NestedTabularInline):
    model = None
    form = SolutionConsultantForm
    extra = 0
    fields = ()


class ServiceOfferingForm(forms.ModelForm):
    description_html = forms.CharField(widget=CKEditorWidget(), required=False)
    pricing_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = None
        fields = ()


class ServiceButtonInline(NestedTabularInline):
    model = None
    extra = 0
    fields = ()


class ServiceOfferingInline(NestedTabularInline):
    model = None
    form = ServiceOfferingForm
    extra = 0
    fields = ()


class SolutionVideoForm(forms.ModelForm):
    description_html = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = None
        fields = ()


class SolutionVideoInline(NestedTabularInline):
    model = None
    form = SolutionVideoForm
    extra = 0
    fields = ()


class IndustryItemInline(NestedTabularInline):
    model = None
    extra = 0
    fields = ()


# Solution admin moved to "solutions" app via proxy models


# Solution consultant admin moved


# Solution video admin moved


# Service offering admin moved


# Industry admin moved


class QuoteCardInline(admin.TabularInline):
    model = QuoteCard
    extra = 4
    fields = ('title', 'description', 'url', 'icon', 'active', 'order')


@admin.register(QuotePage)
class QuotePageAdmin(admin.ModelAdmin):
    list_display = ('title', 'button_text', 'button_url')
    fieldsets = (
        (None, { 'fields': ('title', 'intro_text') }),
        ('CTA', { 'fields': ('button_text', 'button_url') }),
        ('SEO', { 'fields': ('meta_title', 'meta_description') }),
    )
    inlines = [QuoteCardInline]
