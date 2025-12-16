from django.db import migrations


def update_body(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')
    try:
        page = SolutionPage.objects.get(slug='special-programs/consulting-services')
    except SolutionPage.DoesNotExist:
        return

    body = (
        "<p>Our consulting services support employers with training, written programs, and ongoing HR guidance, tailored to your operations.</p>"
        "<h2>Industries we specialize in</h2>"
        "<ul>"
        "<li>Restaurants</li>"
        "<li>Franchises</li>"
        "<li>Manufacturing</li>"
        "<li>Construction</li>"
        "<li>Non-emergency medical transport</li>"
        "<li>Health Services</li>"
        "<li>Retail</li>"
        "<li>Distribution</li>"
        "<li>Transportation</li>"
        "<li>Contractors</li>"
        "</ul>"
    )
    page.body_html = body
    page.meta_title = page.title
    page.save(update_fields=['body_html', 'meta_title'])


def revert_body(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')
    try:
        page = SolutionPage.objects.get(slug='special-programs/consulting-services')
    except SolutionPage.DoesNotExist:
        return
    page.body_html = '<p>Professional liability and business coverages.</p>'
    page.save(update_fields=['body_html'])


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0010_seed_consulting_services'),
    ]

    operations = [
        migrations.RunPython(update_body, revert_body),
    ]
