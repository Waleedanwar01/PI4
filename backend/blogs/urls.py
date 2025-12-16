from django.urls import path
from .views import blog_list, blog_detail, categories_list, faq_list, site_config, contact_submit, home_partners, about_page, about_stats, portal_page, auth_signup, auth_login, auth_me, auth_logout, legal_page, legal_list

urlpatterns = [
    path('api/resources/blogs', blog_list, name='blog_list'),
    path('api/resources/blogs/<slug:slug>', blog_detail, name='blog_detail'),
    path('api/resources/blog-categories', categories_list, name='blog_categories'),
    path('api/resources/faq', faq_list, name='faq_list'),
    path('api/site-config', site_config, name='site_config'),
    path('api/contact', contact_submit, name='contact_submit'),
    path('api/home/partners', home_partners, name='home_partners'),
    path('api/portal/page', portal_page, name='portal_page'),
    path('api/auth/signup', auth_signup, name='auth_signup'),
    path('api/auth/login', auth_login, name='auth_login'),
    path('api/auth/me', auth_me, name='auth_me'),
    path('api/auth/logout', auth_logout, name='auth_logout'),
    path('api/about/page', about_page, name='about_page'),
    path('api/about/stats', about_stats, name='about_stats'),
    path('api/legal/<slug:slug>', legal_page, name='legal_page'),
    path('api/legal', legal_list, name='legal_list'),
]
