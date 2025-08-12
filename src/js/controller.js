import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODEL_CLOSE_SECOND } from './config.js';

///////////////////////////////////////

const showRecipe = async function () {
  try {
    //1,fetch id
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultView.update(model.showRecipePage());
    bookmarkView.update(model.state.bookmarks);

    //2,loading recipe
    await model.loadRecipe(id);

    //2,display recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const searchRecipe = async function () {
  try {
    //1,get query
    const query = searchView.getQuery();
    model.state.search.query = query;

    resultView.renderSpinner();

    //2,load reacipes
    await model.loadSearchRecipe(query);

    //3,render recipes
    resultView.render(model.showRecipePage());

    //4,render buttton
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const changeRecipe = function (goToPage) {
  //1,new recipes
  //2,render recipes
  resultView.render(model.showRecipePage(goToPage));

  //3,render buttton
  paginationView.render(model.state.search);
};

const updateServings = function (newServings) {
  //1,update Model data
  model.changeServings(newServings);

  //show new data
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const changeBookMark = function () {
  //1,chose add/remove
  if (!model.state.recipe.isBook) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);

  //2,update Items
  recipeView.update(model.state.recipe);

  //3,render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const loadBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const addNewRecipe = async function (newRecipe) {
  try {
    //1,add spinner
    addRecipeView.renderSpinner();

    //2,load new recipe
    await model.loadNewRecipe(newRecipe);
    console.log(model.state.recipe);

    //3,render new recipe
    recipeView.render(model.state.recipe);

    //4,success info
    addRecipeView.renderMessage();

    //5,render bookmark
    bookmarkView.render(model.state.bookmarks);

    // 6,change url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //7,close form window
    setTimeout(function () {
      addRecipeView.toggleFrom();
    }, MODEL_CLOSE_SECOND * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError();
  }
};

const init = function () {
  bookmarkView.addHandlerInitBookmarks(loadBookmarks);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdate(updateServings);
  recipeView.addHandlerBookMark(changeBookMark);
  searchView.addHandlerSearch(searchRecipe);
  paginationView.addHandlerClick(changeRecipe);
  addRecipeView.addHandlerNewRecipe(addNewRecipe);
};
init();
