from django.contrib import admin
from .models import TeamGroup, TeamMember


class TeamMemberInline(admin.TabularInline):
    model = TeamMember
    extra = 1
    fields = ("name", "rank", "linkedin_url", "photo", "email", "phone")


@admin.register(TeamGroup)
class TeamGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [TeamMemberInline]


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "rank", "email", "phone")
    list_filter = ("group",)
    search_fields = ("name", "rank", "email", "phone")
    fieldsets = (
        (None, {"fields": ("group", "name", "rank")} ),
        ("Contact", {"fields": ("email", "phone")} ),
        ("Profile", {"fields": ("photo", "linkedin_url", "description")} ),
    )
