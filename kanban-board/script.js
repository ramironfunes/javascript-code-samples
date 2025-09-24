
/**
 * Kanban Board (Vanilla JS)
 * Features:
 *  - Columns: To Do / In Progress / Done
 *  - Create / Edit / Delete cards
 *  - Drag & drop between columns + reorder within column
 *  - Priority badges, timestamps
 *  - Search filter highlights matches
 *  - Import/Export JSON
 *  - LocalStorage persistence
 */

// ---------- Utilities ----------
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
const fmt = (ts) => new Date(ts).toLocaleString();

// ---------- State ----------
const lsKey = 'kanban:data:v1';
let state = load() || seed();

function load(){
  try{ return JSON.parse(localStorage.getItem(lsKey)); }catch{ return null; }
}
function save(){
  localStorage.setItem(lsKey, JSON.stringify(state));
}
function seed(){
  return {
    cards: [
      { id: uid(), col: 'todo', title: 'Welcome to Kanban Board', desc: 'Drag cards between columns. Double‑click to edit.', priority:'normal', created: Date.now() },
      { id: uid(), col: 'doing', title: 'Edit dialog', desc: 'Each card has description, priority and created timestamp.', priority:'low', created: Date.now() - 3600_000 },
      { id: uid(), col: 'done', title: 'Export / Import', desc: 'You can export to JSON and import later.', priority:'high', created: Date.now() - 7200_000 }
    ]
  };
}

// ---------- Rendering ----------
function render(){
  const zones = { todo: $('#todo'), doing: $('#doing'), done: $('#done') };
  for(const k in zones) zones[k].innerHTML = '';

  const q = $('#search').value.trim().toLowerCase();
  const hitIds = new Set();
  const cards = state.cards.slice();

  // Sort by created desc within each col (stable)
  cards.sort((a,b)=> b.created - a.created);

  for(const c of cards){
    if(q && !(c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))) continue;
    const el = cardEl(c);
    zones[c.col]?.appendChild(el);
    if(q) hitIds.add(c.id);
  }

  // counts
  $('#total').textContent = state.cards.length;
  $('#cTodo').textContent = state.cards.filter(c=>c.col==='todo').length;
  $('#cDoing').textContent = state.cards.filter(c=>c.col==='doing').length;
  $('#cDone').textContent  = state.cards.filter(c=>c.col==='done').length;

  // highlight search matches
  if(q){
    for(const id of hitIds){
      const el = document.querySelector(`[data-id="${id}"]`);
      if(el) el.classList.add('search-hit');
    }
  }
  enableDnD();
}

function cardEl(c){
  const root = document.createElement('article');
  root.className = 'card';
  root.draggable = true;
  root.dataset.id = c.id;

  const title = document.createElement('div');
  title.className='title';
  title.textContent = c.title;

  const tools = document.createElement('div');
  tools.className='tools';
  const btnEdit = btn('Edit', ()=> openEditor(c.id));
  const btnDel  = btn('Delete', ()=> delCard(c.id));
  tools.append(btnEdit, btnDel);

  const desc = document.createElement('div');
  desc.className='desc';
  desc.textContent = c.desc;

  const meta = document.createElement('div');
  meta.className='meta';
  const pri = document.createElement('span');
  pri.className='badge ' + (c.priority==='high'?'high':c.priority==='low'?'low':'');
  pri.textContent = 'priority: ' + c.priority;
  const time = document.createElement('time');
  time.textContent = fmt(c.created);
  meta.append(pri, time);

  root.append(title, tools, desc, meta);
  return root;
}

function btn(label, onclick){
  const b = document.createElement('button');
  b.textContent = label;
  b.addEventListener('click', onclick);
  return b;
}

// ---------- CRUD ----------
function addCard(title, col){
  const c = { id: uid(), col, title: title.trim() || 'Untitled', desc:'', priority:'normal', created: Date.now() };
  state.cards.unshift(c);
  save(); render(); openEditor(c.id);
}

function delCard(id){
  if(!confirm('Delete this card?')) return;
  state.cards = state.cards.filter(c=>c.id!==id);
  save(); render();
}

function updateCard(id, patch){
  const c = state.cards.find(x=>x.id===id); if(!c) return;
  Object.assign(c, patch);
  save(); render();
}

// ---------- Drag & Drop ----------
function enableDnD(){
  $$('.card').forEach(el=>{
    el.addEventListener('dragstart', ()=> el.classList.add('dragging'));
    el.addEventListener('dragend', ()=> el.classList.remove('dragging'));
  });
  $$('.dropzone').forEach(zone=>{
    zone.addEventListener('dragover', (e)=>{
      e.preventDefault();
      const dragging = $('.card.dragging');
      const after = getAfter(zone, e.clientY);
      if(after==null) zone.appendChild(dragging);
      else zone.insertBefore(dragging, after);
    });
    zone.addEventListener('drop', ()=>{
      // recompute order and col
      const col = zone.id;
      const ids = Array.from(zone.querySelectorAll('.card')).map(x=>x.dataset.id);
      for(const id of ids){
        const card = state.cards.find(c=>c.id===id);
        if(card){ card.col = col; }
      }
      save(); render();
    });
  });
}

function getAfter(container, y){
  const els = [...container.querySelectorAll('.card:not(.dragging)')];
  return els.reduce((closest, child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset < 0 && offset > closest.offset) return { offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ---------- Editor Dialog ----------
let editingId = null;
function openEditor(id){
  const c = state.cards.find(x=>x.id===id); if(!c) return;
  editingId = id;
  $('#eTitle').value = c.title;
  $('#eDesc').value  = c.desc;
  $('#ePriority').value = c.priority;
  $('#editor').showModal();
}
$('#eSave').addEventListener('click', (e)=>{
  e.preventDefault();
  if(!editingId) return;
  updateCard(editingId, {
    title: $('#eTitle').value.trim(),
    desc : $('#eDesc').value,
    priority: $('#ePriority').value
  });
  $('#editor').close();
});

// ---------- Import / Export ----------
$('#export').addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'kanban-export.json';
  a.click();
});
$('#import').addEventListener('change', async (e)=>{
  const file = e.target.files?.[0]; if(!file) return;
  try{
    const text = await file.text();
    const obj = JSON.parse(text);
    if(obj && Array.isArray(obj.cards)){
      state = obj; save(); render();
    } else alert('Invalid JSON');
  }catch{ alert('Invalid JSON'); }
});

// ---------- Search ----------
$('#search').addEventListener('input', ()=> render());

// ---------- New card ----------
$('#addCard').addEventListener('click', ()=>{
  addCard($('#newTitle').value, $('#newColumn').value);
  $('#newTitle').value='';
});

// Initial render
render();
