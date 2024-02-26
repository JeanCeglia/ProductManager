const socketClient = io();

// Define a function to render product HTML
function renderProduct(product) {
  return `
    <div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
      <div class="card-header bg-primary text-white">code: ${product.code}</div>
      <div class="card-body">
        <h4 class="card-title text-white">${product.name}</h4>
        <p class="card-text">
          <ul class="card-text">
            <li>description: ${product.description}</li>
            <li>stock: ${product.stock}</li>
            <li>price: $${product.price}</li>
            <li>id: ${product.id}</li>
          </ul>
        </p>
      </div>
      <div class="d-flex justify-content-center mb-4">
        <button type="button" class="btn btn-danger delete-btn" data-product-id="${product.id}">Eliminar</button>
      </div>
    </div>
  `;
}

// Update product list function
function updateProductList(productList) {
  const productsDiv = document.getElementById("list-products");
  productsDiv.innerHTML = productList.map(renderProduct).join("");
}

// Handle "enviodeproducts" event
socketClient.on("enviodeproducts", (productList) => {
  updateProductList(productList);
});

// Handle product submission form
const form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newProduct = {
    name: form.elements.name.value,
    description: form.elements.description.value,
    code: form.elements.code.value,
    stock: form.elements.stock.value,
    price: form.elements.price.value,
  };

  socketClient.emit("addProduct", newProduct);
  form.reset();
});

// Handle "delete" button click on individual product card
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const productId = event.target.dataset.productId;
    socketClient.emit("deleteProduct", productId);
  }
});