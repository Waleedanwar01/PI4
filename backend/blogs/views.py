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

    return JsonResponse({
        "page": page_obj.number,
        "total_pages": paginator.num_pages,
        "total_items": paginator.count,
        "items": items,
    })


@require_GET
def categories_list(request):
    cats = Category.objects.all()
    items = [{"id": c.id, "name": c.name, "slug": c.slug} for c in cats]
    return JsonResponse({"items": items})


@require_GET
def faq_list(request):
    faqs = FAQ.objects.filter(published=True).select_related("category")
    items = []
    for f in faqs:
        items.append({
            "question": f.question,
            "answer": f.answer_html,
            "category": f.category.name
        })
    return JsonResponse({"items": items})


@require_GET
def site_config(request):
    cfg = SiteConfig.objects.first()
    if not cfg:
        return JsonResponse({})
    
    logo = ""
    if cfg.logo:
        try:
            logo = _abs(request, cfg.logo.url)
        except: pass
    
    favicon = ""
    if cfg.favicon:
        try:
            favicon = _abs(request, cfg.favicon.url)
        except: pass

    addrs = []
    for a in cfg.addresses.all():
        addrs.append({
            "label": a.label,
            "line1": a.line1,
            "line2": a.line2,
            "city": a.city,
            "state": a.state,
            "postal_code": a.postal_code,
        })
        
    pages = []
    for p in cfg.pages_meta.all():
        pages.append({
            "slug": p.slug,
            "title": p.title,
            "meta_title": p.meta_title,
            "meta_description": p.meta_description,
        })

    return JsonResponse({
        "site_name": cfg.site_name,
        "homepage_title": cfg.homepage_title,
        "logo": logo,
        "favicon": favicon,
        "phone": cfg.phone,
        "email": cfg.email,
        "address_line1": cfg.address_line1,
        "address_line2": cfg.address_line2,
        "city": cfg.city,
        "state": cfg.state,
        "postal_code": cfg.postal_code,
        "social": {
            "facebook": cfg.facebook_url,
            "twitter": cfg.twitter_url,
            "linkedin": cfg.linkedin_url,
            "instagram": cfg.instagram_url,
            "youtube": cfg.youtube_url,
        },
        "footer_about": cfg.footer_about,
        "addresses": addrs,
        "pages": pages,
    })


@csrf_exempt
def contact_submit(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        payload = json.loads(request.body)
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
            images.append({
                "url": url,
                "caption": img.caption
            })
        except: pass

    # Get related posts
    related = []
    # Logic: same categories
    cats = post.categories.all()
    if cats:
        rel_qs = BlogPost.objects.filter(categories__in=cats).exclude(id=post.id).distinct()[:3]
        for r in rel_qs:
            r_img = ""
            if r.cover_image:
                try:
                    r_img = _abs(request, r.cover_image.url)
                except: pass
            related.append({
                "title": r.title,
                "slug": r.slug,
                "date": localtime(r.created_at).strftime("%B %d, %Y"),
                "image": r_img
            })

    return JsonResponse({
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "author": post.author,
        "date": localtime(post.created_at).strftime("%B %d, %Y"),
        "image": img_url,
        "content": content,
        "categories": [c.name for c in post.categories.all()],
        "gallery": images,
        "related": related,
        "meta_title": post.title, # Fallback
        "meta_description": post.excerpt,
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
    
    feats = []
    for f in p.features.all():
        feats.append(f.text)
        
    vids = []
    for v in p.videos.all():
        vids.append(v.youtube_url)
    
    parts = []
    # If show_partners is true, maybe we should fetch PartnerLogo?
    # But PortalPage has no M2M to partners in the model I saw.
    # Ah, I saw 'p.partners.all()' in previous read, but in models.py 'PortalPage' has no 'partners'.
    # Maybe I misread or models.py was updated.
    # Let's check models.py again. 'PortalPage' has no 'partners' field.
    # But 'PartnerLogo' exists. Maybe we just return all partners if 'show_partners' is True?
    if p.show_partners:
        for pa in PartnerLogo.objects.all():
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
        "contact_email": "", # Not in model?
        "contact_phone": "", # Not in model?
    })


@csrf_exempt
def auth_me(request):
    if request.user.is_authenticated:
        # Get profile
        try:
            prof = request.user.profile
            phone = prof.phone
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
    UserProfile.objects.create(user=u, phone=d.get("phone", ""))
    
    login(request, u)
    return JsonResponse({"ok": True})


@require_GET
def resources_claims(request):
    return JsonResponse({
        "title": "Claims Center",
        "hero_subtitle": "Fast, fair and friendly claims service",
        "hero_image": "",
        "body_html": "<p>Report a claim 24/7 using our online portal or call us.</p>"
    })


@require_GET
def legal_page(request, slug):
    try:
        p = LegalPage.objects.get(slug=slug)
        return JsonResponse({
            "title": p.title,
            "content_html": p.body_html,
            "updated_at": localtime(p.updated_at).strftime("%B %d, %Y")
        })
    except LegalPage.DoesNotExist:
        raise Http404("Page not found")


@require_GET
def legal_list(request):
    # Return list of legal pages slugs
    pages = LegalPage.objects.all()
    items = [{"title": p.title, "slug": p.slug} for p in pages]
    return JsonResponse({"items": items})


@require_GET
def about_page(request):
    p = AboutPage.objects.first()
    if not p:
        return JsonResponse({})
    
    hero = ""
    try:
        hero = _abs(request, p.hero_image.url)
    except: pass
    
    return JsonResponse({
        "title": p.title,
        "hero_subtitle": p.hero_subtitle,
        "hero_image": hero,
        "body_html": p.body_html,
        "meta_title": p.meta_title,
        "meta_description": p.meta_description,
    })


@require_GET
def about_stats(request):
    stats = AboutStat.objects.all()
    items = []
    for s in stats:
        items.append({
            "label": s.label,
            "value": s.value,
            "suffix": s.suffix,
        })
    return JsonResponse({"items": items})


@require_GET
def home_partners(request):
    partners = PartnerLogo.objects.all()
    items = []
    for p in partners:
        img = ""
        try:
            img = _abs(request, p.image.url)
        except: pass
        items.append({
            "name": p.name,
            "image": img,
            "url": p.url,
        })
    return JsonResponse({"items": items})
