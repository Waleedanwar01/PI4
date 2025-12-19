from django.http import JsonResponse, Http404
from django.conf import settings
from .models import TeamGroup


def groups_list(request):
    groups = TeamGroup.objects.prefetch_related("members").all()
    data = [
        {
            "name": g.name,
            "slug": g.slug,
            "members": [
                {
                    "name": m.name,
                    "rank": m.rank,
                    "linkedin_url": m.linkedin_url,
                    "email": m.email,
                    "phone": m.phone,
                    "description": m.description,
                    "photo_url": (request.build_absolute_uri(m.photo.url) if m.photo else ""),
                }
                for m in g.members.all()
            ],
        }
        for g in groups
    ]
    return JsonResponse({"groups": data})


def group_detail(request, slug):
    try:
        g = TeamGroup.objects.prefetch_related("members").get(slug=slug)
    except TeamGroup.DoesNotExist:
        raise Http404
    data = {
        "name": g.name,
        "slug": g.slug,
        "members": [
            {
                "name": m.name,
                "rank": m.rank,
                "linkedin_url": m.linkedin_url,
                "email": m.email,
                "phone": m.phone,
                "description": m.description,
                "photo_url": (request.build_absolute_uri(m.photo.url) if m.photo else ""),
            }
            for m in g.members.all()
        ],
    }
    return JsonResponse(data)
