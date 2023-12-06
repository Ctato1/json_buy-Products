// we need to add user

async function addUser(name) {
  try {
    const userResp = await fetch(`http://localhost:3000/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        products: [],
      }),
    });
    if (!userResp.ok) throw new Error("user not added");
  } catch (error) {
    console.log(error.message);
  }
}
// addUser('genadi')

// we need to delete users

async function deleteUser(userId) {
  try {
    const userResp = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
    });
    if (!userResp.ok) throw new Error("user not deleted");
  } catch (error) {
    console.log(error.message);
  }
}
// deleteUser(4)

// we need to add products

async function addProduct(productName, price, quantity) {
  try {
    const productResp = await fetch(`http://localhost:3000/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        price,
        quantity,
      }),
    });
    if (!productResp.ok) throw new Error("product not added");
  } catch (error) {
    console.log(error.message);
  }
}

// addProduct("tomato", 2, 7);

async function deleteProduct(productId) {
  try {
    const productResp = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: "DELETE",
      }
    );
    if (!productResp.ok) throw new Error("product does not exist");
  } catch (error) {
    console.log(error.message);
  }
}
// deleteProduct(5)

// we need to remove product if quantity is 0

async function removeProduct(productId) {
  try {
    const product = await fetch(`http://localhost:3000/products/${productId}`);
    const prodData = await product.json();
    if (prodData.quantity > 1 && prodData.quantity) {
      const productResp = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: prodData.quantity - 1,
          }),
        }
      );
      if (!productResp.ok) throw new Error("The product does not shrink");
    } else {
      const productResp = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!productResp.ok) throw new Error("product does not exist");
    }
  } catch (error) {
    console.log(error.message);
  }
}
// removeProduct(5);

// user need to buy an item (product) from store

async function buyProduct(userName, productName) {
  try {
    const userResp = await fetch(
      `http://localhost:3000/users/?name=${userName}`
    );
    if (!userResp.ok) throw new Error("user does not exist");
    const userInfo = await userResp.json();
    //
    const productResp = await fetch(
      `http://localhost:3000/products/?productName=${productName}`
    );
    if (!productResp.ok) throw new Error("product does not exist");
    const productInfo = await productResp.json();
    //
    const userProducts = [...userInfo[0].products, productInfo[0]];
    const buyProduct = await fetch(
      `http://localhost:3000/users/${userInfo[0].id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: userProducts,
        }),
      }
    );
    if (!buyProduct.ok) throw new Error("The customer cannot buy");

    if (buyProduct.ok) {
      removeProduct(productInfo[0].id);
    }
  } catch (error) {
    console.log(error.message);
  }
}
// buyProduct("tato", "coffee");

// we need to remove taken product from user basket

async function userProductDelete(userName, productName) {
  try {
    // we need to reach user's name
    const userResp = await fetch(
      `http://localhost:3000/users/?name=${userName}`
    );
    if (!userResp.ok) throw new Error("user can not found");
    // now we need users info
    const userInfo = await userResp.json();
    if (userInfo[0] === undefined) throw new Error("user does not exist");

    // we want to see if that product exist and if exist
    //  we need to filter it from userinfo basket

    const deleteProducts = await fetch(
      `http://localhost:3000/users/${userInfo[0].id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: userInfo[0].products.filter(
            (item) => item.productName !== productName
          ),
        }),
      }
    );
    if (!deleteProducts.ok) throw new Error("user does not exist");
  } catch (error) {
    console.log(error.message);
  }
}
// userProductDelete("tato", "chicken");
