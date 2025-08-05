// เก็บข้อมูลสินค้าไว้ใน localStorage
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let found = cart.find(item => item.name === name);
  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`เพิ่ม "${name}" ลงในตะกร้าเรียบร้อยแล้ว!`);
}

// แสดงสินค้าในตะกร้า (สำหรับ cart.html)
function displayCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cart-items');
  const totalContainer = document.getElementById('cart-total');
  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>ไม่มีสินค้าในตะกร้า</p>';
    totalContainer.innerText = '';
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <p><strong>${item.name}</strong> - ${item.price} บาท x ${item.quantity} = ${itemTotal} บาท</p>
      <button onclick="removeFromCart(${index})">ลบ</button>
    `;
    cartContainer.appendChild(div);
  });

  totalContainer.innerHTML = `<h3>รวมทั้งหมด: ${total} บาท</h3>`;
}

// ลบสินค้าออกจากตะกร้า
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

// เคลียร์ตะกร้า
function clearCart() {
  localStorage.removeItem('cart');
  displayCart();
}

// ฟังก์ชันส่งคำสั่งซื้อไป Google Sheets
function submitOrder() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('ไม่มีสินค้าในตะกร้า กรุณาเพิ่มสินค้าก่อนสั่งซื้อ');
    return;
  }

  // รับค่าจากฟอร์ม (สมมติมี input id="name", "email", "phone" อยู่ในหน้าเว็บ)
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !email || !phone) {
    alert('กรุณากรอกข้อมูลผู้สั่งให้ครบถ้วน');
    return;
  }

  // เตรียมข้อมูลสำหรับส่ง (แปลงตะกร้าเป็นข้อความ)
  const products = cart.map(item => `${item.name} x${item.quantity}`).join(', ');

  // สร้างอ็อบเจ็กต์ข้อมูล
  const data = {
    name: name,
    email: email,
    phone: phone,
    products: products
  };

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxBQZg34HURqVJaTL5mmzv5HUgLv2K_zmsQVx7UWAHydcCOMzsPXT3z6Q6wKefZt8zw/exec';

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(response => {
    if(response.result === 'success'){
      alert('ส่งคำสั่งซื้อสำเร็จ ขอบคุณครับ!');
      localStorage.removeItem('cart'); // เคลียร์ตะกร้าหลังส่ง
      displayCart(); // รีเฟรชตะกร้า
      // ล้างฟอร์มข้อมูลลูกค้า (ถ้ามี)
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phone').value = '';
    } else {
      alert('เกิดข้อผิดพลาด: ' + response.message);
    }
  })
  .catch(error => {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  });
}
