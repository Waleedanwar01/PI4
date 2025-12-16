from django.db import migrations


def seed_buttons_industries(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')
    ServiceOffering = apps.get_model('resources', 'ServiceOffering')
    ServiceButton = apps.get_model('resources', 'ServiceButton')
    IndustryItem = apps.get_model('resources', 'IndustryItem')
    SolutionVideo = apps.get_model('resources', 'SolutionVideo')

    try:
        page = SolutionPage.objects.get(slug='special-programs/consulting-services')
    except SolutionPage.DoesNotExist:
        return

    def set_buttons(offering_title, buttons):
        try:
            off = ServiceOffering.objects.get(page=page, title=offering_title)
        except ServiceOffering.DoesNotExist:
            return
        for i, (label, url) in enumerate(buttons, start=1):
            obj, created = ServiceButton.objects.get_or_create(
                offering=off, label=label,
                defaults={'url': url, 'order': i}
            )
            if not created:
                obj.url = url
                obj.order = i
                obj.save(update_fields=['url', 'order'])

    set_buttons('Harassment and Discrimination Prevention Training', [
        ('Learn more', '#'), ('Schedule', '#'), ('Upcoming classes', '#')
    ])
    set_buttons('Injury and Illness Prevention Program', [
        ('Learn more', '#'), ('Schedule', '#')
    ])
    set_buttons('Human Resources Package', [
        ('Contact us for pricing', '#')
    ])
    set_buttons('Corporate Diversity and Inclusion Training', [
        ('Contact us for pricing', '#'), ('Pricing sheet PDF', '#')
    ])

    industries = [
        'Restaurants', 'Franchises', 'Manufacturing', 'Construction',
        'Non-emergency medical transport', 'Health Services', 'Retail',
        'Distribution', 'Transportation', 'Contractors'
    ]
    for idx, name in enumerate(industries, start=1):
        IndustryItem.objects.get_or_create(page=page, name=name, defaults={'order': idx})

    SolutionVideo.objects.get_or_create(
        page=page,
        title='Business Consulting Services',
        defaults={'description_html': '<p>Overview of consulting services and flexibility for business owners.</p>', 'youtube_url': '', 'order': 1}
    )


def unseed_buttons_industries(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')
    ServiceOffering = apps.get_model('resources', 'ServiceOffering')
    ServiceButton = apps.get_model('resources', 'ServiceButton')
    IndustryItem = apps.get_model('resources', 'IndustryItem')
    SolutionVideo = apps.get_model('resources', 'SolutionVideo')
    try:
        page = SolutionPage.objects.get(slug='special-programs/consulting-services')
    except SolutionPage.DoesNotExist:
        return
    ServiceButton.objects.filter(offering__page=page).delete()
    IndustryItem.objects.filter(page=page).delete()
    SolutionVideo.objects.filter(page=page).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0012_video_buttons_industries'),
    ]

    operations = [
        migrations.RunPython(seed_buttons_industries, unseed_buttons_industries),
    ]
