const searchPage = document.getElementById("searchPage");
const mainContainer = document.getElementById("mainContainer");

function toggleSideBar() {
  $("aside .left").animate({ width: "toggle" }, 400);
  $("aside .right button i").toggleClass("fa-xmark");
  $("aside").toggleClass("open");
}

function toggleSpinner() {
  $(".spinner").toggleClass("loading");
}

function showError(err) {
  const p = `<p class='text-danger text-center w-100 fw-semibold'>${err}</p>`;
  mainContainer.innerHTML = p;
}

$("aside .right button").on("click", () => {
  toggleSideBar();
});

async function fetchData(searchType, searchValue) {
  try {
    toggleSpinner();
    switch (searchType) {
      case "name":
        if (!searchValue) return;
        const nameRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
        if (!nameRes.ok) throw new Error("Couldn't fetch the meals :(");
        const nameData = await nameRes.json();
        if (!nameData.meals) {
          display("clear");
          return;
        }
        display("meals", nameData.meals.slice(0, 20));
        break;
      case "firstLetter":
        if (!searchValue || !/\w+/gi.test(searchValue)) return;
        const FLRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchValue}`);
        if (!FLRes.ok) throw new Error("Couldn't fetch the meals :(");
        const FLData = await FLRes.json();
        if (!FLData.meals) {
          display("clear");
          return;
        }
        display("meals", FLData.meals.slice(0, 20));
        break;
      case "id":
        if (!searchValue) return;
        const IDRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${searchValue}`);
        if (!IDRes.ok) throw new Error("Couldn't fetch the meal :(");
        const IDData = await IDRes.json();
        display("meal", IDData.meals);
        break;
      case "areas":
        const areasRes = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        if (!areasRes.ok) throw new Error("Couldn't fetch the Areas :(");
        const areasData = await areasRes.json();
        display("areas", areasData.meals);
        break;
      case "area":
        if (!searchValue) return;
        const areaRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchValue}`);
        if (!areaRes.ok) throw new Error("Couldn't fetch the meals :(");
        const areaData = await areaRes.json();
        display("meals", areaData.meals.slice(0, 20));
        break;
      case "categories":
        const categoriesRes = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        if (!categoriesRes.ok) throw new Error("Couldn't fetch the categories :(");
        const categoriesData = await categoriesRes.json();
        display("categories", categoriesData.categories);
        break;
      case "category":
        if (!searchValue) return;
        const categoryRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchValue}`);
        if (!categoryRes.ok) throw new Error("Couldn't fetch the meals :(");
        const categoryData = await categoryRes.json();
        display("meals", categoryData.meals.slice(0, 20));
        break;
      case "ingredients":
        const ingredientsRes = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
        if (!ingredientsRes.ok) throw new Error("Couldn't fetch the ingredients :(");
        const ingredientsData = await ingredientsRes.json();
        display("ingredients", ingredientsData.meals.slice(0, 25));
        break;
      case "ingredient":
        if (!searchValue) return;
        const ingredientRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchValue}`);
        if (!ingredientRes.ok) throw new Error("Couldn't fetch the meals :(");
        const ingredientData = await ingredientRes.json();
        display("meals", ingredientData.meals.slice(0, 20));
        break;
      case null:
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        if (!res.ok) throw new Error("Couldn't fetch the meals :(");
        const data = await res.json();
        display("meals", data.meals.slice(0, 20));
        break;
      default:
        throw new Error("Please provide something to search for.");
    }
  } catch (err) {
    showError(err);
  } finally {
    toggleSpinner();
  }
}
fetchData(null, "");

function display(type, data) {
  switch (type) {
    case "search":
      searchPage.innerHTML = `
      <form id="searchForm" class="mb-5">
      <div class="row">
        <div class="col">
          <div>
            <input
              placeholder="Search by name"
              aria-label="Search by name"
              oninput="fetchData('name', event.target.value)"
              class="form-control bg-black text-light"
            />
          </div>
        </div>
        <div class="col">
          <div>
            <input
              placeholder="Search by first letter"
              aria-label="Search by first letter"
              oninput="fetchData('firstLetter', event.target.value)"
              class="form-control bg-black text-light"
              maxlength="1"
            />
          </div>
        </div>
      </div>
    </form>
    `;
      break;
    case "categories":
      let categoriesContainer = "";
      data.forEach((el) => {
        const box = `<div class="col">
        <a href="#" onclick="fetchData('category', '${el.strCategory}')" class="category" >
          <img src="${el.strCategoryThumb}" alt="${el.strCategory}" class="w-100 rounded-3"/>
          <div class="text">
              <h4>${el.strCategory}</h4>
              <p>${
                el.strCategoryDescription.length > 100
                  ? `${el.strCategoryDescription.slice(0, 120)}...`
                  : el.strCategoryDescription
              }</p>
          </div>
        </a>
      </div>`;
        categoriesContainer += box;
      });
      mainContainer.innerHTML = categoriesContainer;
      mainContainer.classList = "row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4";
      break;
    case "areas":
      let areasContainer = "";
      data.forEach((el) => {
        const box = `<div class="col">
          <a href="#" onclick="fetchData('area', '${el.strArea}')" class="area" >
            <i class="fa-solid fa-flag fs-1"></i>
            <h3>${el.strArea}</h3>
          </a>
        </div>`;
        areasContainer += box;
      });
      mainContainer.innerHTML = areasContainer;
      mainContainer.classList = "row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-4";
      break;
    case "ingredients":
      let ingredientsContainer = "";
      data.forEach((el) => {
        const box = `<div class="col">
          <a href="#" onclick="fetchData('ingredient', '${el.strIngredient}')" class="ingredient" >
            <i class="fa-solid fa-pepper-hot"></i>
            <div class="text">
              <h3>${el.strIngredient}</h3>
              <p>${
                el.strDescription?.length > 200
                  ? `${el.strDescription.slice(0, 100)}...`
                  : el.strDescription || "No description"
              }</p>
            </div>
          </a>
        </div>`;
        ingredientsContainer += box;
      });
      mainContainer.innerHTML = ingredientsContainer;
      mainContainer.classList = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4";
      break;
    case "contact":
      mainContainer.innerHTML = `
      <form id="contact" class="d-flex flex-column justify-content-center">
      <div class="row row-cols-1 row-cols-md-2 g-4">
        <div class="col">
          <div>
            <input
              name="name"
              placeholder="Enter your name"
              aria-label="Enter your name"
              class="form-control"
              maxlength="40"
            />
            <p class="invalid-feedback">Your name should only contain letters and at least 3 characters long</p>
          </div>
        </div>
        <div class="col">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              aria-label="Enter your email"
              class="form-control"
            />
            <p class="invalid-feedback">
              Invalid Email, please make sure your email follows this syntax: user@example.com
            </p>
          </div>
        </div>
        <div class="col">
          <div>
            <input
              type="number"
              name="phone"
              placeholder="Enter your phone"
              aria-label="Enter your phone"
              class="form-control"
              maxlength="20"
            />
            <p class="invalid-feedback">
              Your phone number should only contain numbers, and must be at least 8 characters long
            </p>
          </div>
        </div>
        <div class="col">
          <div>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              aria-label="Enter your age"
              class="form-control"
              maxlength="3"
            />
            <p class="invalid-feedback">Your age should only contain numbers from 12 ~ 100</p>
          </div>
        </div>
        <div class="col">
          <div class="position-relative">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              aria-label="Enter your password"
              class="form-control"
              maxlength="40"
            />
            <p class="invalid-feedback">
              Your password must be at least 8 characters long, containing at least 1 uppercase letter, 1
              lowercase letter and 1 number
            </p>
            <span class="toggle-password"><i class="fa-solid fa-eye-slash" onclick="togglePassword()"></i></span>
          </div>
        </div>
        <div class="col">
          <div>
            <input
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm your password"
              aria-label="Confirm your password"
              class="form-control"
              maxlength="40"
            />
            <p class="invalid-feedback">Password doesn't match</p>
          </div>
        </div>
      </div>
      <button class="btn btn-outline-danger mt-5 mx-auto" disabled>Submit</button>
    </form>
      `;
      mainContainer.classList = "min-vh-100 d-flex align-items-md-center";
      break;
    case "meals":
      let mealsContainer = "";
      data.forEach((el) => {
        const box = `<div class="col">
          <a href="#" onclick="fetchData('id', ${el.idMeal})" >
            <img src="${el.strMealThumb}" alt="${el.strMeal}" class="w-100 rounded-3"/>
            <h3>${el.strMeal}</h3>
          </a>
        </div>`;
        mealsContainer += box;
      });
      mainContainer.innerHTML = mealsContainer;
      mainContainer.classList = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4";
      break;
    case "meal":
      let mealContainer = "";
      if (!data) {
        showError("Couldn't find this meal :(");
      } else {
        data.forEach((el) => {
          const box = `
          <div class="col-12 col-lg-4">
            <div>
              <img src="${el.strMealThumb}" alt="${el.strMeal}" class="w-100 rounded-3"/>
              <h3 class="fs-1 text-center mt-3">${el.strMeal}</h3>
            </div>
          </div>
          <div class="col-12 col-lg-8">
            <div class="d-flex flex-column gap-2">
              <h4>Instructions: </h4>
              <p>${el.strInstructions}</p>
              <ul class="d-flex flex-column gap-2">
                <li><span class="fw-semibold fs-5">Area: </span>${el.strArea}</li>
                <li><span class="fw-semibold fs-5">Category: </span>${el.strCategory}</li>
                <li class="d-flex flex-column gap-1"><span class="fw-semibold fs-5">Ingredients: </span>
                  <ul class="d-flex flex-wrap gap-2">
                  ${Object.keys(el).reduce((acc, curr, i) => {
                    if (el[`strIngredient${i}`]) {
                      acc += `<li class="bg-primary-subtle text-dark py-1 px-2 rounded-2">${el[`strMeasure${i}`]} ${
                        el[`strIngredient${i}`]
                      }</li>`;
                    }
                    return acc;
                  }, "")}
                  </ul>
                </li>
                <li class="d-flex flex-column gap-1 mb-3"><span class="fw-semibold fs-5">Tags: </span>
                  <ul class="d-flex flex-wrap gap-2">
                    ${
                      el.strTags
                        ? Array.isArray(el.strTags.split(", "))
                          ? el.strTags
                              .split(",")
                              .reduce(
                                (acc, curr) =>
                                  (acc += `<li class="bg-dark-subtle text-dark py-1 px-2 rounded-2">${curr}</li>`),
                                ""
                              )
                          : `<li class="bg-dark-subtle text-dark py-1 px-2 rounded-2">${el.strTags}</li>`
                        : "<p class='fst-italic'>No tags</p>"
                    }
                  </ul>
                </li>
                <li class="d-flex">
                  <ul class="d-flex flex-wrap gap-2">
                  ${
                    el.strSource
                      ? `<li><a href="${el.strSource}" class="btn btn-primary" target="_blank">Source</a></li>`
                      : ""
                  }
                  ${
                    el.strYoutube
                      ? `<li><a href="${el.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a></li>`
                      : ""
                  } 
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          `;
          mealContainer += box;
        });
      }
      mainContainer.innerHTML = mealContainer;
      mainContainer.classList = "row g-4";
      break;
    case "clear":
      mainContainer.innerHTML = "";
      mainContainer.classList = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4";
      break;
    default:
      break;
  }
}

function navigate(to) {
  switch (to) {
    case "home":
      searchPage.innerHTML = "";
      fetchData(null);
      toggleSideBar();
      validationListeners("remove");
      break;
    case "search":
      display("search");
      mainContainer.innerHTML = "";
      toggleSideBar();
      validationListeners("remove");
      break;
    case "categories":
      searchPage.innerHTML = "";
      fetchData("categories");
      toggleSideBar();
      validationListeners("remove");
      break;
    case "areas":
      searchPage.innerHTML = "";
      fetchData("areas");
      toggleSideBar();
      validationListeners("remove");
      break;
    case "ingredients":
      searchPage.innerHTML = "";
      fetchData("ingredients");
      toggleSideBar();
      validationListeners("remove");
      break;
    case "contact":
      searchPage.innerHTML = "";
      display("contact");
      toggleSideBar();
      validationListeners("add");
      break;
    default:
      throw new Error("Cannot find what you're looking for :(");
  }
}

// ************************** VALIDATION ****************************
let validationStatus = {
  name: false,
  email: false,
  phone: false,
  age: false,
  password: false,
  passwordConfirmation: false,
  validateAll: function () {
    return this.name && this.email && this.phone && this.age && this.password && this.passwordConfirmation;
  },
};

function validationListeners(type) {
  function validateHandler(e) {
    if (!validation(e.target.getAttribute("name"), e.target.value)) {
      $(e.target).addClass("is-invalid").removeClass("is-valid");
      areAllValid();
    } else {
      $(e.target).removeClass("is-invalid").addClass("is-valid");
      areAllValid();
    }
  }
  switch (type) {
    case "add":
      document.querySelectorAll("#contact input").forEach((el) => {
        el.addEventListener("input", validateHandler);
      });
      break;
    case "remove":
      document.querySelectorAll("#contact input").forEach((el) => {
        el.removeEventListener("input", validateHandler);
      });
      break;
    default:
      throw new Error("Please specify whether to add or remove validation listeners.");
  }
}

function areAllValid() {
  if (validationStatus.validateAll()) {
    $("#contact button").removeClass("btn-outline-danger").addClass("btn-outline-success").removeAttr("disabled");
  } else {
    $("#contact button").removeClass("btn-outline-success").addClass("btn-outline-danger").attr("disabled", "true");
  }
}

function validation(type, value) {
  switch (type) {
    case "name":
      /^[a-z\sA-Z]{3,40}$/.test(value) ? (validationStatus.name = true) : (validationStatus.name = false);
      return /^[a-z\sA-Z]{3,40}$/.test(value);
    case "email":
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        ? (validationStatus.email = true)
        : (validationStatus.email = false);
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    case "phone":
      /^\+?[0-9]{8,20}$/.test(value) ? (validationStatus.phone = true) : (validationStatus.phone = false);
      return /^\+?[0-9]{8,20}$/.test(value);
    case "age":
      /^(100|1[2-9]|[2-9][0-9])$/.test(value) ? (validationStatus.age = true) : (validationStatus.age = false);
      return /^(100|1[2-9]|[2-9][0-9])$/.test(value);
    case "password":
      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$#\^!%*?&]{8,}$/.test(value) &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$#\^!%*?&]{8,}$/.test(value) ===
          $('#contact input[name="passwordConfirmation"]').val()
      ) {
        validationStatus.password = true;
        validationStatus.passwordConfirmation = true;
        return true;
      } else if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$#\^!%*?&]{8,}$/.test(value) &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$#\^!%*?&]{8,}$/.test(value) !==
          $('#contact input[name="passwordConfirmation"]').val()
      ) {
        validationStatus.password = true;
        validationStatus.passwordConfirmation = false;
        $('#contact input[name="passwordConfirmation"]').addClass("is-invalid");
        $('#contact input[name="passwordConfirmation"]').removeClass("is-valid");
        return true;
      } else {
        validationStatus.password = false;
        validationStatus.passwordConfirmation = false;
        return false;
      }
    case "passwordConfirmation":
      $('#contact input[name="passwordConfirmation"]').val() === $('#contact input[name="password"]').val()
        ? (validationStatus.passwordConfirmation = true)
        : (validationStatus.passwordConfirmation = false);
      return $('#contact input[name="passwordConfirmation"]').val() === $('#contact input[name="password"]').val();
    default:
      throw new Error("Provide something to validate!");
  }
}

function togglePassword() {
  if ($('#contact input[name="password"]').attr("type") === "password") {
    $('#contact input[name="password"]').attr("type", "text");
  } else {
    $('#contact input[name="password"]').attr("type", "password");
  }
  $(".toggle-password i").toggleClass("fa-eye");
}
