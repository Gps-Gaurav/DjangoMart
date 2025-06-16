from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin
from .models import Products

# Unregister all default models except User
admin.site.unregister(Group)
from .models import Order, OrderItem, ShippingAddress

admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
@admin.register(Products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('productname', 'productbrand', 'productcategory', 'price', 'stockcount')
    list_filter = ('productbrand', 'productcategory')
    search_fields = ('productname', 'productbrand', 'productinfo')
    readonly_fields = ('createdAt', '_id')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'productname', 'image')
        }),
        ('Product Details', {
            'fields': ('productbrand', 'productcategory', 'productinfo')
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'stockcount')
        }),
        ('Ratings & Reviews', {
            'fields': ('rating', 'numReviews')
        }),
        ('System Fields', {
            'fields': ('createdAt', '_id'),
            'classes': ('collapse',)
        })
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields
        return ('createdAt', '_id')