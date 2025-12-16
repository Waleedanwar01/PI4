from django.db import migrations


def prefix_child_slugs(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')
    for p in SolutionPage.objects.select_related('parent').all():
        if p.parent_id and p.slug:
            parent_slug = (p.parent.slug or '').rstrip('/')
            if parent_slug and not p.slug.startswith(parent_slug + '/'):
                p.slug = f"{parent_slug}/{p.slug.lstrip('/')}"
                try:
                    p.save(update_fields=['slug'])
                except Exception:
                    pass


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0006_quotecard_active'),
    ]

    operations = [
        migrations.RunPython(prefix_child_slugs),
    ]

