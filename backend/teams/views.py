from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.db.models import Prefetch
from .models import TeamGroup, TeamMember

from django.conf import settings

def _abs(request, url):
    if not url:
        return ""
    absolute_url = request.build_absolute_uri(url)
    if not settings.DEBUG and absolute_url.startswith("http://"):
        absolute_url = absolute_url.replace("http://", "https://", 1)
    return absolute_url

@require_GET
def list_groups(request):
    # Optimize query: prefetch only active members and order them
    members_prefetch = Prefetch(
        'members',
        queryset=TeamMember.objects.filter(active=True).order_by('order')
    )
    groups = TeamGroup.objects.prefetch_related(members_prefetch).all().order_by('order')
    
    data = []
    for g in groups:
        members = []
        # Use .all() here because prefetch has already filtered and ordered them
        for m in g.members.all():
            try:
                photo = _abs(request, m.photo.url) if m.photo else ""
            except:
                photo = ""
            members.append({
                "name": m.name,
                "rank": m.rank,
                "photo_url": photo,
                "linkedin_url": m.linkedin_url,
                "email": m.email,
            })
        data.append({
            "name": g.name,
            "slug": g.slug,
            "description": g.description,
            "members": members,
        })
    return JsonResponse({"groups": data})
