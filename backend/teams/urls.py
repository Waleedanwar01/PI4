from django.urls import path
from . import views


urlpatterns = [
    path("groups", views.groups_list, name="teams_groups_list"),
    path("group/<slug:slug>", views.group_detail, name="teams_group_detail"),
]

