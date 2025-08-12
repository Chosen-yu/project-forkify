import icons from 'url:../../img/icons.svg';
import Views from './View';

class PaginationView extends Views {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //1,find buttton
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      //2,get goToPage
      const goToPage = Number(btn.dataset.goto);
      //3,pass numto handler
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const maxPage = Math.ceil(this._data.result.length / this._data.per_page);

    //1,first page and not the last one
    if (curPage === 1 && curPage < maxPage) {
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    //2,last page and page>1
    if (curPage === maxPage && maxPage > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    //3,middle page
    if (curPage < maxPage) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    //4,one page
    return '';
  }
}
export default new PaginationView();
