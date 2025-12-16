from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0003_seed_solutions'),
    ]

    operations = [
        migrations.AddField(
            model_name='solutionpage',
            name='show_in_menu',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='solutionpage',
            name='menu_order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterModelOptions(
            name='solutionpage',
            options={'ordering': ['menu_order', 'title']},
        ),
    ]

