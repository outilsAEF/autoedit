const searchKeywordsForm = document.querySelector('.search-keywords-form');
const searchKeywordsBtn = document.querySelector('.search-keywords-btn');
const searchKeywordsTextArea = document.querySelector('.textarea-keywords');
const spanSearchKeywordsBtnText = document.querySelector('.search-keywords-btn-text')
const spanSearchKeywordsBtnTextLoading = document.querySelector('.search-keywords-btn-text-loading')



searchKeywordsForm.addEventListener('submit', () => {
  console.log('submitting form');
  searchKeywordsForm.submit();
  spanSearchKeywordsBtnText.classList.add('d-none');
  spanSearchKeywordsBtnTextLoading.classList.remove('d-none');
  searchKeywordsBtn.disabled = true;
  searchKeywordsTextArea.readOnly = true;
})
