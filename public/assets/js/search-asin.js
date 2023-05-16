const searchAsinForm = document.querySelector('.search-asin-form');
const searchAsinBtn = document.querySelector('.search-asin-btn');
const spanSearchAsinBtnText = document.querySelector('.search-asin-btn-text')
const spanSearchAsinBtnTextLoading = document.querySelector('.search-asin-btn-text-loading')



searchAsinForm.addEventListener('submit', (e) => {
  console.log('submitting form');
  spanSearchAsinBtnText.classList.add('d-none');
  spanSearchAsinBtnTextLoading.classList.remove('d-none');
})
