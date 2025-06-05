from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
# from .products import products
from .models import Products
from .serializer import ProductsSerializer,UserSerializer,UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

# for sending mails and generate token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
# from .utils import TokenGenerator,generate_token
from django.utils.encoding import force_bytes,force_text,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    return Response('Hello Anees')

@api_view(['GET'])
def getProducts(request):
    products=Products.objects.all()
    serializer=ProductsSerializer(products,many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request,pk):
    product=Products.objects.get(_id=pk)
    serializer=ProductsSerializer(product,many=False)
    return Response(serializer.data)



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer=UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v       
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer

