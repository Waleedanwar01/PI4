from django.urls import path
from .views import claims_page, solution_page, solutions_tree, quote_page
from blogs.views import blog_list, blog_detail, categories_list, faq_list


urlpatterns = [
    path('blogs', blog_list, name='blog_list'),
    path('blogs/<slug:slug>', blog_detail, name='blog_detail'),
    path('blog-categories', categories_list, name='blog_categories'),
    path('faq', faq_list, name='faq_list'),
    path('claims', claims_page),
    path('solutions/page/<path:slug>', solution_page),
    path('solutions/tree', solutions_tree),
    path('quote', quote_page),
]
