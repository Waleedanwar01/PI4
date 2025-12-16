from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0008_alter_solutionpage_slug'),
    ]

    operations = [
        migrations.CreateModel(
            name='SolutionConsultant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('title', models.CharField(blank=True, max_length=200)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='consultants/')),
                ('intro_html', models.TextField(blank=True)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('phone', models.CharField(blank=True, max_length=50)),
                ('order', models.PositiveIntegerField(default=0)),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='consultants', to='resources.solutionpage')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='ServiceOffering',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description_html', models.TextField(blank=True)),
                ('pricing_html', models.TextField(blank=True)),
                ('learn_more_url', models.URLField(blank=True)),
                ('schedule_url', models.URLField(blank=True)),
                ('upcoming_url', models.URLField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='services', to='resources.solutionpage')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
    ]
