let orders = {};
let total = 0;
let stepLocks = {
  bread: null,
  menu: null,
};

function toggleOptions(id) {
  const section = document.getElementById(id);
  section.classList.toggle('hidden');
}

function handleSelect(step, name, price) {
  const key = `${step}:${name}`;
  const isLocked = stepLocks[step] && stepLocks[step] !== name;
  const button = document.querySelector(`.btn-${step}[data-name="${name}"]`);
  const isSelected = !!orders[key];

  if (!isSelected) {
    // Add to order
    orders[key] = { qty: 1, price: price };
    if (step === "bread" || step === "menu") stepLocks[step] = name;

    button.textContent = "Remove";
    button.classList.remove("select-btn");
    button.classList.add("remove-btn");
  } else {
    // Remove from order
    delete orders[key];
    if (stepLocks[step] === name) stepLocks[step] = null;

    button.textContent = "Select";
    button.classList.remove("remove-btn");
    button.classList.add("select-btn");
  }

  updateButtons(step);
  updateOrderList();
}


function updateButtons(step) {
  const buttons = document.querySelectorAll(`.btn-${step}`);
  const locked = stepLocks[step];

  buttons.forEach((btn) => {
    const name = btn.dataset.name;
    const key = `${step}:${name}`;
    const isSelected = !!orders[key];

    if (isSelected) {
      btn.textContent = "Remove";
      btn.classList.add("selected-btn");
      btn.classList.remove("removed-btn");
      btn.disabled = false;
    } else {
      btn.textContent = "Select";
      btn.classList.remove("selected-btn");
      btn.classList.remove("removed-btn");

      if (locked && locked !== name) {
        btn.classList.add("disabled-btn");
         btn.setAttribute("data-disabled", "true");
      } else {
        btn.classList.remove("disabled-btn");
        btn.removeAttribute("data-disabled");
      }
    }

    // Update quantity display
    const qtyEl = document.getElementById(`qty-${name}`);
    if (qtyEl) {
      qtyEl.textContent = orders[key] ? orders[key].qty : 0;
    }
  });
}

function toggleCheckbox(name, price, checked) {
  const key = `veggie:${name}`;
  if (checked) {
    orders[key] = { qty: 1, price: price };
  } else {
    delete orders[key];
  }
  updateOrderList();
}

// When the user want to tick more than 4 sauce
function toggleSauce(name, price, checkbox) {
  const selectedSauces = document.querySelectorAll('.sauce-checkbox:checked');
  if (selectedSauces.length > 4) {
    alert("You can only select up to 4 sauces.");
    checkbox.checked = false;
    return;
  }

  const key = `sauce:${name}`;
  if (checkbox.checked) {
    orders[key] = { qty: 1, price: price };
  } else {
    delete orders[key];
  }

  updateOrderList();
}

function updateOrderList() {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";
  total = 0;

  for (const [key, data] of Object.entries(orders)) {
  let displayName = key.includes(":") ? key.split(":")[1] : key;
  let step = key.includes(":") ? key.split(":")[0] : "";

  // Capitalize first letter of name
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  const li = document.createElement("li");

  // Show only quantity for bread
  if (step === "bread") {
    li.textContent = `${displayName} × ${data.qty}`;
  } else {
    li.textContent = `${displayName} × ${data.qty} = RM${(data.qty * data.price).toFixed(2)}`;
  }

  orderList.appendChild(li);
  total += step === "bread" ? 0 : data.qty * data.price;
}


  document.getElementById("totalPrice").textContent = total.toFixed(2);
}

//display message to select item without being null and send send status order confirmation
function confirmOrder() {
  if (Object.keys(orders).length === 0) {
    alert("Please select some items before confirming.");
  } else {
    alert("Your order has been confirmed!");
  }
}

// When user click on disable button after been select one item
document.addEventListener("click", function (e) {
  const target = e.target;

  if (
    target.tagName === "BUTTON" &&
    target.classList.contains("disabled-btn") &&
    target.getAttribute("data-disabled") === "true"
  ) {
    e.preventDefault();
    alert("You can only select one item.");
  }
});




