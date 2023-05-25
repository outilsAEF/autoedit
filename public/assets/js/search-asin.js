const searchAsinForm = document.querySelector('.search-asin-form');
const searchAsinBtn = document.querySelector('.search-asin-btn');
const searchAsinInput = document.querySelector('input#asin');
const spanSearchAsinBtnText = document.querySelector('.search-asin-btn-text')
const spanSearchAsinBtnTextLoading = document.querySelector('.search-asin-btn-text-loading')



searchAsinForm.addEventListener('submit', () => {
  console.log('submitting form');
  searchAsinForm.submit();
  spanSearchAsinBtnText.classList.add('d-none');
  spanSearchAsinBtnTextLoading.classList.remove('d-none');
  searchAsinBtn.disabled = true;
  searchAsinInput.readOnly = true;
})
