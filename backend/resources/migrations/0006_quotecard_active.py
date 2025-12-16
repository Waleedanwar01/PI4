from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0005_quote_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='quotecard',
            name='active',
            field=models.BooleanField(default=False),
        ),
    ]

