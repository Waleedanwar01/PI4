from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0007_fix_child_slugs'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solutionpage',
            name='slug',
            field=models.CharField(
                max_length=220,
                unique=True,
                validators=[
                    django.core.validators.RegexValidator(
                        '^[A-Za-z0-9_/-]+$',
                        'Enter a valid path using letters, numbers, underscores, hyphens, and slashes.'
                    )
                ],
            ),
        ),
    ]
