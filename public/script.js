let boardData = { todo: [], 'in-progress': [], done: [] };

function initDragAndEdit() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
      e.target.classList.add('dragging');
    });
  });
}

document.querySelectorAll('.column').forEach(column => {
  column.addEventListener('dragover', e => {
    e.preventDefault();
    column.classList.add('drag-over');
  });
  column.addEventListener('dragleave', () => column.classList.remove('drag-over'));
  column.addEventListener('drop', e => {
    e.preventDefault();
    column.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const card = document.querySelector(`[data-id='${id}']`);
    column.appendChild(card);
    updateBoardData();
    saveBoard();
  });
});

function addCard(status) {
  const column = document.querySelector(`.column[data-status='${status}']`);
  const id = 'card-' + Date.now();
  const newCard = document.createElement('div');
  newCard.className = 'card';
  newCard.draggable = true;
  newCard.contentEditable = true;
  newCard.dataset.id = id;
  newCard.textContent = '新しいタスク';
  column.appendChild(newCard);
  updateBoardData();
  saveBoard();
  initDragAndEdit();
}

function updateBoardData() {
  boardData = { todo: [], 'in-progress': [], done: [] };
  document.querySelectorAll('.column').forEach(column => {
    const status = column.dataset.status;
    column.querySelectorAll('.card').forEach(card => {
      boardData[status].push(card.textContent);
    });
  });
}

function saveBoard() {
  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boardData)
  });
}

function loadBoard() {
  fetch('/load')
    .then(res => res.json())
    .then(data => {
      boardData = data;
      for (const status in boardData) {
        const column = document.querySelector(`.column[data-status='${status}']`);
        column.querySelectorAll('.card').forEach(c => c.remove());
        boardData[status].forEach(text => {
          const id = 'card-' + Date.now() + Math.random();
          const card = document.createElement('div');
          card.className = 'card';
          card.draggable = true;
          card.contentEditable = true;
          card.dataset.id = id;
          card.textContent = text;
          column.appendChild(card);
        });
      }
      initDragAndEdit();
    });
}

window.onload = () => {
  loadBoard();
  initDragAndEdit();
};
