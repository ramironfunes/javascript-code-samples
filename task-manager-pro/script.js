
// Task Manager Pro - robust vanilla JS app with localStorage, drag-n-drop, import/export, filters

const lsKey = 'task-manager-pro:data';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const state = {
  tasks: load(),
  filterText: '',
  filterStatus: 'all',
  sortBy: 'created'
};

function load(){
  try{ return JSON.parse(localStorage.getItem(lsKey)) || []; }catch{ return []; }
}
function save(){
  localStorage.setItem(lsKey, JSON.stringify(state.tasks));
}

function uid(){ return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

function addTask(title, priority='normal'){
  const t = { id: uid(), title: title.trim(), done:false, priority, created:Date.now() };
  if(!t.title) return;
  state.tasks.push(t);
  save(); render();
}

function removeTask(id){
  state.tasks = state.tasks.filter(t=>t.id!==id);
  save(); render();
}

function toggleTask(id){
  const t = state.tasks.find(t=>t.id===id);
  if(!t) return;
  t.done = !t.done;
  save(); render();
}

function editTask(id, newTitle){
  const t = state.tasks.find(t=>t.id===id);
  if(!t) return;
  t.title = newTitle.trim();
  save(); render();
}

function setPriority(id, p){
  const t = state.tasks.find(t=>t.id===id);
  if(!t) return;
  t.priority = p;
  save(); render();
}

function clearCompleted(){
  state.tasks = state.tasks.filter(t=>!t.done);
  save(); render();
}

function sortTasks(list){
  const key = state.sortBy;
  const prioRank = { high:0, normal:1, low:2 };
  return list.sort((a,b)=>{
    if(key==='created') return b.created - a.created;
    if(key==='priority') return prioRank[a.priority]-prioRank[b.priority];
    if(key==='title') return a.title.localeCompare(b.title);
    return 0;
  });
}

function filtered(){
  const q = state.filterText.toLowerCase();
  let list = state.tasks.filter(t => t.title.toLowerCase().includes(q));
  if(state.filterStatus==='pending') list = list.filter(t=>!t.done);
  if(state.filterStatus==='completed') list = list.filter(t=>t.done);
  return sortTasks(list);
}

function render(){
  const list = $('#taskList');
  list.innerHTML = '';
  for(const t of filtered()){
    const li = document.createElement('li');
    li.className = 'item' + (t.done ? ' completed' : '');
    li.draggable = true;
    li.dataset.id = t.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.addEventListener('change', ()=> toggleTask(t.id));

    const mid = document.createElement('div');
    const title = document.createElement('div');
    title.className='title';
    title.textContent = t.title;
    title.title = 'Double click to edit';
    title.addEventListener('dblclick', ()=> startEdit(li, t.id, title));

    const meta = document.createElement('div');
    meta.className='meta';
    const badge = document.createElement('span');
    badge.className='badge ' + (t.priority==='high'?'high':t.priority==='low'?'low':'');
    badge.textContent = 'priority: ' + t.priority;
    meta.append(badge, ' • created ' + new Date(t.created).toLocaleString());

    mid.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const pri = document.createElement('select');
    pri.innerHTML = '<option value="high">High</option><option selected value="normal">Normal</option><option value="low">Low</option>';
    pri.value = t.priority;
    pri.addEventListener('change', e=> setPriority(t.id, e.target.value));
    const del = document.createElement('button'); del.textContent='Delete';
    del.style.borderColor = '#ef4444'; del.style.color = '#fca5a5';
    del.addEventListener('click', ()=> removeTask(t.id));
    actions.append(pri, del);

    li.append(cb, mid, actions);
    list.append(li);

    // drag events
    li.addEventListener('dragstart', ()=> li.classList.add('dragging'));
    li.addEventListener('dragend', ()=> { li.classList.remove('dragging'); onDragEnd(); });
  }
  // enable drag container
  enableDrag();
}

function startEdit(li, id, titleEl){
  li.classList.add('editing');
  const input = document.createElement('input');
  input.value = titleEl.textContent;
  input.addEventListener('keydown', e=>{
    if(e.key==='Enter'){ commit(); }
    if(e.key==='Escape'){ li.classList.remove('editing'); render(); }
  });
  input.addEventListener('blur', commit);
  titleEl.replaceWith(input);
  input.focus();
  function commit(){
    editTask(id, input.value);
  }
}

function enableDrag(){
  const list = $('#taskList');
  list.addEventListener('dragover', e=>{
    e.preventDefault();
    const dragging = $('.item.dragging');
    const afterElement = getDragAfterElement(list, e.clientY);
    if(afterElement==null) list.append(dragging);
    else list.insertBefore(dragging, afterElement);
  });
}

function getDragAfterElement(container, y){
  const els = [...container.querySelectorAll('.item:not(.dragging)')];
  return els.reduce((closest, child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if(offset < 0 && offset > closest.offset) return { offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function onDragEnd(){
  const ids = $$('.item').map(li=> li.dataset.id);
  // reorder state.tasks according to ids
  const map = new Map(state.tasks.map(t=>[t.id, t]));
  state.tasks = ids.map(id => map.get(id)).filter(Boolean);
  save(); render();
}

// UI bindings
$('#addBtn').addEventListener('click', ()=> {
  addTask($('#taskInput').value, $('#prioritySelect').value);
  $('#taskInput').value='';
});
$('#taskInput').addEventListener('keydown', e=>{
  if(e.key==='Enter'){ $('#addBtn').click(); }
});
$('#search').addEventListener('input', e=>{ state.filterText = e.target.value; render(); });
$('#statusFilter').addEventListener('change', e=>{ state.filterStatus = e.target.value; render(); });
$('#sortBy').addEventListener('change', e=>{ state.sortBy = e.target.value; render(); });
$('#clearCompleted').addEventListener('click', clearCompleted);
$('#exportJson').addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tasks-export.json';
  a.click();
});
$('#importJson').addEventListener('change', async e=>{
  const file = e.target.files?.[0]; if(!file) return;
  const text = await file.text();
  try{
    const arr = JSON.parse(text);
    if(Array.isArray(arr)){
      state.tasks = arr.map(x=>({ id: x.id||uid(), title:String(x.title||'').trim(), done:!!x.done, priority:x.priority||'normal', created:Number(x.created)||Date.now() }));
      save(); render();
    }
  }catch{ alert('Invalid JSON'); }
});

// seed demo data if empty
if(state.tasks.length===0){
  addTask('Welcome to Task Manager Pro', 'normal');
  addTask('Double‑click to edit a task', 'low');
  addTask('Drag to reorder • Use filters/search', 'high');
} else {
  render();
}
