const fetchKeywordsBtn = document.querySelector('.btn-fetch-keywords');
const keywordsTable = document.querySelector('.table-tops');


const fetchKeywords = () => {
  console.log('Fetching Keywords');

  if (!keywordsTable) return;

  const keywordRows = keywordsTable.querySelectorAll('tr.keyword-row');

  const keywords = [];
  keywordRows.forEach(row => keywords.push(row.dataset.keyword));

  try {
    keywords.forEach(async keyword => {
      const keywordRow = keywordsTable.querySelector(`tr.keyword-row[data-keyword="${keyword}"]`);


      const res = await axios({
        method: 'GET',
        url: `/api/keywords?keyword=${keyword}`,
      });

      if (res.status !== 200 || res.data === undefined) return;

      const { totalResults } = res.data;
      const amazonCell = keywordRow.querySelector(`.td-total-results-amazon`);
      amazonCell.innerText = totalResults || 'n/a';

    });

  } catch (err) {
    if (err.response) {
      console.error(err.response.data.message);
    } else {
      console.error(err.message);
    }
  }
}

fetchKeywordsBtn.addEventListener('click', async () => {
  fetchKeywords();
});

fetchKeywords();


