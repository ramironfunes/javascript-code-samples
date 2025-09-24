
// Image Gallery with Lightbox, Grid/Masonry layout, search, shuffle
const $=s=>document.querySelector(s);
let images = Array.from({length:40}).map((_,i)=> ({
  id:i+1,
  title:`Photo #${i+1}`,
  src:`https://picsum.photos/seed/p${i+1}/600/400`,
  h: 200 + Math.floor(Math.random()*200)
}));

let layout='grid';
render();

$('#layout').onchange=e=>{ layout=e.target.value; render(); };
$('#q').oninput=e=> render();
$('#shuffle').onclick=()=>{ images = shuffle(images.slice()); render(); };

function render(){
  const q = $('#q').value.trim().toLowerCase();
  const list = images.filter(x=> x.title.toLowerCase().includes(q));
  const container = $('#gallery');
  container.className = layout==='grid' ? 'grid' : 'masonry';
  container.innerHTML='';
  for(const img of list){
    const card = document.createElement('div'); card.className='card';
    const el = document.createElement('img');
    el.src = img.src;
    el.style.height = layout==='masonry' ? `${img.h}px` : '180px';
    el.alt = img.title;
    const t = document.createElement('div'); t.className='title'; t.textContent=img.title;
    card.append(el, t);
    card.onclick=()=> openLightbox(img);
    container.appendChild(card);
  }
}

function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

// Lightbox
let current=null;
function openLightbox(img){
  current = images.findIndex(x=>x.id===img.id);
  $('#big').src = img.src;
  $('#caption').textContent = img.title;
  $('#lightbox').classList.remove('hidden');
}
function close(){ $('#lightbox').classList.add('hidden'); }
function nav(dir){
  if(current==null) return;
  current = (current + dir + images.length) % images.length;
  const img = images[current];
  $('#big').src = img.src;
  $('#caption').textContent = img.title;
}
$('#close').onclick = close;
$('#prev').onclick = ()=> nav(-1);
$('#next').onclick = ()=> nav(1);
document.addEventListener('keydown', e=>{
  if(e.key==='Escape') close();
  if(e.key==='ArrowLeft') nav(-1);
  if(e.key==='ArrowRight') nav(1);
});
