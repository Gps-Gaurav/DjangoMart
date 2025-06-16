from django.shortcuts import render
from .models import Order, OrderItem, ShippingAddress, Products
from .serializer import ProductsSerializer, UserSerializer, UserSerializerWithToken,OrderSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken  # ✅ JWT tokens

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from datetime import datetime
import pytz


# For sending mails and generate token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from .utils import TokenGenerator, generate_token
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View
from django.contrib.auth import authenticate
import requests
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
import google.auth.transport.requests  # Changed import
import json
from datetime import datetime
from decimal import Decimal

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Google authentication endpoint
    """
    try:
        # Get the token from request
        data = request.data
        
        # Check for credential in request
        credential = data.get('credential') or data.get('id_token')
        
        if not credential:
            return Response({
                'error': 'No valid token provided',
                'detail': 'Please provide either credential or id_token'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create a Request object - Fixed this line
            request_class = google.auth.transport.requests.Request()

            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                credential,
                request_class,
                settings.GOOGLE_CLIENT_ID
            )
            
            # Print token info for debugging
            print("Token info:", json.dumps(idinfo, indent=2))

            # Verify issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # Get user info from token
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            
            # Print user info for debugging
            print(f"User info - Email: {email}, Name: {first_name} {last_name}")

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True
                }
            )

            if not created:
                # Update existing user's information
                user.first_name = first_name
                user.last_name = last_name
                user.save()

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'status': 'success',
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'username': user.username
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })

        except ValueError as e:
            print("Token verification failed:", str(e))
            return Response({
                'error': 'Invalid token',
                'detail': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        print("Authentication error:", str(e))
        return Response({
            'error': f'Authentication failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def test_google_token(request):
    """
    Test endpoint to verify token format and data
    """
    try:
        # Print raw request data
        print("Raw request data:", request.body)
        print("Parsed request data:", request.data)
        
        # Get token from request
        credential = request.data.get('credential')
        
        if not credential:
            return Response({
                'error': 'No credential provided',
                'received_data': request.data
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': 'Token received',
            'token_length': len(credential),
            'token_preview': credential[:50] + '...' if credential else None,
            'request_data': request.data
        })

    except Exception as e:
        return Response({
            'error': str(e),
            'received_data': request.data
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@permission_classes([AllowAny])


def google_auth_callback(request):
    """
    Handle Google OAuth callback and create/authenticate user
    """
    try:
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'error': 'Access token is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Verify token with Google
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if google_response.status_code != 200:
            return Response({'error': 'Invalid token'}, 
                          status=status.HTTP_401_UNAUTHORIZED)

        google_data = google_response.json()

        # Get or create user
        email = google_data.get('email')
        if not email:
            return Response({'error': 'Email not provided'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': google_data.get('given_name', ''),
                'last_name': google_data.get('family_name', ''),
                'is_active': True,
            }
        )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })

    except Exception as e:
        return Response(
            {'error': 'Authentication failed', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'detail': 'Please provide both username and password'},
                            status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'detail': 'Invalid credentials'},
                            status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username,
        })
# Get current UTC time
def get_current_time():
    return datetime.now(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S')

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
        '/api/users/login/refresh/',
    ]
    return Response({
        'routes': routes,
        'timestamp': get_current_time(),
        'current_user': request.user.username if request.user.is_authenticated else None
    })

# Product Views
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        
        # Add additional data
        data.update(serializer)
        data['timestamp'] = get_current_time()
        data['last_login'] = self.user.last_login.strftime('%Y-%m-%d %H:%M:%S') if self.user.last_login else None
        
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
        return Response({
            'user': serializer.data,
            'timestamp': get_current_time(),
            'current_user': user.username
        })
    except Exception as e:
        return Response(
            {
                'detail': str(e),
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({
            'users': serializer.data,
            'timestamp': get_current_time(),
            'current_user': request.user.username
        })
    except Exception as e:
        return Response(
            {
                'detail': str(e),
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# User Registration and Activation
@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    data = request.data
    try:
        # Check if user already exists
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {
                    'detail': 'User with this email already exists',
                    'timestamp': get_current_time()
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Split name into first and last name
        name_parts = data['name'].split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Create user
        user = User.objects.create(
            first_name=first_name,
            last_name=last_name,
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False
        )

        # Generate activation token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = generate_token.make_token(user)
        
        # Create activation link using settings
        domain = getattr(settings, 'DOMAIN', 'localhost:8000')
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        site_name = getattr(settings, 'SITE_NAME', 'DjangoMart')
        activation_link = f"http://{domain}/api/activate/{uid}/{token}"
        
        # Prepare email context
        context = {
            'user': user,
            'domain': domain,
            'uid': uid,
            'token': token,
            'activation_link': activation_link,
            'site_name': site_name,
            'frontend_url': frontend_url,
            'timestamp': get_current_time()
        }

        # Render email template
        email_subject = f"Activate Your {context['site_name']} Account"
        email_body = render_to_string('activate.html', context)

        # Send activation email
        try:
            email = EmailMessage(
                email_subject,
                email_body,
                settings.EMAIL_HOST_USER,
                [user.email]
            )
            email.content_subtype = 'html'
            email.send(fail_silently=False)
        except Exception as e:
            user.delete()  # Delete user if email sending fails
            return Response(
                {
                    'detail': f'Failed to send activation email: {str(e)}',
                    'timestamp': get_current_time()
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Return success response
        serializer = UserSerializerWithToken(user, many=False)
        return Response({
            'user': serializer.data,
            'message': 'Registration successful! Please check your email to activate your account.',
            'timestamp': get_current_time()
        })

    except KeyError as e:
        return Response(
            {
                'detail': f'Missing required field: {str(e)}',
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {
                'detail': str(e),
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )
class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        site_name = getattr(settings, 'SITE_NAME', 'DjangoMart')
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
           
            if user and generate_token.check_token(user, token):
                user.is_active = True
                user.save()
                
                context = {
                    'success': True,
                    'message': 'Account activated successfully!',
                    'timestamp': get_current_time(),
                    'username': user.username,
                    'site_name': site_name,
                    'frontend_url': frontend_url,  # 👈 passed to template
                }
                return render(request, "activatesuccess.html", context)
            else:
                context = {
                    'success': False,
                    'message': 'Activation link is invalid!',
                    'timestamp': get_current_time(),
                    'site_name': site_name,
                    'frontend_url': frontend_url,
                }
                return render(request, "activatefail.html", context)
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            context = {
                'success': False,
                'message': 'Activation failed!',
                'timestamp': get_current_time(),
                'site_name': site_name,
                'frontend_url': frontend_url
            }
            return render(request, "activatefail.html", context)

@api_view(['GET'])
@permission_classes([AllowAny])
def getProducts(request):
    try:
        products = Products.objects.all()
        serializer = ProductsSerializer(products, many=True, context={'request': request})
        return Response({
            'products': serializer.data,
            'timestamp': get_current_time(),
            'current_user': getattr(request.user, 'username', None) if getattr(request.user, 'is_authenticated', False) else None
        })
    except Exception as e:
        return Response(
            {
                'detail': str(e),
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    current_time = datetime(2025, 6, 16, 20, 33, 18)
    
    try:
        orderItems = data.get('orderItems', [])

        if not orderItems:
            return Response({
                'detail': 'No Order Items',
                'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
                'current_user': user.username
            }, status=status.HTTP_400_BAD_REQUEST)

        # Calculate prices
        itemsPrice = sum(Decimal(str(item.get('price', 0))) * Decimal(str(item.get('qty', 0))) for item in orderItems)
        shippingPrice = Decimal('0') if itemsPrice > Decimal('1000') else Decimal('100')
        taxPrice = Decimal('0.18') * itemsPrice
        totalPrice = itemsPrice + shippingPrice + taxPrice

        # Create order
        order = Order.objects.create(
            user=user,
            paymentMethod=data.get('paymentMethod', 'PayPal'),
            itemsPrice=itemsPrice,
            taxPrice=taxPrice,
            shippingPrice=shippingPrice,
            totalPrice=totalPrice,
            createdAt=current_time,
            createdBy=user.username,
            updatedBy=user.username
        )

        # Create shipping address
        shipping_data = data.get('shippingAddress', {})
        ShippingAddress.objects.create(
            order=order,
            address=shipping_data.get('address', ''),
            city=shipping_data.get('city', ''),
            postalCode=shipping_data.get('postalCode', ''),
            country=shipping_data.get('country', ''),
            createdAt=current_time
        )

        # Create order items and update stock
        created_items = []
        for item in orderItems:
            product = Products.objects.get(_id=item['product'])
            
            if product.stockcount < item['qty']:
                order.delete()  # Delete the order if stock is insufficient
                return Response({
                    'detail': f'Not enough stock for {product.productname}',
                    'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
                    'current_user': user.username
                }, status=status.HTTP_400_BAD_REQUEST)

            order_item = OrderItem.objects.create(
                product=product,
                order=order,
                productname=product.productname,
                qty=item['qty'],
                price=product.price,
                image=product.image,
                createdAt=current_time
            )
            created_items.append(order_item)

            # Update stock
            product.stockcount -= item['qty']
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response({
            'order': serializer.data,
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': user.username,
            'message': 'Order created successfully'
        }, status=status.HTTP_201_CREATED)

    except Products.DoesNotExist as e:
        return Response({
            'detail': 'Product not found',
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': user.username
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # If any error occurs, delete the order if it was created
        if 'order' in locals():
            order.delete()
        
        return Response({
            'detail': str(e),
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': user.username
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    current_time = datetime(2025, 6, 16, 20, 33, 18)
    try:
        order = Order.objects.get(id=pk)
        
        if order.user == request.user or request.user.is_staff:
            serializer = OrderSerializer(order, many=False)
            return Response({
                'order': serializer.data,
                'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
                'current_user': request.user.username
            })
        else:
            return Response({
                'detail': 'Not authorized to view this order',
                'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
                'current_user': request.user.username
            }, status=status.HTTP_403_FORBIDDEN)
            
    except Order.DoesNotExist:
        return Response({
            'detail': 'Order does not exist',
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': request.user.username
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    current_time = datetime(2025, 6, 16, 20, 33, 18)
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-createdAt')
    serializer = OrderSerializer(orders, many=True)
    return Response({
        'orders': serializer.data,
        'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
        'current_user': user.username
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    current_time = datetime(2025, 6, 16, 20, 33, 18)
    try:
        order = Order.objects.get(id=pk)
        
        if order.user != request.user and not request.user.is_staff:
            return Response({
                'detail': 'Not authorized to update this order',
                'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
                'current_user': request.user.username
            }, status=status.HTTP_403_FORBIDDEN)

        order.isPaid = True
        order.paidAt = current_time
        order.updatedAt = current_time
        order.updatedBy = request.user.username
        order.save()

        serializer = OrderSerializer(order)
        return Response({
            'message': 'Order was paid successfully',
            'order': serializer.data,
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': request.user.username
        })
        
    except Order.DoesNotExist:
        return Response({
            'detail': 'Order not found',
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': request.user.username
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToDelivered(request, pk):
    current_time = datetime(2025, 6, 16, 20, 33, 18)
    try:
        order = Order.objects.get(id=pk)

        if not request.user.is_staff:
            return Response({
                'detail': 'Not authorized to update this order',
                'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
                'current_user': request.user.username
            }, status=status.HTTP_403_FORBIDDEN)

        order.isDelivered = True
        order.deliveredAt = current_time
        order.updatedAt = current_time
        order.updatedBy = request.user.username
        order.save()

        serializer = OrderSerializer(order)
        return Response({
            'message': 'Order was delivered successfully',
            'order': serializer.data,
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': request.user.username
        })

    except Order.DoesNotExist:
        return Response({
            'detail': 'Order not found',
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'current_user': request.user.username
        }, status=status.HTTP_404_NOT_FOUND)           
        
        
        
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
        return Response({
            'product': serializer.data,
            'timestamp': get_current_time(),
            'current_user': user.username
        })
    
    except KeyError as e:
        return Response(
            {
                'detail': f'Missing required field: {str(e)}',
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {
                'detail': str(e),
                'timestamp': get_current_time()
            }, 
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
        return Response({
            'product': serializer.data,
            'timestamp': get_current_time(),
            'current_user': request.user.username
        })
    
    except Products.DoesNotExist:
        return Response(
            {
                'detail': 'Product not found',
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {
                'detail': str(e),
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Products.objects.get(_id=pk)
        product.delete()
        return Response({
            'detail': 'Product deleted successfully',
            'timestamp': get_current_time(),
            'current_user': request.user.username
        })
    
    except Products.DoesNotExist:
        return Response(
            {
                'detail': 'Product not found',
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {
                'detail': str(e),
                'timestamp': get_current_time()
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )
     
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if order.user != user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)