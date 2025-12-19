from django.http import JsonResponse, Http404
from django.db import models
from django.core.paginator import Paginator
from django.views.decorators.http import require_GET
from django.utils.timezone import localtime
from .models import BlogPost, Category, FAQ, SiteConfig
from .models import SiteAddress, PageMeta, ContactMessage, PartnerLogo, AboutPage, AboutStat, PortalPage, UserProfile, LegalPage
from django.views.decorators.csrf import csrf_exempt
import json
import re
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.conf import settings


def _abs(request, url):
    if not url:
        return ""
    absolute_url = request.build_absolute_uri(url)
    if not settings.DEBUG and absolute_url.startswith("http://"):
        absolute_url = absolute_url.replace("http://", "https://", 1)
    return absolute_url


@require_GET
def blog_list(request):
    page = int(request.GET.get("page", "1") or 1)
    page_size = int(request.GET.get("page_size", "9") or 9)
    qs = BlogPost.objects.filter(published=True).select_related().prefetch_related("categories")
    cat = request.GET.get("category")
    if cat:
        qs = qs.filter(models.Q(categories__slug__iexact=cat) | models.Q(categories__name__iexact=cat) | models.Q(primary_category__slug__iexact=cat) | models.Q(primary_category__name__iexact=cat)).distinct()
    q = request.GET.get("q")
    if q:
        qs = qs.filter(models.Q(title__icontains=q) | models.Q(excerpt__icontains=q) | models.Q(content_html__icontains=q)).distinct()
    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)

    items = []
    for post in page_obj.object_list:
        img_url = ""
        if post.cover_image:
            try:
                img_url = _abs(request, post.cover_image.url)
            except Exception:
                img_url = ""
        items.append({
            "id": post.id,
            "title": post.title,
            "author": post.author,
            "date": localtime(post.created_at).strftime("%B %d, %Y"),
            "categories": [c.name for c in post.categories.all()],
            "image": img_url,
            "excerpt": post.excerpt,
            "slug": post.slug,
        })

    data = {
        "page": page_obj.number,
        "total_pages": paginator.num_pages,
        "total_items": paginator.count,
        "items": items,
    }
    return JsonResponse(data)

@csrf_exempt
def contact_submit(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        payload = json.loads(request.body.decode("utf-8")) if request.body else {}
    except Exception:
        payload = {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    phone = (payload.get("phone") or "").strip()
    message = (payload.get("message") or "").strip()
    if not name or not email:
        return JsonResponse({"error": "Name and email are required"}, status=400)
    ContactMessage.objects.create(name=name, email=email, phone=phone, message=message)
    return JsonResponse({"ok": True})

@require_GET
def blog_detail(request, slug):
    try:
        post = BlogPost.objects.select_related().prefetch_related("categories").get(slug=slug, published=True)
    except BlogPost.DoesNotExist:
        raise Http404("Blog not found")

    img_url = ""
    if post.cover_image:
        try:
            img_url = _abs(request, post.cover_image.url)
        except Exception:
            img_url = ""

    # Fix relative image URLs in content_html for frontend
    content = post.content_html or ""
    try:
        if content:
            # Build absolute root URL (e.g. https://pi4.onrender.com)
            root_url = _abs(request, '/').rstrip('/')
            # Replace src="/media/..." with src="https://.../media/..."
            content = content.replace('src="/media/', f'src="{root_url}/media/')
            content = content.replace('href="/media/', f'href="{root_url}/media/')
    except Exception:
        pass

    images = []
    for img in post.images.all():
        try:
            url = _abs(request, img.image.url)
        except Exception:
            url = ""
        images.append({
            "url": url,
            "caption": img.caption,
            "order": img.order,
        })

    data = {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "author": post.author,
        "date": localtime(post.created_at).strftime("%B %d, %Y"),
        "categories": [c.name for c in post.categories.all()],
        "primary_category": post.primary_category.name if post.primary_category else "",
        "image": img_url,
        "excerpt": post.excerpt,
        "content_html": content,
        "images": images,
    }
    return JsonResponse(data)

@require_GET
def blog_categories(request):
    cats = Category.objects.all().order_by("name")
    items = []
    for c in cats:
        items.append({
            "name": c.name,
            "slug": c.slug,
        })
    return JsonResponse({"items": items})

@require_GET
def site_config(request):
    # Try to get the first config, or create default
    config = SiteConfig.objects.first()
    if not config:
        config = SiteConfig.objects.create()

    # Get address
    addr = SiteAddress.objects.filter(config=config).first()
    addresses = []
    if addr:
        addresses.append({
            "label": addr.label,
            "line1": addr.line1,
            "line2": addr.line2,
            "city": addr.city,
            "state": addr.state,
            "zip_code": addr.zip_code,
            "map_link": addr.map_link,
        })
    
    # Meta
    meta = PageMeta.objects.filter(config=config)
    pages_meta = []
    for m in meta:
        pages_meta.append({
            "slug": m.slug,
            "title": m.title,
            "meta_title": m.meta_title,
            "meta_description": m.meta_description,
        })

    logo_url = ""
    if config.logo:
        try:
            logo_url = _abs(request, config.logo.url)
        except:
            logo_url = ""

    return JsonResponse({
        "site_name": config.site_name,
        "phone": config.phone_number,
        "email": config.email_address,
        "logo_url": logo_url,
        "addresses": addresses,
        "pages_meta": pages_meta,
    })

@require_GET
def faq_list(request):
    faqs = FAQ.objects.filter(published=True).order_by("order")
    # Group by category
    groups = {}
    for f in faqs:
        c = f.category or "General"
        if c not in groups:
            groups[c] = []
        groups[c].append({
            "question": f.question,
            "answer": f.answer,
        })
    
    data = []
    for k, v in groups.items():
        data.append({"category": k, "items": v})
    
    return JsonResponse({"groups": data})

@require_GET
def partner_logos(request):
    logos = PartnerLogo.objects.all().order_by("order")
    data = []
    for l in logos:
        u = ""
        try:
            u = _abs(request, l.image.url)
        except:
            u = ""
        data.append({"name": l.name, "image": u})
    return JsonResponse({"items": data})

@require_GET
def about_page(request):
    p = AboutPage.objects.first()
    if not p:
        return JsonResponse({})
    
    hero = ""
    try:
        hero = _abs(request, p.hero_image.url)
    except: pass

    stats = []
    for s in p.stats.all():
        stats.append({"value": s.value, "label": s.label})
    
    return JsonResponse({
        "title": p.title,
        "hero_subtitle": p.hero_subtitle,
        "hero_image": hero,
        "main_content": p.main_content,
        "stats": stats,
    })

@require_GET
def portal_page(request):
    p = PortalPage.objects.first()
    if not p:
        return JsonResponse({})
    
    hero = ""
    try:
        hero = _abs(request, p.hero_image.url)
    except: pass
    
    feats = [x.strip() for x in p.features_list.split("\n") if x.strip()]
    vids = [x.strip() for x in p.video_links.split("\n") if x.strip()]
    
    parts = []
    for pa in p.partners.all():
        u = ""
        try:
            u = _abs(request, pa.image.url)
        except: pass
        parts.append({"name": pa.name, "image": u})

    return JsonResponse({
        "title": p.title,
        "hero_subtitle": p.hero_subtitle,
        "hero_image": hero,
        "portal_url": p.portal_url,
        "features": feats,
        "videos": vids,
        "partners": parts,
        "appstore_ios_url": p.appstore_ios_url,
        "appstore_android_url": p.appstore_android_url,
        "contact_email": p.contact_email,
        "contact_phone": p.contact_phone,
    })

@csrf_exempt
def auth_me(request):
    if request.user.is_authenticated:
        # Get profile
        try:
            prof = request.user.profile
            phone = prof.phone_number
        except:
            phone = ""
        return JsonResponse({
            "ok": True,
            "user": {
                "username": request.user.username,
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "phone": phone
            }
        })
    return JsonResponse({"ok": False}, status=401)

@csrf_exempt
def auth_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        d = json.loads(request.body)
    except:
        return JsonResponse({"error": "Bad json"}, status=400)
    
    u = authenticate(request, username=d.get("username"), password=d.get("password"))
    if u:
        login(request, u)
        return JsonResponse({"ok": True})
    return JsonResponse({"error": "Invalid credentials"}, status=401)

@csrf_exempt
def auth_logout(request):
    logout(request)
    return JsonResponse({"ok": True})

@csrf_exempt
def auth_signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        d = json.loads(request.body)
    except:
        return JsonResponse({"error": "Bad json"}, status=400)
    
    user = d.get("username")
    pw = d.get("password")
    email = d.get("email")
    
    if User.objects.filter(username=user).exists():
        return JsonResponse({"error": "Username taken"}, status=400)
    
    u = User.objects.create_user(user, email, pw)
    u.first_name = d.get("first_name", "")
    u.last_name = d.get("last_name", "")
    u.save()
    
    # Profile
    UserProfile.objects.create(user=u, phone_number=d.get("phone", ""))
    
    login(request, u)
    return JsonResponse({"ok": True})

@require_GET
def resources_claims(request):
    # Hardcoded or from model? Let's check models. We don't have a ClaimPage model in snippets, 
    # but we can check if there's a generic Page model or if we should just return static data 
    # matched by frontend. For now, let's assume it's static or minimal.
    # Actually, let's create a placeholder or check if LegalPage covers it? No.
    # Let's just return a standard structure.
    return JsonResponse({
        "title": "Claims Center",
        "hero_subtitle": "Fast, fair and friendly claims service",
        "hero_image": "", # Frontend has fallback
        "body_html": "<p>Report a claim 24/7 using our online portal or call us.</p>"
    })

@require_GET
def legal_page(request, slug):
    try:
        p = LegalPage.objects.get(slug=slug, published=True)
        return JsonResponse({
            "title": p.title,
            "content_html": p.content_html,
            "updated_at": p.updated_at.strftime("%B %d, %Y")
        })
    except LegalPage.DoesNotExist:
        raise Http404("Page not found")
