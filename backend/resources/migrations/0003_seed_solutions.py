from django.db import migrations


def seed_solutions(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')

    def ensure(title, slug, parent=None, hero_subtitle='', body_html='', button_text='ASK AN AGENT', button_url='', phone=''):
        obj, _ = SolutionPage.objects.get_or_create(
            slug=slug,
            defaults={
                'title': title,
                'parent': parent,
                'hero_subtitle': hero_subtitle,
                'body_html': body_html,
                'button_text': button_text,
                'button_url': button_url,
                'phone': phone,
                'meta_title': title,
                'meta_description': '',
            }
        )
        # If it existed without parent, update parent to new one (for re-runs)
        if parent and obj.parent_id != parent.id:
            obj.parent = parent
            obj.save(update_fields=['parent'])
        return obj

    # Common body content resembling requested design (paragraph + two-column bullets)
    body = (
        "<p>Our dedicated team is here to help with any of your insurance needs."
        " From protecting your home and car to your wine and art collections,"
        " we can find you the right coverage. Working with top tier carriers,"
        " we represent dozens of carriers and can find you the right solution for your unique needs.</p>"
        "<ul>"
        "<li>Homeowners</li><li>Condominium</li><li>Auto</li><li>Classic &amp; Exotic Cars</li>"
        "<li>Cyber</li><li>Travel</li><li>Flood</li><li>Earthquake</li><li>Pet</li><li>Wedding</li>"
        "<li>Dwelling/Fire</li><li>Collectibles, Antiques, Wine</li><li>Jewelry</li><li>Yacht/Boat</li>"
        "<li>Aviation</li><li>Life</li><li>Disability</li><li>Health</li>"
        "</ul>"
    )

    # Top-level pages
    personal = ensure('Personal Insurance', 'personal-insurance', hero_subtitle='Insurance for Individuals & Families', body_html=body)
    business = ensure('Business Insurance', 'business-insurance', hero_subtitle='Insurance for Businesses', body_html='<p>Protect your business with tailored coverage options.</p>')
    lifehealth = ensure('Life & Health', 'life-health', hero_subtitle='Life & Disability & Health', body_html='<p>Plans for your health, income protection and legacy.</p>')
    programs = ensure('Special Programs', 'special-programs', hero_subtitle='Industry & Specialty Programs', body_html='<p>Specialized programs crafted for unique risks.</p>')

    # Children under Special Programs
    ensure('Specialty Entertainment', 'special-programs/specialty-entertainment', parent=programs, body_html='<p>Coverage for production and entertainment ventures.</p>')
    ensure('Apartment Building', 'special-programs/apartment-building', parent=programs, body_html='<p>Solutions for multi-family properties and landlords.</p>')
    ensure('Consulting Services', 'special-programs/consulting-services', parent=programs, body_html='<p>Professional liability and business coverages.</p>')
    ensure('Dental Practice', 'special-programs/dental-practice', parent=programs, body_html='<p>Comprehensive coverage for dental professionals.</p>')
    ensure('Franchise Protection', 'special-programs/franchise-protection', parent=programs, body_html='<p>Aligned coverage for franchise operations.</p>')
    ensure('Private Client', 'special-programs/private-client', parent=programs, body_html='<p>Bespoke solutions for high-value personal risks.</p>')
    ensure('Workers’ Compensation', 'special-programs/workers-compensation', parent=programs, body_html='<p>Protect your workforce and comply with requirements.</p>')


def unseed_solutions(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')
    slugs = [
        'personal-insurance', 'business-insurance', 'life-health', 'special-programs',
        'special-programs/specialty-entertainment', 'special-programs/apartment-building',
        'special-programs/consulting-services', 'special-programs/dental-practice',
        'special-programs/franchise-protection', 'special-programs/private-client',
        'special-programs/workers-compensation',
    ]
    SolutionPage.objects.filter(slug__in=slugs).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('resources', '0002_solutionpage_solutionimage'),
    ]

    operations = [
        migrations.RunPython(seed_solutions, unseed_solutions),
    ]

