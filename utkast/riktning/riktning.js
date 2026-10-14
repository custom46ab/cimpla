// utkast/riktning – scrollsekvensen för flödet och "Testa själv"-demon.
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)');
  var narrow=matchMedia('(max-width: 860px)');

  // sidhuvudets höjd, så att den fastlåsta flödesvyn hamnar under det
  var head=document.querySelector('.site-head');
  function headH(){ if(head) document.documentElement.style.setProperty('--head',head.offsetHeight+'px'); }
  headH(); addEventListener('resize',headH);

  // ---------- flödet ----------
  // Varje stegs bild kopieras in under texten, för mobil och reducerad rörelse.
  var seq=document.getElementById('flodet');
  if(seq){
    var steps=seq.querySelectorAll('.seq-steps li');
    var panels=seq.querySelectorAll('.seq-stage .panel');
    var bars=seq.querySelectorAll('.seq-bar i');
    [].forEach.call(steps,function(li,i){
      var mini=li.querySelector('.mini');
      if(mini&&panels[i]) mini.appendChild(panels[i].firstElementChild.cloneNode(true));
    });
    var current=-1;
    function show(k){
      if(k===current) return; current=k;
      [].forEach.call(steps,function(el,i){ el.classList.toggle('on',i===k); });
      [].forEach.call(panels,function(el,i){ el.classList.toggle('on',i===k); });
    }
    function onScroll(){
      if(reduce.matches||narrow.matches) return;
      var hh=head?head.offsetHeight:0;
      var r=seq.getBoundingClientRect(), span=r.height-(innerHeight-hh);
      var p=span>0?Math.min(1,Math.max(0,(hh-r.top)/span)):0;
      var n=steps.length, k=Math.min(n-1,Math.floor(p*n));
      show(k);
      [].forEach.call(bars,function(b,i){
        b.style.setProperty('--p',Math.min(1,Math.max(0,p*n-i)).toFixed(3));
      });
    }
    show(0);
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',onScroll);
    onScroll();
  }

  // ---------- testa själv ----------
  var ORDERS={
    a:{name:'Leverantör A',rows:[
      ['Skaljacka Fjäll','Black','S','7350012346011','2','1 249,50','4310128'],
      ['Skaljacka Fjäll','Black','M','7350012346028','4','1 249,50','4310128'],
      ['Skaljacka Fjäll','Black','L','7350012346035','3','1 249,50','4310128'],
      ['Fleece Lätt','Moss','M','7350012347018','6','449,00','4120128']
    ]},
    b:{name:'Leverantör B',rows:[
      ['Löparsko Trail 4','Ash/Lime','41','7330098120411','2','689,00','7020044'],
      ['Löparsko Trail 4','Ash/Lime','42','7330098120428','3','689,00','7020044'],
      ['Löparsko Trail 4','Ash/Lime','43','7330098120435','3','689,00','7020044'],
      ['Löparsko Trail 4','Ash/Lime','44','7330098120442','2','689,00','7020044'],
      ['Löparsko Trail 4','Ash/Lime','45','7330098120459','1','689,00','7020044']
    ]}
  };
  var picks=document.querySelectorAll('.pick'), run=document.getElementById('demoRun');
  var body=document.getElementById('demoRows'), status=document.getElementById('demoStatus'), name=document.getElementById('demoName');
  if(!run||!body) return;
  var chosen='a', timer=null;
  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function reset(){
    clearInterval(timer); body.innerHTML='';
    status.textContent='Väntar'; status.classList.remove('done');
    name.textContent='Importfil · '+ORDERS[chosen].name;
    run.disabled=false;
  }
  [].forEach.call(picks,function(b){
    b.addEventListener('click',function(){
      chosen=b.getAttribute('data-order');
      [].forEach.call(picks,function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); });
      reset();
    });
  });
  run.addEventListener('click',function(){
    reset(); run.disabled=true;
    var rows=ORDERS[chosen].rows;
    body.innerHTML=rows.map(function(r){
      return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td class="fill">'+esc(r[3])
        +'</td><td class="num">'+esc(r[4])+'</td><td class="num">'+esc(r[5])+'</td><td class="fill">'+esc(r[6])+'</td></tr>';
    }).join('');
    var trs=body.querySelectorAll('tr'), i=0;
    status.textContent='Läser in…';
    var step=reduce.matches?0:380;
    function next(){
      if(i<trs.length){ trs[i++].classList.add('in'); return; }
      clearInterval(timer);
      status.textContent=trs.length+' rader klara'; status.classList.add('done');
      run.disabled=false; run.textContent='Läs in igen';
    }
    if(step===0){ while(i<trs.length) next(); next(); } else timer=setInterval(next,step);
  });
})();

// ---------- pricat-databasen: en prislista i taget markeras som nyss inläst ----------
(function(){
  var tiles=document.querySelectorAll('.pdb .pt:not(.pt-add)');
  if(!tiles.length||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var i=0;
  setInterval(function(){
    [].forEach.call(tiles,function(t){ t.classList.remove('ny'); });
    i=(i+4)%tiles.length;                 // hoppa runt i rutnätet, inte i ordning
    tiles[i].classList.add('ny');
  },2600);
})();
