(function(){
  // nav scroll state
  var nav=document.getElementById('nav');
  if(nav){
    var onScroll=function(){nav.classList.toggle('scrolled',window.scrollY>20);};
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  }

  // mobile menu
  var toggle=document.getElementById('navToggle'), mobile=document.getElementById('navMobile');
  if(toggle&&mobile){
    toggle.addEventListener('click',function(){mobile.classList.toggle('open');});
    mobile.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mobile.classList.remove('open');});});
  }

  // reveal on scroll
  var reveals=[].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){if(!el.classList.contains('in'))io.observe(el);});
  } else { reveals.forEach(function(el){el.classList.add('in');}); }
  setTimeout(function(){reveals.forEach(function(el){el.classList.add('in');});},1800);

  // confidence meters + count-ups
  function animMeters(){document.querySelectorAll('.meter i').forEach(function(i){i.style.width=(i.dataset.w||0)+'%';});}
  function countUp(el){
    var to=parseFloat(el.dataset.to),dec=parseInt(el.dataset.dec||'0'),start=null,dur=1400;
    function step(ts){if(!start)start=ts;var p=Math.min((ts-start)/dur,1);var e=1-Math.pow(1-p,3);
      var v=to*e;el.textContent=dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US');
      if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  var counted=false,metered=false;
  function checkAnim(){
    var vr=document.querySelector('.value, .count');
    if(vr&&!counted&&vr.getBoundingClientRect().top<window.innerHeight*.9){counted=true;document.querySelectorAll('.count').forEach(countUp);}
    var pf=document.querySelector('.journal');
    if(pf&&!metered&&pf.getBoundingClientRect().top<window.innerHeight*.85){metered=true;animMeters();}
  }
  checkAnim();window.addEventListener('scroll',checkAnim,{passive:true});
  setTimeout(function(){if(!counted){counted=true;document.querySelectorAll('.count').forEach(countUp);}if(!metered){metered=true;animMeters();}},2000);

  // jargon translate
  document.querySelectorAll('.jargon').forEach(function(j){
    var orig=j.textContent,plain=j.dataset.plain;
    var swap=function(){j.textContent=plain;j.dataset.on='1';};
    var back=function(){j.textContent=orig;j.dataset.on='0';};
    j.addEventListener('mouseenter',swap);j.addEventListener('mouseleave',back);
    j.addEventListener('click',function(){j.dataset.on==='1'?back():swap();});
  });

  // control toggle
  var seg=document.getElementById('seg');
  if(seg){
    var modes={ask:{t:'Talous asks before it acts',d:'Every recommendation lands in your approval queue. Tap approve or reject. Nothing happens to your money without your say-so.'},
               auto:{t:'Talous runs on autopilot',d:'It executes any move it’s confident about on its own, kills leaks the moment it spots them, and tells you afterwards. You stay informed, not involved.'}};
    seg.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      seg.querySelectorAll('button').forEach(function(x){x.classList.remove('active');});b.classList.add('active');
      var m=modes[b.dataset.mode];document.getElementById('modeTitle').textContent=m.t;document.getElementById('modeDesc').textContent=m.d;
    });
  }

  // faq
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q=item.querySelector('.faq-q'),a=item.querySelector('.faq-a');
    q.addEventListener('click',function(){
      var open=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(o){o.classList.remove('open');o.querySelector('.faq-a').style.maxHeight=null;});
      if(!open){item.classList.add('open');a.style.maxHeight=a.scrollHeight+'px';}
    });
  });

  // teardown form (demo only — no backend)
  var form=document.getElementById('teardownForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      form.style.display='none';
      var ok=document.getElementById('formOk');
      if(ok)ok.classList.add('show');
    });
  }
})();
