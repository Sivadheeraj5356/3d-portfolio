(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

/* ---------- content (facts from Siva's own portfolio, resume and GitHub) ---------- */
var PROJECTS=[
 {n:'Mock AI',d:'AI interview platform that helps you prepare for your interviews.',t:['Next.js','Tailwind','PostgreSQL','Drizzle','Gemini API','Clerk'],live:'https://mock-ai-one.vercel.app',src:'https://github.com/Sivadheeraj5356/mock-ai'},
 {n:'CodeDevAI',d:'AI website generator that helps you create websites in minutes.',t:['Next.js','Tailwind','Convex','Gemini API'],live:'https://codedevai.vercel.app',src:'https://github.com/Sivadheeraj5356/CodeDevIDE'},
 {n:'Tutor AI',d:'An AI tutor that explains concepts and works through problems step by step.',t:['Next.js','Tailwind','Gemini API'],live:'https://tutor-ai-red.vercel.app',src:'https://github.com/Sivadheeraj5356/Tutor-AI'},
 {n:'OmniSync',d:'Personal assistant dashboard that connects communication tools, generates AI briefings, tracks alerts and offers an assistant chat.',t:['Next.js','TypeScript','Tailwind','Gemini API','Trigger.dev'],src:'https://github.com/Sivadheeraj5356/omnisync'},
 {n:'Memories',d:'A memory sharing platform for saving notes and photos.',t:['React','Node.js','Express'],src:'https://github.com/Sivadheeraj5356/Memories'},
 {n:'Pomodoro App',d:'Productivity app built on the Pomodoro technique to help manage your time.',t:['React Native','Tailwind'],src:'https://github.com/Sivadheeraj5356/pomodoro-app'},
 {n:'Ochi Design',d:'Design agency platform with smooth animations and an interactive hero.',t:['Next.js','Tailwind']},
 {n:'Todo App',d:'Todo application with create, read, update and delete.',t:['Next.js','Tailwind']}
];
var NOTES={
 about:{t:'about me',m:'Siva Dheeraj',h:
  '<p>I\'m a full-stack developer who likes building products and web apps that people use.</p>'+
  '<p>I\'m a full stack and React Native developer with an eye for design. The stack tab lists what I work with.</p>'+
  '<p>This site is laid out as a desktop. Use the dock for projects, a small in-browser terminal and contact details.</p>'},
 now:{t:'now',m:'Current',h:
  '<ul><li>Founding engineer at Applied Work, since September 2026.</li><li>B.Tech in Electronics and Communication at IIIT Surat.</li></ul>'+
  '<p>Open to new roles. <a href="#" data-open="mail">Get in touch</a>.</p>'},
 stack:{t:'stack',m:'Tools',h:
  '<h3>Languages</h3><div class="chips"><span class="chip">JavaScript</span><span class="chip">TypeScript</span><span class="chip">C</span></div>'+
  '<h3>Frontend</h3><div class="chips"><span class="chip">React</span><span class="chip">Next.js</span><span class="chip">Tailwind CSS</span><span class="chip">React Native</span><span class="chip">HTML and CSS</span></div>'+
  '<h3>Backend</h3><div class="chips"><span class="chip">Node.js</span><span class="chip">Express</span><span class="chip">REST APIs</span><span class="chip">Prisma</span></div>'+
  '<h3>Data</h3><div class="chips"><span class="chip">PostgreSQL</span><span class="chip">MongoDB</span></div>'+
  '<h3>Tooling</h3><div class="chips"><span class="chip">Git</span><span class="chip">Docker</span><span class="chip">AWS</span><span class="chip">Vercel</span><span class="chip">Postman</span><span class="chip">Figma</span></div>'},
 path:{t:'path',m:'Roles and school',h:
  '<ul class="tl">'+
  '<li><b>Founding engineer, Applied Work</b><span>September 2026 to now</span></li>'+
  '<li><b>Growth, Buildalytic</b><span>July to September 2026</span></li>'+
  '<li><b>Hacktoberfest open-source contributor</b><span>October 2024</span></li>'+
  '<li><b>Re-Imagine Hackathon 2024</b><span>Redesigned the Swiggy and Air India websites. Qualified for the second round.</span></li>'+
  '<li><b>Junior developer, GDG IIIT Surat</b><span></span></li>'+
  '<li><b>B.Tech, Electronics and Communication, IIIT Surat</b><span>2023 to 2027</span></li></ul>'}
};

/* ---------- boot ---------- */
var bar=$('#bootbar'),boot=$('#boot'),p=0;
var iv=setInterval(function(){p=Math.min(100,p+Math.random()*28+12);bar.style.width=p+'%';if(p>=100){clearInterval(iv);setTimeout(function(){boot.classList.add('done');start()},200)}},110);

/* ---------- clock ---------- */
function tick(){var d=new Date();$('#clock').textContent=d.toLocaleDateString([], {weekday:'short',month:'short',day:'numeric'})+'  '+d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
tick();setInterval(tick,15000);

/* ---------- notes ---------- */
function showNote(k){
  var n=NOTES[k];if(!n)return;
  $('#npage').innerHTML='<h2>'+n.t+'</h2><p class="meta">'+n.m+'</p>'+n.h;
  $$('.nlist button').forEach(function(b){var on=b.dataset.note===k;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
}
$$('.nlist button').forEach(function(b){b.addEventListener('click',function(){showNote(b.dataset.note)})});
showNote('about');

/* ---------- projects ---------- */
function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
$('#pgrid').innerHTML=PROJECTS.map(function(x){
  return '<article class="card"><h3>'+esc(x.n)+'</h3><p>'+esc(x.d)+'</p><div class="chips">'+x.t.map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div><div class="row">'+
   (x.live?'<a href="'+x.live+'" target="_blank" rel="noopener">Live</a>':'')+(x.src?'<a href="'+x.src+'" target="_blank" rel="noopener">Source</a>':'')+'</div></article>'}).join('');

/* ---------- windows ---------- */
var wins={notes:$('#win-notes'),projects:$('#win-projects'),terminal:$('#win-terminal'),mail:$('#win-mail')};
var z=10,small=function(){return matchMedia('(max-width:760px)').matches};
var geo={notes:[.06,.05,.56,.78],projects:[.2,.1,.62,.74],terminal:[.12,.18,.5,.62],mail:[.3,.08,.38,.7]};
function place(k){
  var d=$('#desk'),w=d.clientWidth,h=d.clientHeight,g=geo[k],el=wins[k];
  el.style.width=Math.max(340,w*g[2])+'px';el.style.height=Math.max(320,h*g[3])+'px';
  el.style.left=Math.max(8,w*g[0])+'px';el.style.top=Math.max(8,h*g[1])+'px';
}
function focus(k){
  var el=wins[k];el.style.zIndex=++z;
  $$('.win').forEach(function(x){x.classList.toggle('front',x===el)});
  $('#appname').textContent=el.dataset.app;
  if(small()){$$('.win.open').forEach(function(x){if(x!==el)x.style.visibility='hidden'});el.style.visibility='visible'}
}
function openApp(k){
  var el=wins[k];if(!el)return;
  if(!el.classList.contains('open')){el.classList.add('open');if(!el.dataset.placed){place(k);el.dataset.placed=1}}
  el.style.visibility='visible';
  focus(k);dock();
  if(k==='terminal')setTimeout(function(){$('#tin').focus({preventScroll:true})},50);
}
function closeApp(k){wins[k].classList.remove('open','max');dock();var open=$$('.win.open');if(open.length){var top=open.sort(function(a,b){return b.style.zIndex-a.style.zIndex})[0];focus(top.id.slice(4))}else $('#appname').textContent='Desktop'}
function dock(){$$('#dock button').forEach(function(b){b.classList.toggle('run',wins[b.dataset.open].classList.contains('open'))})}
Object.keys(wins).forEach(function(k){
  var el=wins[k];
  el.addEventListener('pointerdown',function(){focus(k)});
  $('.close',el).addEventListener('click',function(){closeApp(k)});
  $('.min',el).addEventListener('click',function(){closeApp(k)});
  $('.max',el).addEventListener('click',function(){el.classList.toggle('max')});
  var tb=$('.titlebar',el),sx,sy,ox,oy,drag=false;
  tb.addEventListener('pointerdown',function(e){if(small()||e.target.closest('.l'))return;drag=true;sx=e.clientX;sy=e.clientY;ox=el.offsetLeft;oy=el.offsetTop;tb.setPointerCapture(e.pointerId)});
  tb.addEventListener('pointermove',function(e){if(!drag||el.classList.contains('max'))return;var d=$('#desk');
    el.style.left=Math.min(d.clientWidth-80,Math.max(-el.offsetWidth+120,ox+e.clientX-sx))+'px';
    el.style.top=Math.min(d.clientHeight-40,Math.max(0,oy+e.clientY-sy))+'px'});
  tb.addEventListener('pointerup',function(){drag=false});
  tb.addEventListener('dblclick',function(){if(!small())el.classList.toggle('max')});
});
document.addEventListener('click',function(e){var o=e.target.closest('[data-open]');if(o){e.preventDefault();openApp(o.dataset.open)}});
addEventListener('keydown',function(e){if(e.key==='Escape'){var f=$('.win.front.open');if(f&&document.activeElement.id!=='tin')closeApp(f.id.slice(4))}});

/* ---------- parallax ---------- */
addEventListener('pointermove',function(e){if(small())return;var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
  $$('.orb').forEach(function(o,i){var s=(i+1)*14;o.style.transform='translate('+(-x*s)+'px,'+(-y*s)+'px)'})});

/* ---------- terminal ---------- */
var out=$('#tout'),hist=[],hi=0;
function line(h,cls){var d=document.createElement('div');d.className='ln '+(cls||'');d.innerHTML=h;out.appendChild(d);$('#term').scrollTop=1e6}
var CMD={
 help:function(){return ['<span class="k">about</span>     who I am','<span class="k">projects</span>  things I have built','<span class="k">stack</span>     tools I use','<span class="k">path</span>      roles and school','<span class="k">contact</span>   how to reach me','<span class="k">open</span> &lt;about|projects|contact&gt;','<span class="k">clear</span>']},
 whoami:function(){return ['Siva Dheeraj, full-stack developer']},
 about:function(){return ['Full-stack developer. I build products and web apps, React and Next.js to Node and Postgres.']},
 projects:function(){return PROJECTS.map(function(x){return '<span class="k">'+esc(x.n)+'</span>  '+esc(x.t.join(', '))})},
 stack:function(){return ['JavaScript, TypeScript, C','React, Next.js, Tailwind, React Native','Node, Express, Prisma, REST','PostgreSQL, MongoDB','Git, Docker, AWS, Vercel']},
 path:function(){return ['Founding engineer, Applied Work (Sep 2026 - now)','Growth, Buildalytic (Jul - Sep 2026)','B.Tech ECE, IIIT Surat (2023 - 2027)']},
 contact:function(){return ['<a href="mailto:sivadheeraj5356@gmail.com">sivadheeraj5356@gmail.com</a>','<a href="https://github.com/Sivadheeraj5356" target="_blank" rel="noopener">github.com/Sivadheeraj5356</a>','<a href="https://www.linkedin.com/in/sivadheeraj" target="_blank" rel="noopener">linkedin.com/in/sivadheeraj</a>']},
 open:function(a){var m={about:'notes',projects:'projects',contact:'mail'}[a];if(!m)return ['usage: open about|projects|contact'];openApp(m);return ['opening '+a]},
 clear:function(){out.innerHTML='';return []}
};
line('Siva Dheeraj - desk shell. Type <span class="k">help</span>.');
$('#tform').addEventListener('submit',function(e){e.preventDefault();var v=$('#tin').value.trim();$('#tin').value='';if(!v)return;
  hist.push(v);hi=hist.length;line('<span class="p">siva@desk ~ %</span> '+esc(v));
  var parts=v.split(/\s+/),c=parts[0].toLowerCase(),f=CMD[c];
  (f?f(parts[1]):['command not found: '+esc(c)+'. try help']).forEach(function(l){line(l)})});
$('#tin').addEventListener('keydown',function(e){if(e.key==='ArrowUp'&&hi>0){hi--;this.value=hist[hi];e.preventDefault()}else if(e.key==='ArrowDown'){hi=Math.min(hist.length,hi+1);this.value=hist[hi]||'';e.preventDefault()}});
$('#term').addEventListener('click',function(){if(!getSelection().toString())$('#tin').focus()});

function start(){
  var q=(location.hash||'').slice(1);
  if(wins[q]||q==='about')openApp(q==='about'?'notes':q);else openApp('notes');
  if(!small()&&!q){openApp('projects');openApp('notes')};
}
addEventListener('resize',function(){var d=$('#desk');$$('.win').forEach(function(x){if(x.classList.contains('max')||small())return;x.style.width=Math.min(x.offsetWidth,d.clientWidth-16)+'px';x.style.height=Math.min(x.offsetHeight,d.clientHeight-16)+'px';x.style.left=Math.max(8,Math.min(x.offsetLeft,d.clientWidth-x.offsetWidth-8))+'px';x.style.top=Math.max(8,Math.min(x.offsetTop,d.clientHeight-x.offsetHeight-8))+'px'});if(small())$$('.win').forEach(function(x){x.style.removeProperty('visibility')});var f=$('.win.front.open');if(f)focus(f.id.slice(4))});
})();
