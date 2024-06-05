const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
let dishValue = document.querySelectorAll(".dishVal");
let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");
let allDish = document.querySelectorAll(".dishs");
// let count = 0;

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        });
}

// get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// register.js
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        let users = localStorage.getItem('users');
        if (users) {
            users = JSON.parse(users);
        } else {
            users = [];
        }

        users.push({ username, password, recipes: [] });

        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful!');
        // window.location.href = 'login.html';
    } else {
        alert('Please fill out all fields.');
    }
});

// scripts.js
document.getElementById('recipeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const recipeName = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    // Validate form values
    if (recipeName && ingredients && instructions) {
        // Create a recipe object
        const recipe = {
            name: recipeName,
            ingredients: ingredients,
            instructions: instructions
        };

        // Get recipes from localStorage
        let recipes = localStorage.getItem('recipes');
        if (recipes) {
            recipes = JSON.parse(recipes);
        } else {
            recipes = [];
        }

        // Add new recipe to recipes array
        recipes.push(recipe);

        // Save updated recipes to localStorage
        localStorage.setItem('recipes', JSON.stringify(recipes));

        // Clear form
        document.getElementById('recipeForm').reset();

        alert('Recipe added successfully!');
    } else {
        alert('Please fill out all fields.');
    }
});
// displayRecipes.js
document.addEventListener('DOMContentLoaded', function () {
    const recipesList = document.getElementById('recipesList');

    // Get recipes from localStorage
    let recipes = localStorage.getItem('recipes');
    if (recipes) {
        recipes = JSON.parse(recipes);
    } else {
        recipes = [];
    }

    // Display recipes
    if (recipes.length > 0) {
        recipes.forEach(function (recipe) {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';

            const recipeName = document.createElement('h2');
            recipeName.textContent = recipe.name;

            const recipeIngredients = document.createElement('p');
            recipeIngredients.textContent = 'Ingredients: ' + recipe.ingredients;

            const recipeInstructions = document.createElement('p');
            recipeInstructions.textContent = 'Instructions: ' + recipe.instructions;

            recipeElement.appendChild(recipeName);
            recipeElement.appendChild(recipeIngredients);
            recipeElement.appendChild(recipeInstructions);

            recipesList.appendChild(recipeElement);
        });
    } else {
        recipesList.textContent = 'No recipes found.';
    }
});


