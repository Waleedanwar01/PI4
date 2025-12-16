from django.urls import path
from .views import claims_page, solution_page, solutions_tree, quote_page


urlpatterns = [
    path('claims', claims_page),
    path('solutions/page/<path:slug>', solution_page),
    path('solutions/tree', solutions_tree),
    path('quote', quote_page),
]
