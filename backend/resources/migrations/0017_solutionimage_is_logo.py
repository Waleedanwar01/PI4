from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0016_solutioncard'),
    ]

    operations = [
        migrations.AddField(
            model_name='solutionimage',
            name='is_logo',
            field=models.BooleanField(default=False, help_text='Mark image as a client logo for marquee'),
        ),
    ]

