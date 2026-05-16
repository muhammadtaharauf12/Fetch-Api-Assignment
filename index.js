const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// 1. Function: Data ko table mein .forEach ke zariye dikhane ke liye
function displayTable(recipes) {
    tableBody.innerHTML = ""; // Pehle waala data saaf karein
    
    if (!recipes || recipes.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #718096;">No recipes found. Try searching 'pizza', 'burger', or 'pasta'.</td></tr>`;
        return;
    }

    // Sirf .forEach loop ka istemal
    recipes.forEach(recipe => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${recipe.id}</td>
            <td><strong>${recipe.title}</strong></td>
            <td><img src="${recipe.image_url}" alt="${recipe.title}" style="width: 100px; height: 100px; border-radius: 4px; object-fit: cover;"></td>
            <td>${recipe.publisher}</td>
            
        `;
        tableBody.appendChild(row);
    });
}

// 2. Function: API se data fetch karne ke liye (Dynamic Search ke saath)
function fetchRecipes(query) {
    tableBody.innerHTML = `<tr><td colspan="5" class="loading">Searching for "${query}"...</td></tr>`;

    // Fetch ke andar direct API URL aur dynamic query variable
    fetch(`https://forkify-api.jonas.io/api/v2/recipes?search=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(apiData => {
            // Forkify API ka data 'data.recipes' ke andar hota hai
            const recipesList = apiData.data.recipes;
            displayTable(recipesList);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            tableBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">Failed to load data. Make sure search term is correct.</td></tr>`;
        });
}

// 3. Event Listener: Jab user Search Button par click kare
searchBtn.addEventListener("click", () => {
    const userSearch = searchInput.value.trim();
    if (userSearch !== "") {
        fetchRecipes(userSearch); // User ke word ke saath API call hogi
    }
});

// Pro-Tip: Enter dabane par bhi search chalayen
searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const userSearch = searchInput.value.trim();
        if (userSearch !== "") {
            fetchRecipes(userSearch);
        }
    }
});

// Pehli baar page load hone par default 'pizza' ka data dikhane ke liye
fetchRecipes("pizza");