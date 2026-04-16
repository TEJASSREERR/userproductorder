from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# 🏠 HOME FUNCTION (MUST BE ABOVE urlpatterns)
def home(request):
    return HttpResponse("Django Backend is Running 🚀")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
]