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
