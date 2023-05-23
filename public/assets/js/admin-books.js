const fetchTopsBtn = document.querySelector('.btn-fetch-tops');
const topsTable = document.querySelector('.table-tops');


const fetchTops = () => {
  console.log('Fetching Tops');

  if (!topsTable) return;

  const categoryRows = topsTable.querySelectorAll('tr.category-row');

  const categoryIds = [];
  categoryRows.forEach(row => categoryIds.push(row.dataset.id));

  try {
    categoryIds.forEach(async id => {
      const categoryRow = topsTable.querySelector(`tr.category-row[data-id='${id}']`);


      const res = await axios({
        method: 'GET',
        url: `/api/categories?id=${id}`,
      });

      if (res.status !== 200 || res.data === undefined) return;

      const { tops, score } = res.data;
      tops.forEach(top => {
        const position = top.position;
        const topRanking = top.topRanking;

        const categoryCell = categoryRow.querySelector(`.td-top-${position}`);
        categoryCell.innerText = topRanking || 'n/a';


      })

      const scoreCell = categoryRow.querySelector(`.td-score`);
      scoreCell.innerText = score;
    });

  } catch (err) {
    if (err.response) {
      console.error(err.response.data.message);
    } else {
      console.error(err.message);
    }
  }
}

fetchTopsBtn.addEventListener('click', async () => {
  fetchTops();
});

fetchTops();


