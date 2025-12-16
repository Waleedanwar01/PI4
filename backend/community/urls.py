from django.urls import path
from . import views


urlpatterns = [
    path("page", views.page_data, name="community_page"),
    path("nominate", views.nominate, name="community_nominate"),
]

