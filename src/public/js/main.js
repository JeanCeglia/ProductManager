const socketClient = io();

socketClient.on("enviodeproducts", (obj) => {
  updateProductList(obj);
});

function updateProductList(productList) {
  const productsDiv = document.getElementById("list-products");

  let productosHTML = "";

  productList.forEach((product) => {
    productosHTML += `<div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
        <div class="card-header bg-primary text-white">code: ${product.code}</div>
        <div class="card-body">
            <h4 class="card-title text-white">${product.name}</h4>
            <p class="card-text">
            <ul class="card-text">
            <li>description: ${product.description}</li>
            thumbnail: <img src="${product.thumbnail}" alt="img" class="img-thumbnail img-fluid">        </ul>
            <li>stock: ${product.stock}</li>
            <li>price: $${product.price}</li>
            <li>id: ${product.id}</li>
            </p>
        </div>
        <div class="d-flex justify-content-center mb-4">
        <button type="button" class="btn btn-danger delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
        </div>
        
    </div>
</div>`;
  });

  productsDiv.innerHTML = productosHTML;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let name = form.elements.name.value;
  let description = form.elements.description.value;
  let code = form.elements.code.value;
  let thumbnail = form.elements.thumbnail.value;
  let stock = form.elements.stock.value;
  let price = form.elements.price.value;

  socketClient.emit("addProduct", {
    name,
    description,
    code,
    thumbnail,
    stock,
    price,
  });

  form.reset();
});

//para eliminar por ID
document.getElementById("delete-btn").addEventListener("click", function () {
  const deleteidinput = document.getElementById("id-prod");
  const deleteid = parseInt(deleteidinput.value);
  socketClient.emit("deleteProduct", deleteid);
  deleteidinput.value = "";
});

//para eliminar el producto directamente
function deleteProduct(productId) {
  socketClient.emit("deleteProduct", productId);
}
