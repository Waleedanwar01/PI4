from django.contrib import admin
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from .models import SimplePage


class SimplePageAdminForm(forms.ModelForm):
    content_html = forms.CharField(widget=CKEditorUploadingWidget(), required=False)

    class Meta:
        model = SimplePage
        fields = '__all__'


@admin.register(SimplePage)
class SimplePageAdmin(admin.ModelAdmin):
    form = SimplePageAdminForm
    list_display = ('title', 'slug', 'published', 'updated_at')
    list_filter = ('published',)
    search_fields = ('title', 'content_html')
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'published')}),
        ('Content', {'fields': ('content_html',)}),
        ('Meta', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at', 'updated_at')
