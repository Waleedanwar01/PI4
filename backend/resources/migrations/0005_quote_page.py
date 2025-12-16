from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0004_menu_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuotePage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='Get A Quote', max_length=200)),
                ('button_text', models.CharField(blank=True, max_length=120)),
                ('button_url', models.URLField(blank=True)),
                ('intro_text', models.CharField(blank=True, max_length=300)),
                ('meta_title', models.CharField(blank=True, max_length=200)),
                ('meta_description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='QuoteCard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('url', models.URLField(blank=True)),
                ('icon', models.ImageField(blank=True, null=True, upload_to='quote_icons/')),
                ('order', models.PositiveIntegerField(default=0)),
                ('page', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='cards', to='resources.quotepage')),
            ],
            options={'ordering': ['order', 'id']},
        ),
    ]

