from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError
from .models import CommunityPage, Nomination


def _abs(request, f):
    try:
        return request.build_absolute_uri(f.url)
    except Exception:
        return ""


def page_data(request):
    page = CommunityPage.objects.prefetch_related("sections__items").first()
    if not page:
        return JsonResponse({"title": "Community Outreach", "hero_image": "", "hero_subtitle": "", "sections": []})
    sections = []
    for s in page.sections.all():
        items = []
        for it in s.items.all():
            items.append({
                "title": it.title,
                "description": it.description,
                "image": _abs(request, it.image) if it.image else "",
                "button_text": it.button_text,
                "button_url": it.button_url,
            })
        sections.append({
            "title": s.title,
            "description": s.description,
            "items": items,
        })
    data = {
        "title": page.title,
        "hero_subtitle": page.hero_subtitle,
        "hero_image": _abs(request, page.hero_image) if page.hero_image else "",
        "sections": sections,
    }
    return JsonResponse(data)


@csrf_exempt
def nominate(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        payload = request.POST
        n = Nomination.objects.create(
            nonprofit_name=payload.get("nonprofit_name", ""),
            years_established=payload.get("years_established", ""),
            areas_served=payload.get("areas_served", ""),
            community_impact=payload.get("community_impact", ""),
            your_name=payload.get("your_name", ""),
            your_email=payload.get("your_email", ""),
            your_phone=payload.get("your_phone", ""),
            relationship_description=payload.get("relationship_description", ""),
        )
    except MultiValueDictKeyError:
        return JsonResponse({"error": "Invalid payload"}, status=400)
    return JsonResponse({"ok": True, "id": n.id})

