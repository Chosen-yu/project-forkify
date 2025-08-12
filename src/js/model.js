import { async } from 'regenerator-runtime';
import { API_URL, KEY, PAGE, PER_PAGE, START_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: START_PAGE,
    per_page: PER_PAGE,
  },
  bookmarks: [],
};

const creatdataObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = creatdataObject(data);
    console.log(state.recipe);

    if (state.bookmarks.some(book => book.id === id))
      state.recipe.isBook = true;
    else state.recipe.isBook = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchRecipe = async function (query) {
  try {
    //1,get JSON
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    //store data
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = START_PAGE;
  } catch (err) {
    throw err;
  }
};

export const showRecipePage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.per_page;
  const end = page * state.search.per_page;

  return state.search.result.slice(start, end);
};

export const changeServings = function (newServings) {
  state.recipe.ingredients.forEach(rec => {
    rec.quantity = (rec.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookMark = function (recipe) {
  //1,memory recipe
  state.bookmarks.push(recipe);

  //2,change the state
  state.recipe.isBook = true;

  //3,local store
  storeLocal();
};

export const removeBookMark = function (id) {
  //1,remove recipe
  const index = state.bookmarks.findIndex(book => book.id === id);
  state.bookmarks.splice(index, 1);

  //2,change the state
  state.recipe.isBook = false;

  //3,local store
  storeLocal();
};

const storeLocal = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const data = localStorage.getItem('bookmarks');
  if (data) state.bookmarks = JSON.parse(data);
};
init();

// const clearStorage=function(){
//   localStorage.removeItem("bookmarks");
// }

export const loadNewRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => {
        if (ing[0].includes('ingredient') && ing[1]) return ing;
      })
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Please input correct format');

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = creatdataObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    console.error(err);
  }
};
