from django.contrib import admin
from nested_admin import NestedModelAdmin, NestedStackedInline
from .models import CommunityPage, CommunitySection, CommunityItem, Nomination


class CommunityItemInline(NestedStackedInline):
    model = CommunityItem
    extra = 1
    fields = ("title", "description", "image", "button_text", "button_url", "order")


class CommunitySectionInline(NestedStackedInline):
    model = CommunitySection
    extra = 1
    fields = ("title", "description", "order")
    inlines = [CommunityItemInline]


@admin.register(CommunityPage)
class CommunityPageAdmin(NestedModelAdmin):
    list_display = ("title",)
    inlines = [CommunitySectionInline]


admin.site.register(CommunitySection)


@admin.register(Nomination)
class NominationAdmin(admin.ModelAdmin):
    list_display = ("nonprofit_name", "your_name", "your_email", "created_at")
    search_fields = ("nonprofit_name", "your_name", "your_email")
    readonly_fields = ("created_at",)
