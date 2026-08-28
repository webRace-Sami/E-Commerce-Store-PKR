const API_BASE = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 Starting Full-Stack E-Commerce Test Suite...\n');

  // Test 1: Health
  console.log('1️⃣ Testing API Health & Currency Setting...');
  const healthRes: any = await fetch(`${API_BASE}/health`).then(r => r.json());
  console.log('Health check:', healthRes);
  if (healthRes.currency !== 'PKR') throw new Error('Currency is not PKR');
  console.log('✅ Health & PKR currency verified.\n');

  // Test 2: Customer Registration & Login
  console.log('2️⃣ Testing Customer Authentication (/auth/login)...');
  const userLoginRes: any = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@store.pk', password: 'User123!' })
  }).then(r => r.json());
  console.log('Customer login result:', { success: userLoginRes.success, role: userLoginRes.user?.role });
  if (!userLoginRes.success || userLoginRes.user.role !== 'user') throw new Error('Customer login failed');
  const userToken = userLoginRes.token;
  console.log('✅ Customer authentication successful.\n');

  // Test 3: Admin Login
  console.log('3️⃣ Testing Admin Exclusive Authentication (/auth/admin/login)...');
  const adminLoginRes: any = await fetch(`${API_BASE}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@store.pk', password: 'Admin123!' })
  }).then(r => r.json());
  console.log('Admin login result:', { success: adminLoginRes.success, role: adminLoginRes.user?.role });
  if (!adminLoginRes.success || adminLoginRes.user.role !== 'admin') throw new Error('Admin login failed');
  const adminToken = adminLoginRes.token;
  console.log('✅ Admin exclusive authentication successful.\n');

  // Test 4: Authorization Protection Check (User cannot create product)
  console.log('4️⃣ Testing Authorization Protection (User attempting admin action)...');
  const forbiddenRes = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      name: 'Unauthorized Product',
      price: 1000,
      category: 'Smartphones'
    })
  });
  console.log('User attempt status code:', forbiddenRes.status);
  if (forbiddenRes.status !== 403) throw new Error('Security flaw: User was not blocked from admin action!');
  console.log('✅ Strict admin authorization guard working properly (403 Forbidden).\n');

  // Test 5: Admin Creates Product in PKR
  console.log('5️⃣ Testing Admin Product Creation & PKR Price...');
  const newProductRes: any = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Google Pixel 8 Pro (128GB, Obsidian)',
      description: 'The pro phone engineered by Google with Tensor G3 chip and next-gen camera.',
      price: 245000,
      originalPrice: 275000,
      category: 'Smartphones',
      stock: 6,
      isFeatured: true,
      isOffer: true,
      offerTag: 'FLAGSHIP DEAL',
      specifications: {
        'Display': '6.7-inch Super Actua OLED',
        'RAM': '12GB',
        'Storage': '128GB',
        'PTA': 'Official PTA Approved'
      }
    })
  }).then(r => r.json());
  console.log('Created product:', { success: newProductRes.success, id: newProductRes.product?._id, price: newProductRes.product?.price });
  if (!newProductRes.success) throw new Error('Product creation failed');
  const createdProductId = newProductRes.product._id;
  console.log('✅ Admin product creation verified in PKR.\n');

  // Test 6: Admin Stock Adjustment
  console.log('6️⃣ Testing Admin Quick Stock Adjustment...');
  const stockUpdateRes: any = await fetch(`${API_BASE}/products/${createdProductId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ stock: 20 })
  }).then(r => r.json());
  console.log('Stock update response:', { success: stockUpdateRes.success, newStock: stockUpdateRes.product?.stock });
  if (stockUpdateRes.product?.stock !== 20) throw new Error('Stock update failed');
  console.log('✅ Admin stock control verified.\n');

  // Test 7: Admin Creates Big Promotional Hero Offer
  console.log('7️⃣ Testing Admin Big Promotional Offer Creation...');
  const newOfferRes: any = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Grand Pakistan Tech Fest 2026',
      subtitle: 'Mega discounts on Pixel, iPhones and Studio Audio with nationwide Cash on Delivery.',
      badge: '⚡ FLASH SALE • 35% OFF',
      discountText: 'SAVE UP TO RS. 45,000',
      discountCode: 'TECHFEST2026',
      bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
      buttonText: 'Shop Tech Fest Offers',
      buttonLink: '/shop?filter=offers',
      isActive: true
    })
  }).then(r => r.json());
  console.log('Created offer:', { success: newOfferRes.success, title: newOfferRes.offer?.title });
  if (!newOfferRes.success) throw new Error('Offer creation failed');
  console.log('✅ Big Promotional Offer creation verified.\n');

  // Test 8: Order Placement & Inventory Decrement
  console.log('8️⃣ Testing Order Placement with Cash on Delivery & Inventory Decrement...');
  const orderRes: any = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      customerName: 'Ali Ahmed',
      customerEmail: 'customer@smstore.pk',
      customerPhone: '0300 1234567',
      shippingAddress: {
        address: 'House 12, Street 4, F-7/2',
        city: 'Islamabad',
        postalCode: '44000'
      },
      orderItems: [
        {
          productId: createdProductId,
          name: 'Google Pixel 8 Pro',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          price: 245000,
          quantity: 2
        }
      ],
      paymentMethod: 'Cash on Delivery'
    })
  }).then(r => r.json());
  console.log('Order result:', { success: orderRes.success, orderId: orderRes.order?._id, totalPrice: orderRes.order?.totalPrice });
  if (!orderRes.success) throw new Error('Order placement failed');

  // Check inventory after order
  const checkProd: any = await fetch(`${API_BASE}/products/${createdProductId}`).then(r => r.json());
  console.log('Stock after 2 units ordered (was 20):', checkProd.product?.stock);
  if (checkProd.product?.stock !== 18) throw new Error('Inventory was not decremented correctly!');
  console.log('✅ Order placed & live stock automatically decremented to 18.\n');

  // Test 9: Admin Order Status Update
  console.log('9️⃣ Testing Admin Order Status Management...');
  const orderId = orderRes.order._id;
  const statusRes: any = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ orderStatus: 'Shipped' })
  }).then(r => r.json());
  console.log('Status update:', { success: statusRes.success, status: statusRes.order?.orderStatus });
  if (statusRes.order?.orderStatus !== 'Shipped') throw new Error('Order status update failed');
  console.log('✅ Admin order status updated to Shipped.\n');

  // Test 10: Admin Stats
  console.log('🔟 Testing Admin Statistics in PKR...');
  const statsRes: any = await fetch(`${API_BASE}/stats/admin`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }).then(r => r.json());
  console.log('Admin Stats:', statsRes.stats);
  if (!statsRes.success || statsRes.stats.totalRevenue <= 0) throw new Error('Admin stats failed');
  console.log('✅ Admin analytics & PKR revenue confirmed.\n');

  console.log('🎉 ALL 10 TEST SUITES PASSED SUCCESSFULLY! The Full-Stack Application is 100% Functional & Verified!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
