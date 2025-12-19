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
                img_url = request.build_absolute_uri(post.cover_image.url)
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
            img_url = request.build_absolute_uri(post.cover_image.url)
        except Exception:
            img_url = ""

    images = []
    for img in post.images.all():
        try:
            url = request.build_absolute_uri(img.image.url)
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
        "author": post.author,
        "date": localtime(post.created_at).strftime("%B %d, %Y"),
        "categories": [c.name for c in post.categories.all()],
        "primary_category": post.primary_category.name if post.primary_category else "",
        "image": img_url,
        "excerpt": post.excerpt,
        "content_html": post.content_html,
        "slug": post.slug,
        "images": images,
    }
    return JsonResponse(data)

@require_GET
def categories_list(request):
    cats = Category.objects.all().order_by('name')
    items = [{"name": c.name, "slug": c.slug} for c in cats]
    return JsonResponse({"items": items})

@require_GET
def faq_list(request):
    faqs = FAQ.objects.filter(published=True).select_related("category").order_by("category__name", "order", "id")
    groups = {}
    for f in faqs:
        key = f.category.name if f.category else "General"
        if key not in groups:
            groups[key] = []
        groups[key].append({
            "id": f.id,
            "question": f.question,
            "answer_html": f.answer_html,
            "category": key,
        })
    data = {
        "groups": [{"category": k, "items": v} for k, v in groups.items()]
    }
    return JsonResponse(data)

@require_GET
def site_config(request):
    cfg = SiteConfig.objects.order_by('-updated_at').first()
    if not cfg:
        return JsonResponse({
            "site_name": "Gaspar Insurance Services",
            "homepage_title": "",
            "logo_url": "",
            "favicon_url": "",
            "phone": "",
            "email": "",
            "address": {
                "line1": "",
                "line2": "",
                "city": "",
                "state": "",
                "postal_code": "",
            },
            "social": {
                "facebook": "",
                "twitter": "",
                "linkedin": "",
                "instagram": "",
                "youtube": "",
            },
            "footer_about": "",
            "addresses": [],
            "pages_meta": [],
            "updated_at": "",
        })
    def safe_url(f):
        if not f:
            return ""
        try:
            return request.build_absolute_uri(f.url)
        except Exception:
            return ""
    data = {
        "site_name": cfg.site_name,
        "homepage_title": cfg.homepage_title,
        "logo_url": safe_url(cfg.logo),
        "favicon_url": safe_url(cfg.favicon),
        "phone": cfg.phone,
        "email": cfg.email,
        "address": {
            "line1": cfg.address_line1,
            "line2": cfg.address_line2,
            "city": cfg.city,
            "state": cfg.state,
            "postal_code": cfg.postal_code,
        },
        "social": {
            "facebook": cfg.facebook_url,
            "twitter": cfg.twitter_url,
            "linkedin": cfg.linkedin_url,
            "instagram": cfg.instagram_url,
            "youtube": cfg.youtube_url,
        },
        "footer_about": cfg.footer_about,
        "addresses": [
            {
                "label": a.label,
                "line1": a.line1,
                "line2": a.line2,
                "city": a.city,
                "state": a.state,
                "postal_code": a.postal_code,
            }
            for a in SiteAddress.objects.filter(config=cfg).order_by('order', 'id')[:3]
        ] or ([
            {
                "label": "",
                "line1": cfg.address_line1,
                "line2": cfg.address_line2,
                "city": cfg.city,
                "state": cfg.state,
                "postal_code": cfg.postal_code,
            }
        ] if any([cfg.address_line1, cfg.city, cfg.state, cfg.postal_code]) else []),
        "pages_meta": [
            {
                "slug": pm.slug,
                "title": pm.title,
                "meta_title": pm.meta_title,
                "meta_description": pm.meta_description,
            }
            for pm in PageMeta.objects.filter(config=cfg).order_by('slug', 'id')
        ],
        "updated_at": localtime(cfg.updated_at).isoformat(),
    }
    return JsonResponse(data)




@require_GET
def home_partners(request):
    items = []
    for p in PartnerLogo.objects.order_by('order', 'id'):
        try:
            img = request.build_absolute_uri(p.image.url)
        except Exception:
            img = ""
        items.append({
            "name": p.name,
            "image": img,
            "url": p.url,
            "order": p.order,
        })
    return JsonResponse({"items": items})


@require_GET
def portal_page(request):
    cfg = SiteConfig.objects.order_by('-updated_at').first()
    page = PortalPage.objects.prefetch_related('videos', 'features').order_by('-updated_at', '-id').first()
    def safe_file_url(f):
        if not f:
            return ""
        try:
            return request.build_absolute_uri(f.url)
        except Exception:
            return ""
    title = page.title if page else 'Customer Portal'
    hero_subtitle = page.hero_subtitle if page else ''
    hero_image = safe_file_url(page.hero_image) if page and page.hero_image else ''
    portal_url = (page.portal_url if page else '')
    if not portal_url:
        portal_url = request.build_absolute_uri('/')  # placeholder; frontend can override via env
    faq_cat = (page.faq_category or '').strip() if page else ''
    use_faq = bool(page and page.use_faq_points)
    show_partners = bool(page and page.show_partners)
    ios_url = page.appstore_ios_url if page else ''
    android_url = page.appstore_android_url if page else ''
    features = []
    if use_faq and faq_cat:
        qs = FAQ.objects.filter(category__name__iexact=faq_cat, published=True).order_by('order','id')
        features = [f.question for f in qs][:12]
    else:
        features = [it.text for it in (page.features.all() if page else [])]
    videos = [v.youtube_url for v in (page.videos.all() if page else [])]
    if cfg and cfg.youtube_url:
        if cfg.youtube_url not in videos:
            videos.insert(0, cfg.youtube_url)
    partners = []
    if show_partners:
        for p in PartnerLogo.objects.order_by('order','id'):
            partners.append({
                'name': p.name,
                'image': safe_file_url(p.image),
                'url': p.url,
                'order': p.order,
            })
    data = {
        'title': title,
        'hero_subtitle': hero_subtitle,
        'hero_image': hero_image,
        'portal_url': portal_url,
        'features': features,
        'videos': videos,
        'partners': partners,
        'appstore_ios_url': ios_url,
        'appstore_android_url': android_url,
        'contact_email': (cfg.email if cfg else ''),
        'contact_phone': (cfg.phone if cfg else ''),
    }
    return JsonResponse(data)


@require_GET
def about_page(request):
    page = AboutPage.objects.order_by('-updated_at').first()
    if not page:
        return JsonResponse({
            'title': 'About Us',
            'hero_subtitle': 'We put your protection first.',
            'hero_image': '',
            'body_html': '<p>We help clients succeed with cost-effective coverage, risk management advice, and employee benefits solutions.</p><p>Our experienced team works across personal and commercial lines to deliver value and service.</p>',
            'meta_title': 'About Us',
            'meta_description': 'Learn more about our team and services.',
        })
    try:
        hero = request.build_absolute_uri(page.hero_image.url) if page.hero_image else ''
    except Exception:
        hero = ''
    body = page.body_html or ''
    def abs_url(u: str) -> str:
        try:
            return request.build_absolute_uri(u)
        except Exception:
            return u
    def rewrite_src(m):
        src = m.group(1)
        if src.startswith('http://') or src.startswith('https://'):
            return f'src="{src}"'
        if src.startswith('/'):
            return f'src="{abs_url(src)}"'
        return 'src="' + abs_url('/' + src) + '"'
    body = re.sub(r'src=["\']([^"\']+)["\']', rewrite_src, body)
    images = []
    for img in page.images.all().order_by('order', 'id'):
        try:
            url = request.build_absolute_uri(img.image.url)
        except Exception:
            url = ''
        images.append({
            'url': url,
            'caption': img.caption,
            'order': img.order,
        })
    return JsonResponse({
        'title': page.title,
        'hero_subtitle': page.hero_subtitle,
        'hero_image': hero,
        'body_html': body,
        'images': images,
        'meta_title': page.meta_title,
        'meta_description': page.meta_description,
    })


@require_GET
def legal_page(request, slug):
    try:
        page = LegalPage.objects.get(slug=slug)
    except LegalPage.DoesNotExist:
        raise Http404("Page not found")
    def abs_url(u: str) -> str:
        try:
            return request.build_absolute_uri(u)
        except Exception:
            return u
    def rewrite_src(m):
        src = m.group(1)
        if src.startswith('http://') or src.startswith('https://'):
            return f'src="{src}"'
        if src.startswith('/'):
            return f'src="{abs_url(src)}"'
        return 'src="' + abs_url('/' + src) + '"'
    body = page.body_html or ""
    body = re.sub(r'src=["\']([^"\']+)["\']', rewrite_src, body)
    data = {
        'slug': page.slug,
        'title': page.title,
        'body_html': body,
        'meta_title': page.meta_title,
        'meta_description': page.meta_description,
        'updated_at': localtime(page.updated_at).isoformat(),
    }
    return JsonResponse(data)


@require_GET
def legal_list(request):
    items = [
        {
            'slug': p.slug,
            'title': p.title,
        }
        for p in LegalPage.objects.order_by('slug', 'id')
    ]
    return JsonResponse({ 'items': items })


@csrf_exempt
def auth_signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        payload = json.loads(request.body.decode('utf-8')) if request.body else {}
    except Exception:
        payload = request.POST.dict()
    email = (payload.get('email') or '').strip().lower()
    password = (payload.get('password') or '').strip()
    phone = (payload.get('phone') or '').strip()
    policy = (payload.get('policyNumber') or payload.get('policy_number') or '').strip()
    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)
    if User.objects.filter(username=email).exists():
        return JsonResponse({'error': 'Account already exists'}, status=400)
    user = User.objects.create_user(username=email, email=email, password=password)
    UserProfile.objects.create(user=user, phone=phone, policy_number=policy)
    return JsonResponse({'ok': True})


@csrf_exempt
def auth_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        payload = json.loads(request.body.decode('utf-8')) if request.body else {}
    except Exception:
        payload = request.POST.dict()
    email = (payload.get('email') or '').strip().lower()
    password = (payload.get('password') or '').strip()
    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)
    user = authenticate(request, username=email, password=password)
    if not user:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    login(request, user)
    return JsonResponse({'ok': True})


@require_GET
def auth_me(request):
    if not request.user.is_authenticated:
        return JsonResponse({'ok': False})
    p = getattr(request.user, 'profile', None)
    return JsonResponse({
        'ok': True,
        'email': request.user.username,
        'phone': (p.phone if p else ''),
        'policy_number': (p.policy_number if p else ''),
    })


@csrf_exempt
def auth_logout(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    logout(request)
    return JsonResponse({'ok': True})


@require_GET
def about_stats(request):
    items = [
        {
            'label': s.label,
            'value': s.value,
            'suffix': s.suffix,
            'order': s.order,
        }
        for s in AboutStat.objects.order_by('order', 'id')
    ]
    if not items:
        items = [
            { 'label': 'Years in Business', 'value': 13, 'suffix': '', 'order': 0 },
            { 'label': 'Carrier Partners', 'value': 246, 'suffix': '', 'order': 1 },
            { 'label': 'Bound Policies', 'value': 23000, 'suffix': '', 'order': 2 },
            { 'label': 'Annual Premiums in US$', 'value': 67000000, 'suffix': '', 'order': 3 },
        ]
    return JsonResponse({ 'items': items })
