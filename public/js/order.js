"use stric";
const orderOptions = {
  0: "default",
  1: "name",
  2: "price",
  3: "year",
};

const orderSelected = document.getElementById("orderSelected");

orderSelected.addEventListener("change", async (e) => {
  const selected = e.target.value;
  console.log(selected);
  try {
    const response = await fetch(`?orderBy=${orderOptions[selected]}`);
    const data = await response.json();
    const container = document.createElement("div");
    container.id = "inv-display";
    container.innerHTML = data;
    //replacing the current inventory display with the new one
    document.getElementById("inv-display").replaceWith(container);
  } catch (error) {
    console.log("error in orderSelected event listener");
    console.log(error);
  }
});
