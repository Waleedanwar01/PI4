from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0011_update_consulting_body'),
    ]

    operations = [
        migrations.CreateModel(
            name='ServiceButton',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=120)),
                ('url', models.URLField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('offering', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='buttons', to='resources.serviceoffering')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='SolutionVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description_html', models.TextField(blank=True)),
                ('youtube_url', models.URLField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='videos', to='resources.solutionpage')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='IndustryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('icon', models.ImageField(blank=True, null=True, upload_to='industry_icons/')),
                ('order', models.PositiveIntegerField(default=0)),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='industries', to='resources.solutionpage')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
    ]
