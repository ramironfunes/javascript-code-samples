
// Memory Card Game - grid sizes, timer, moves, pairs, animations
const $=s=>document.querySelector(s);
let size=6, grid=[], first=null, lock=false, moves=0, pairs=0, timer=null, t=0;

function start(){
  size = Number($('#size').value)||6;
  grid = buildGrid(size);
  moves=0; pairs=0; t=0; if(timer) clearInterval(timer);
  $('#moves').textContent='0'; $('#pairs').textContent='0'; $('#time').textContent='0';
  render();
  timer=setInterval(()=>{ t++; $('#time').textContent=String(t); },1000);
}
function reset(){
  if(timer) clearInterval(timer); t=0; $('#time').textContent='0';
  start();
}

function buildGrid(n){
  const total = n*n;
  const needed = total/2;
  const symbols = genSymbols(needed);
  const deck = shuffle(symbols.concat(symbols)).map((sym,i)=>({ id:i, sym, flip:false, matched:false }));
  return deck;
}
function genSymbols(n){
  const base = '🍎🍌🍇🍓🍍🥑🥕🌶️🍔🍟🍕🥐🥨🥞🧇🍗🍤🍣🍙🍜🍦🍰🍩🍪🍫🍬🎈🎲🎯🎹🎧🎮🎳🚗✈️🚀🛰️🛵🚲🏍️🏎️🏀⚽🥎🏈🎾🥊🎹🎻🎺🎷💎🔔🔒🔑🪙💡🔧🧭⏰⌚️📷🎥📺💻⌨️🖱️🧪🔬🧬🌙⭐️☀️🌈⚡️❄️🔥💧🌊🌪️🌋🪐';
  const arr = Array.from(base);
  const res=[]; let i=0;
  while(res.length<n){ res.push(arr[i%arr.length]); i++; }
  return res;
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function render(){
  const g=$('#grid'); g.innerHTML='';
  g.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  for(const c of grid){
    const card=document.createElement('div'); card.className='card'+(c.flip?' flip':'')+(c.matched?' matched':'');
    card.dataset.id=c.id;
    card.innerHTML=`<div class="face front"></div><div class="face back">${c.sym}</div>`;
    card.onclick=()=> onCard(c.id);
    g.appendChild(card);
  }
}

function onCard(id){
  if(lock) return;
  const c = grid.find(x=>x.id===id); if(!c || c.matched) return;
  if(c.flip) return;
  c.flip = true; render();
  if(first==null){ first = c; return; }
  moves++; $('#moves').textContent=String(moves);
  // second
  if(first.sym===c.sym){
    c.matched = true; first.matched = true; first=null; pairs++; $('#pairs').textContent=String(pairs);
    if(pairs === grid.length/2){ if(timer) clearInterval(timer); setTimeout(()=> alert(`You win! Moves:${moves} Time:${t}s`), 100); }
  } else {
    lock=true; setTimeout(()=>{
      c.flip=false; first.flip=false; first=null; lock=false; render();
    }, 800);
  }
}

$('#start').onclick=start;
$('#reset').onclick=reset;
start();
