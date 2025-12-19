from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import TeamGroup
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
    groups = TeamGroup.objects.prefetch_related('members').all().order_by('order')
    data = []
    for g in groups:
        members = []
        for m in g.members.filter(active=True).order_by('order'):
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
