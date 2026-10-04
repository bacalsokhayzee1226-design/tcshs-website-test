/* TCSHS starting-page upgrade. Load AFTER your existing <script> block. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var site=$('#site'),hero=$('.hero');
if(!site||!hero)return;
var vid=$('video',hero),wrap=$('.wrap',hero),h1=$('h1',hero),cta=$('.btn',hero);
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
function play(){if(!vid)return;var p=vid.play();if(p&&p.catch)p.catch(function(){});}

/* scroll progress bar */
var bar=document.createElement('div');bar.className='scroll-progress';document.body.appendChild(bar);
function prog(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';}
addEventListener('scroll',prog,{passive:true});prog();

/* headline: split into words for the reveal */
var n=0;
function split(node,parent){
 Array.prototype.forEach.call(node.childNodes,function(c){
  if(c.nodeType===3){
   c.textContent.split(/(\s+)/).forEach(function(t){
    if(!t)return;
    if(/^\s+$/.test(t)){parent.appendChild(document.createTextNode(' '));return;}
    var w=document.createElement('span'),s=document.createElement('span');
    w.className='w';s.textContent=t;s.style.setProperty('--i',n++);
    w.appendChild(s);parent.appendChild(w);
   });
  }else if(c.nodeType===1){var k=c.cloneNode(false);parent.appendChild(k);split(c,k);}
 });
}
var frag=document.createDocumentFragment();
h1.setAttribute('aria-label',h1.textContent.trim());
split(h1,frag);h1.textContent='';h1.appendChild(frag);

/* typed sub-line, button row, scroll cue, spotlight */
var sub=document.createElement('p');
sub.className='hero-sub';sub.innerHTML='Discover <b class="type"></b><i class="caret"></i>';
wrap.insertBefore(sub,cta);
var acts=document.createElement('div');acts.className='hero-actions';
wrap.insertBefore(acts,cta);acts.appendChild(cta);
var alt=document.createElement('a');alt.className='btn alt';alt.href='#programs';alt.textContent='Explore Programs';acts.appendChild(alt);
var cue=document.createElement('a');cue.className='scroll-cue';cue.href='#4-steps';cue.innerHTML='<i></i>Scroll';hero.appendChild(cue);
var spot=document.createElement('div');spot.className='spot';hero.insertBefore(spot,wrap);

var words=['Science','Technology','Engineering','Mathematics'],wi=0,ci=0,del=false,tEl=$('.type',sub);
function type(){
 var w=words[wi],d=del?45:95;
 ci+=del?-1:1;tEl.textContent=w.slice(0,ci);
 if(!del&&ci===w.length){del=true;d=1600;}
 else if(del&&ci===0){del=false;wi=(wi+1)%words.length;d=350;}
 setTimeout(type,d);
}

/* start everything AFTER the intro fade */
function go(){
 if(hero.classList.contains('go'))return;
 hero.classList.add('go');hero.classList.add('playing');play();
 if(rm)tEl.textContent='Science, Technology, Engineering & Mathematics';else setTimeout(type,1400);
}
if(site.classList.contains('show'))go();
else new MutationObserver(function(m,o){if(site.classList.contains('show')){o.disconnect();go();}}).observe(site,{attributes:true,attributeFilter:['class']});

/* pause the video when the hero is off-screen */
new IntersectionObserver(function(e){
 if(!vid||!hero.classList.contains('go'))return;
 if(e[0].isIntersecting)play();else vid.pause();
}).observe(hero);

/* pointer effects: spotlight + parallax, magnetic buttons, card tilt */
if(fine&&!rm){
 var tx=0,ty=0,cx=0,cy=0,raf=0;
 var loop=function(){
  cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
  hero.style.setProperty('--px',cx.toFixed(3));hero.style.setProperty('--py',cy.toFixed(3));
  raf=(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001)?requestAnimationFrame(loop):0;
 };
 hero.addEventListener('pointermove',function(e){
  var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  hero.style.setProperty('--mx',x*100+'%');hero.style.setProperty('--my',y*100+'%');
  tx=x*2-1;ty=y*2-1;if(!raf)raf=requestAnimationFrame(loop);
 });
 $$('.hero .btn,.top .btn').forEach(function(b){
  b.addEventListener('pointermove',function(e){
   var r=b.getBoundingClientRect();
   b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)';
  });
  b.addEventListener('pointerleave',function(){b.style.transform='';});
 });
 $$('.quick a').forEach(function(a){
  a.addEventListener('pointermove',function(e){
   var r=a.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
   a.style.setProperty('--ry',(x-.5)*8+'deg');a.style.setProperty('--rx',(.5-y)*8+'deg');
   a.style.setProperty('--gx',x*100+'%');a.style.setProperty('--gy',y*100+'%');
  });
  a.addEventListener('pointerleave',function(){a.style.setProperty('--rx','0deg');a.style.setProperty('--ry','0deg');});
 });
}

/* steps: staggered reveal + progress line */
var g=$('.grid4');
if(g){
 document.documentElement.classList.add('js');
 var steps=$$('.step',g);
 steps.forEach(function(s,k){s.classList.add('rv');s.style.setProperty('--d',(k*.15)+'s');});
 new IntersectionObserver(function(es,o){
  if(!es[0].isIntersecting)return;
  o.disconnect();g.classList.add('in');steps.forEach(function(s){s.classList.add('in');});
 },{threshold:.35}).observe(g);
}

/* nav scrollspy */
var map={};
$$('nav a[href^="#"]').forEach(function(a){var h=a.getAttribute('href');if(h.length>1)(map[h]=map[h]||[]).push(a);});
var spy=new IntersectionObserver(function(es){
 es.forEach(function(e){
  if(!e.isIntersecting)return;
  $$('nav a.active').forEach(function(a){a.classList.remove('active');});
  var key=e.target===hero?'#home':'#'+e.target.id;
  (map[key]||[]).forEach(function(a){a.classList.add('active');});
 });
},{rootMargin:'-45% 0px -50% 0px'});
Object.keys(map).forEach(function(h){var el=h==='#home'?hero:$(h);if(el)spy.observe(el);});
})();
(function(){

  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');

  if(!btn || !menu) return;

  btn.addEventListener('click', function(){

    var open = menu.classList.toggle('open');

    btn.setAttribute(
      'aria-expanded',
      open ? 'true' : 'false'
    );

    btn.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );

    btn.innerHTML = open ? '&times;' : '&#9776;';

  });

  /* Close menu after tapping a normal navigation link */
  menu.querySelectorAll('a').forEach(function(link){

    link.addEventListener('click', function(){

      menu.classList.remove('open');

      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label','Open menu');
      btn.innerHTML='&#9776;';

    });

  });

})();