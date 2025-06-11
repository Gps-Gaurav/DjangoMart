from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Products,Order, OrderItem
from .serializer import ProductsSerializer, UserSerializer, UserSerializerWithToken,OrderSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
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
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken  # ✅ JWT tokens

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
@api_view(['GET'])
def getProducts(request):
    try:
        products = Products.objects.all()
        serializer = ProductsSerializer(products, many=True, context={'request': request})
        return Response({
            'products': serializer.data,
            'timestamp': get_current_time(),
            'current_user': request.user.username if request.user.is_authenticated else None
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
def getProduct(request, pk):
    try:
        product = Products.objects.get(_id=pk)
        serializer = ProductsSerializer(product, many=False)
        return Response({
            'product': serializer.data,
            'timestamp': get_current_time(),
            'current_user': request.user.username if request.user.is_authenticated else None
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
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# User Authentication Views
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

@api_view(['POST'])
def google_auth(request):
    token = request.data.get('access_token')
    if not token:
        return Response({'error': 'Missing access_token'}, status=400)

    try:
        # Verify token with Google
        response = requests.get(
            f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}"
        )
        data = response.json()
        if "error" in data:
            return Response({'error': data["error"]}, status=400)

        # Optionally check audience
        if data["audience"] != settings.GOOGLE_CLIENT_ID:
            return Response({'error': 'Invalid audience'}, status=400)

        # ✅ Extract user info
        email = data.get("email")
        name = data.get("name", email.split('@')[0])

        # Create or get user
        # Your logic to return JWT token or session
        return Response({"email": email, "name": name})
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
def github_auth(request):
    code = request.data.get('code')
    if not code:
        return Response({'error': 'Missing code'}, status=400)

    try:
        # Exchange code for access token
        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'client_id': settings.GITHUB_CLIENT_ID,
                'client_secret': settings.GITHUB_CLIENT_SECRET,
                'code': code,
            },
            headers={'Accept': 'application/json'}
        )
        token_data = token_response.json()
        access_token = token_data.get('access_token')

        if not access_token:
            return Response({'error': 'Token fetch failed'}, status=400)

        # Use access token to get user info
        user_response = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'token {access_token}'}
        )
        user_data = user_response.json()
        email_response = requests.get(
            'https://api.github.com/user/emails',
            headers={'Authorization': f'token {access_token}'}
        )
        email_data = email_response.json()
        primary_email = next((e["email"] for e in email_data if e["primary"]), None)

        # Your logic to create/get user
        return Response({
            'username': user_data.get("login"),
            'email': primary_email,
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
        
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
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data.get('orderItems', [])
    if not orderItems:
        return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)

    # Create order
    order = Order.objects.create(
        user=user,
        paymentMethod=data.get('paymentMethod', ''),
        taxPrice=data.get('taxPrice', 0),
        shippingPrice=data.get('shippingPrice', 0),
        totalPrice=data.get('totalPrice', 0),
    )

    # Create order items and link to order
    for item in orderItems:
        product = Products.objects.get(_id=item['product'])
        
        # Reduce stockcount
        if product.stockcount < item['qty']:
            return Response({'detail': f'Not enough stock for {product.productname}'}, status=status.HTTP_400_BAD_REQUEST)
        product.stockcount -= item['qty']
        product.save()

        OrderItem.objects.create(
            product=product,
            order=order,
            name=product.productname,
            qty=item['qty'],
            price=item['price'],
            image=product.image_url,
        )

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if order.user != user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)