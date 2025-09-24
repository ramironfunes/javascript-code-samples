
// Quiz Game - questions JSON embedded, timer, difficulty, scoring
const $=s=>document.querySelector(s);
const questions = [
  { q:'Which array method creates a new array with elements that pass the test?', opts:['map','forEach','filter','reduce'], a:2, d:'easy' },
  { q:'What is the output of: [...new Set([1,1,2,3])].length ?', opts:['2','3','4','Error'], a:1, d:'easy' },
  { q:'Which HTTP status stands for "Created"?', opts:['200','201','204','400'], a:1, d:'medium' },
  { q:'What does CSS property `box-sizing: border-box` do?', opts:['Includes padding/border in width/height','Removes borders','Centers the box','Adds shadow'], a:0, d:'medium' },
  { q:'In JS, which is NOT a primitive?', opts:['String','Number','Boolean','Function'], a:3, d:'medium' },
  { q:'What does the `defer` attribute on <script> do?', opts:['Executes ASAP','Blocks parsing','Executes after parsing','Ignores script'], a:2, d:'hard' },
  { q:'Big-O complexity of binary search?', opts:['O(log n)','O(n)','O(n log n)','O(1)'], a:0, d:'hard' }
];

let deck=[], idx=0, score=0, timer=null, tleft=0;

function start(){
  const diff=$('#difficulty').value;
  deck = questions.filter(x=> diff==='easy'? x.d!=='hard' : diff==='medium'? x.d!=='easy' : true);
  shuffle(deck);
  idx=0; score=0;
  $('#qtotal').textContent=deck.length;
  $('#score').textContent=score;
  next();
}

function next(){
  if(idx>=deck.length){ return end(); }
  const item=deck[idx];
  tleft = item.d==='hard'? 10 : item.d==='medium'? 15 : 20;
  $('#qnum').textContent=idx+1;
  $('#timer').textContent=tleft;
  renderQ(item);
  if(timer) clearInterval(timer);
  timer=setInterval(()=>{
    tleft--; $('#timer').textContent=tleft;
    if(tleft<=0){ clearInterval(timer); lock(null, item); setTimeout(()=>{ idx++; next(); }, 800); }
  }, 1000);
}

function renderQ(item){
  const s=$('#screen');
  s.innerHTML=`<h2>${item.q}</h2><div class="options"></div>`;
  const box=s.querySelector('.options');
  item.opts.forEach((opt,i)=>{
    const btn=document.createElement('div'); btn.className='opt'; btn.textContent=opt;
    btn.onclick=()=> { if(!btn.classList.contains('correct')&&!btn.classList.contains('wrong')) lock(i, item); setTimeout(()=>{ idx++; next(); }, 600); };
    box.appendChild(btn);
  });
}

function lock(choice, item){
  if(timer) clearInterval(timer);
  const opts=$$('.opt');
  opts.forEach((el,i)=> el.classList.add(i===item.a?'correct':'wrong'));
  if(choice===item.a){ score += 10 + tleft; $('#score').textContent=score; }
}

function end(){
  $('#screen').innerHTML=`<h2>Finished!</h2><p>Your score: <strong>${score}</strong></p><p><button id="again">Play again</button></p>`;
  $('#again').onclick=()=> start();
  $('#qnum').textContent=deck.length; $('#timer').textContent='0';
}

function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }

const $$=s=>Array.from(document.querySelectorAll(s));
$('#start').onclick=start;
$('#reset').onclick=()=>{ deck=[]; idx=0; score=0; $('#screen').innerHTML='<p>Press <strong>Start</strong> to begin.</p>'; $('#score').textContent='0'; $('#qnum').textContent='0'; $('#qtotal').textContent='0'; $('#timer').textContent='0'; };
