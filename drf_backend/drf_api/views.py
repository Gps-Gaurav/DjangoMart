from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Products
from .serializer import ProductsSerializer, UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

# for sending mails and generate token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from .utils import TokenGenerator, generate_token
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View


# API Routes
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/<id>/',
        '/api/users/',
        '/api/users/register/',
        '/api/users/profile/',
        '/api/users/login/',
    ]
    return Response(routes)


# Product Views
@api_view(['GET'])
def getProducts(request):
    try:
        products = Products.objects.all()
        serializer = ProductsSerializer(products, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Products.objects.get(_id=pk)
        serializer = ProductsSerializer(product, many=False)
        return Response(serializer.data)
    except Products.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# User Authentication Views
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# User Profile Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    try:
        user = request.user
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# User Registration and Activation
@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        # Check if user already exists
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'detail': 'User with this email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create(
            first_name=data['fname'],
            last_name=data['lname'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False
        )

        # Generate activation token and send email
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = generate_token.make_token(user)
        
        activation_link = f"http://{settings.DOMAIN}/activate/{uid}/{token}"
        
        email_subject = "Activate Your Account"
        message = render_to_string(
            "activate.html",
            {
                'user': user,
                'domain': settings.DOMAIN,
                'uid': uid,
                'token': token,
                'activation_link': activation_link
            }
        )

        email_message = EmailMessage(
            email_subject,
            message,
            settings.EMAIL_HOST_USER,
            [data['email']]
        )
        
        email_message.send()

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except KeyError as e:
        return Response(
            {'detail': f'Missing required field: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if user and generate_token.check_token(user, token):
                user.is_active = True
                user.save()
                return render(request, "activatesuccess.html")
            else:
                return render(request, "activatefail.html")
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return render(request, "activatefail.html")


# Product Management Views (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    try:
        user = request.user
        data = request.data
        
        product = Products.objects.create(
            user=user,
            productname=data['productname'],
            productbrand=data.get('productbrand', ''),
            productcategory=data.get('productcategory', ''),
            productinfo=data.get('productinfo', ''),
            price=data.get('price', 0),
            stockcount=data.get('stockcount', 0)
        )

        serializer = ProductsSerializer(product, many=False)
        return Response(serializer.data)
    
    except KeyError as e:
        return Response(
            {'detail': f'Missing required field: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        product = Products.objects.get(_id=pk)
        data = request.data
        
        product.productname = data.get('productname', product.productname)
        product.productbrand = data.get('productbrand', product.productbrand)
        product.productcategory = data.get('productcategory', product.productcategory)
        product.productinfo = data.get('productinfo', product.productinfo)
        product.price = data.get('price', product.price)
        product.stockcount = data.get('stockcount', product.stockcount)
        
        product.save()
        
        serializer = ProductsSerializer(product, many=False)
        return Response(serializer.data)
    
    except Products.DoesNotExist:
        return Response(
            {'detail': 'Product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Products.objects.get(_id=pk)
        product.delete()
        return Response({'detail': 'Product deleted successfully'})
    
    except Products.DoesNotExist:
        return Response(
            {'detail': 'Product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )