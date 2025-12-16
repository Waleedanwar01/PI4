from django.http import JsonResponse
from .models import ClaimsPage, SolutionPage, QuotePage
from blogs.models import SiteConfig


def claims_page(request):
    page = ClaimsPage.objects.first()
    if not page:
        return JsonResponse({
            'title': 'Claims',
            'hero_subtitle': '',
            'hero_image': '',
            'body_html': '',
            'meta_title': '',
            'meta_description': '',
        })
    return JsonResponse({
        'title': page.title,
        'hero_subtitle': page.hero_subtitle,
        'hero_image': page.hero_image.url if page.hero_image else '',
        'body_html': page.body_html,
        'meta_title': page.meta_title,
        'meta_description': page.meta_description,
    })


def _abs(request, f):
    try:
        return request.build_absolute_uri(f.url)
    except Exception:
        return ''


def solution_page(request, slug):
    base = (slug or '').strip('/')
    candidates = [base]
    if not base.startswith('solutions/'):
        candidates.append('solutions/' + base)
    try:
        page = SolutionPage.objects.prefetch_related('images', 'consultants', 'services__buttons', 'videos', 'industries', 'cards', 'page_buttons').select_related('parent').get(slug__in=candidates)
    except SolutionPage.DoesNotExist:
        return JsonResponse({
            'title': base.replace('-', ' ').title(),
            'hero_subtitle': '',
            'hero_image': '',
            'body_html': '',
            'button_text': '',
            'button_url': '',
            'phone': '',
            'meta_title': '',
            'meta_description': '',
            'cards_title': '',
            'cards_intro_html': '',
            'images': [],
            'breadcrumbs': [],
        })
    phone = page.phone
    if not phone:
        try:
            cfg = SiteConfig.objects.first()
            phone = (cfg.phone or '')
        except Exception:
            phone = ''
    images = [{ 'url': _abs(request, im.image), 'caption': im.caption, 'order': im.order, 'is_logo': getattr(im, 'is_logo', False) } for im in page.images.all()]
    consultants = []
    for c in page.consultants.all():
        consultants.append({ 'name': c.name, 'title': c.title, 'photo': _abs(request, c.photo) if c.photo else '', 'intro_html': c.intro_html, 'email': c.email, 'phone': c.phone, 'order': c.order })
    services = []
    for s in page.services.all():
        buttons = []
        for b in s.buttons.all():
            try:
                file_url = _abs(request, b.file) if getattr(b, 'file', None) else ''
            except Exception:
                file_url = ''
            buttons.append({ 'label': b.label, 'url': b.url, 'file_url': file_url, 'order': b.order })
        services.append({ 'title': s.title, 'description_html': s.description_html, 'pricing_html': s.pricing_html, 'learn_more_url': s.learn_more_url, 'schedule_url': s.schedule_url, 'upcoming_url': s.upcoming_url, 'order': s.order, 'buttons': buttons })
    videos = []
    for v in page.videos.all():
        videos.append({ 'title': v.title, 'description_html': v.description_html, 'youtube_url': v.youtube_url, 'order': v.order })
    industries = []
    for i in page.industries.all():
        industries.append({ 'name': i.name, 'icon': _abs(request, i.icon) if i.icon else '', 'order': i.order })
    cards = []
    for c in page.cards.all():
        try:
            icon = _abs(request, c.icon) if c.icon else ''
        except Exception:
            icon = ''
        cards.append({ 'title': c.title, 'icon': icon, 'body_html': c.body_html, 'order': c.order })
    page_buttons = []
    for pb in page.page_buttons.all():
        try:
            file_url = _abs(request, pb.file) if getattr(pb, 'file', None) else ''
        except Exception:
            file_url = ''
        page_buttons.append({ 'label': pb.label, 'url': pb.url, 'file_url': file_url, 'order': pb.order })
    breadcrumbs = []
    p = page
    while p:
        breadcrumbs.append({ 'title': p.title, 'slug': p.slug })
        p = p.parent
    breadcrumbs.reverse()
    data = {
        'title': page.title,
        'hero_subtitle': page.hero_subtitle,
        'hero_image': _abs(request, page.hero_image) if page.hero_image else '',
        'body_html': page.body_html,
        'button_text': page.button_text,
        'button_url': page.button_url,
        'phone': phone,
        'meta_title': page.meta_title,
        'meta_description': page.meta_description,
        'cards_title': page.cards_title,
        'cards_intro_html': page.cards_intro_html,
        'images': images,
        'breadcrumbs': breadcrumbs,
        'consultants': consultants,
        'services': services,
        'videos': videos,
        'industries': industries,
        'cards': cards,
        'page_buttons': page_buttons,
    }
    return JsonResponse(data)


def solutions_tree(request):
    pages = SolutionPage.objects.select_related('parent').filter(show_in_menu=True).order_by('menu_order', 'title')
    items = []
    by_id = {}
    for p in pages:
        node = { 'title': p.title, 'slug': p.slug, 'children': [], 'order': p.menu_order }
        by_id[p.id] = node
    for p in pages:
        node = by_id[p.id]
        if p.parent_id and p.parent_id in by_id:
            by_id[p.parent_id]['children'].append(node)
        else:
            items.append(node)
    # sort children by order then title
    def sort_nodes(nodes):
        nodes.sort(key=lambda n: (n.get('order', 0), n.get('title', '')))
        for n in nodes:
            if n.get('children'):
                sort_nodes(n['children'])
    sort_nodes(items)
    return JsonResponse({ 'items': items })


def quote_page(request):
    page = QuotePage.objects.prefetch_related('cards').first()
    if not page:
        return JsonResponse({
            'title': 'Get A Quote',
            'intro_text': 'Select solutions to fit your needs',
            'button_text': 'OR ASK AN AGENT',
            'button_url': '',
            'meta_title': 'Get A Quote',
            'meta_description': '',
            'cards': [],
        })
    cards = []
    for c in page.cards.all():
        try:
            icon = _abs(request, c.icon) if c.icon else ''
        except Exception:
            icon = ''
        cards.append({ 'title': c.title, 'description': c.description, 'url': c.url, 'icon': icon, 'active': getattr(c, 'active', False), 'order': c.order })
    data = {
        'title': page.title,
        'intro_text': page.intro_text,
        'button_text': page.button_text,
        'button_url': page.button_url,
        'meta_title': page.meta_title,
        'meta_description': page.meta_description,
        'cards': cards,
    }
    return JsonResponse(data)
    page_buttons = []
    for pb in page.page_buttons.all():
        try:
            file_url = _abs(request, pb.file) if getattr(pb, 'file', None) else ''
        except Exception:
            file_url = ''
        page_buttons.append({ 'label': pb.label, 'url': pb.url, 'file_url': file_url, 'order': pb.order })
