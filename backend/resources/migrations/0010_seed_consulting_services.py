from django.db import migrations


def seed_consulting_services(apps, schema_editor):
    SolutionPage = apps.get_model('resources', 'SolutionPage')
    ServiceOffering = apps.get_model('resources', 'ServiceOffering')

    try:
        page = SolutionPage.objects.get(slug='special-programs/consulting-services')
    except SolutionPage.DoesNotExist:
        return

    def ensure(title, desc_html, pricing_html='', order=0, learn='', sched='', upcoming=''):
        obj, created = ServiceOffering.objects.get_or_create(
            page=page,
            title=title,
            defaults={
                'description_html': desc_html,
                'pricing_html': pricing_html,
                'order': order,
                'learn_more_url': learn,
                'schedule_url': sched,
                'upcoming_url': upcoming,
            }
        )
        if not created:
            obj.description_html = desc_html
            obj.pricing_html = pricing_html
            obj.order = order
            obj.learn_more_url = learn
            obj.schedule_url = sched
            obj.upcoming_url = upcoming
            obj.save(update_fields=['description_html', 'pricing_html', 'order', 'learn_more_url', 'schedule_url', 'upcoming_url'])

    # 1) Harassment and Discrimination Prevention Training
    desc1 = (
        "<p>This is an in-person classroom training that lasts for a minimum of two hours. "
        "Employers are to provide an adequate space for the instructor and class in order to have a meaningful presentation and discussion. "
        "Employers may also opt to send staff to our regular in-house training sessions, which are charged per seat.</p>"
    )
    pricing1 = (
        "<ul>"
        "<li>VIP Gaspar clients receive a fee waiver (please call to inquire about VIP status) – <strong>NO CHARGE</strong></li>"
        "<li>Current clients with Gaspar receive a 25% discount – <strong>$600</strong></li>"
        "<li>Standard rate for non-clients – <strong>$800</strong></li>"
        "<li>Employers with 15 or fewer employees are charged on a per-attendee basis – <strong>$35 per attendee</strong></li>"
        "<li>In-house training at Gaspar Headquarters (offered regularly) – <strong>$25 per attendee</strong></li>"
        "</ul>"
    )
    ensure(
        title='Harassment and Discrimination Prevention Training',
        desc_html=desc1,
        pricing_html=pricing1,
        order=1,
        learn='#',
        sched='#',
        upcoming='#'
    )

    # 2) Injury and Illness Prevention Program
    desc2 = (
        "<p>A complete written program will be customized for your business. This will include an initial training session of the material. "
        "The training session will either be in person or web-based depending on the distance.</p>"
    )
    pricing2 = (
        "<ul>"
        "<li>VIP Gaspar clients receive a fee waiver (please call to inquire about VIP status) – <strong>NO CHARGE</strong></li>"
        "<li>Current clients with Gaspar receive a 25% discount – <strong>$375</strong></li>"
        "</ul>"
    )
    ensure(
        title='Injury and Illness Prevention Program',
        desc_html=desc2,
        pricing_html=pricing2,
        order=2,
        learn='#',
        sched='#'
    )

    # 3) Human Resources Package
    desc3 = (
        "<ul>"
        "<li>Labor Law Posters</li>"
        "<li>State and Federal</li>"
        "<li>HR360 Subscription – HR &amp; Benefits Compliance</li>"
        "<li>HR360 provides a team of attorneys, human resources specialists, and editors who provide clear and concise guidance on employment law and HR best practices at your fingertips</li>"
        "</ul>"
    )
    pricing3 = (
        "<ul>"
        "<li>Current Clients – <strong>NO CHARGE</strong></li>"
        "<li>Standard rate for non-clients – <strong>Call For Pricing</strong></li>"
        "</ul>"
    )
    ensure(
        title='Human Resources Package',
        desc_html=desc3,
        pricing_html=pricing3,
        order=3,
        learn='#'
    )

    # 4) Corporate Diversity and Inclusion Training
    desc4 = (
        "<ul>"
        "<li>Half-Day Training Seminar geared towards managers and supervisors (8am-12pm or 1pm-5pm)</li>"
        "<li>Includes 2-hours of Harassment and Discrimination Prevention Training (Meets the California Legal requirement)</li>"
        "<li>Blueprint to Building a Diversity and Inclusion Program</li>"
        "<li>Becoming Culturally Competent</li>"
        "<li>Mitigating Unconscious Bias</li>"
        "<li>Creating Diversity Through Recruitment</li>"
        "<li>Capitalizing on Corporate Diversity and Inclusion; Setting Yourself Apart from The Competition</li>"
        "</ul>"
    )
    ensure(
        title='Corporate Diversity and Inclusion Training',
        desc_html=desc4,
        pricing_html='',
        order=4,
        learn='#'
    )


def unseed_consulting_services(apps, schema_editor):
    ServiceOffering = apps.get_model('resources', 'ServiceOffering')
    titles = [
        'Harassment and Discrimination Prevention Training',
        'Injury and Illness Prevention Program',
        'Human Resources Package',
        'Corporate Diversity and Inclusion Training',
    ]
    ServiceOffering.objects.filter(title__in=titles).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0009_solution_consulting_models'),
    ]

    operations = [
        migrations.RunPython(seed_consulting_services, unseed_consulting_services),
    ]
