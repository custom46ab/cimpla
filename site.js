// cimpla.se – gemensamt skript: meny, sidhuvud, intresseanmälan och kontaktformulär.
(function(){
  // ---------- meny (mobil) ----------
  var toggle=document.querySelector('.menu-toggle'), panel=document.getElementById('nav-panel');
  if(toggle&&panel){
    toggle.addEventListener('click',function(){
      var open=panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
      toggle.setAttribute('aria-label',open?'Stäng meny':'Öppna meny');
    });
    addEventListener('keydown',function(e){
      if(e.key==='Escape'&&panel.classList.contains('open')){ panel.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
    });
  }

  // ---------- sidhuvudet får en linje när sidan scrollats ----------
  var head=document.querySelector('.site-head');
  if(head){
    var onScroll=function(){ head.classList.toggle('scrolled',scrollY>4); };
    addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }

  // ---------- årtal i sidfoten ----------
  [].forEach.call(document.querySelectorAll('[data-year]'),function(el){ el.textContent=new Date().getFullYear(); });

  // ---------- formulär som postas till /pilot (Cloudflare Pages Function) ----------
  function wire(form,onDone){
    var err=form.querySelector('[data-err]'), send=form.querySelector('[type=submit]'), label=send.textContent;
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      if(!form.reportValidity()) return;
      if(err) err.hidden=true;
      send.disabled=true; send.textContent='Skickar…';
      fetch('/pilot',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams(new FormData(form)).toString()
      }).then(function(r){
        if(!r.ok) throw new Error(r.status);
        onDone();
      })['catch'](function(){
        send.disabled=false; send.textContent=label; if(err) err.hidden=false;
      });
    });
  }

  // intresseanmälan i dialogrutan (bannern)
  var dlg=document.getElementById('signup');
  if(dlg){
    var form=document.getElementById('signupForm'), done=document.getElementById('signupDone');
    var open=function(){
      if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open','');
      var e=dlg.querySelector('input[type=email]'); if(e) e.focus();
    };
    var close=function(){ if(dlg.close) dlg.close(); else dlg.removeAttribute('open'); };
    [].forEach.call(document.querySelectorAll('[data-open]'),function(b){ b.addEventListener('click',open); });
    [].forEach.call(dlg.querySelectorAll('[data-close]'),function(b){ b.addEventListener('click',close); });
    dlg.addEventListener('click',function(ev){ if(ev.target===dlg) close(); });
    wire(form,function(){ form.hidden=true; done.hidden=false; });
  }

  // kontaktformuläret
  var cf=document.getElementById('contactForm');
  if(cf){
    var cdone=document.getElementById('contactDone');
    wire(cf,function(){ cf.hidden=true; cdone.hidden=false; cdone.focus(); });
  }
})();
