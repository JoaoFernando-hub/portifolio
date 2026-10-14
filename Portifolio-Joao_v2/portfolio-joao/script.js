// Tema claro/escuro
(()=>{const root=document.documentElement;const saved=localStorage.getItem('tema');
if(saved==='claro')root.classList.add('light');
function label(b){const l=root.classList.contains('light');b.textContent=l?'☾':'☀';b.setAttribute('aria-label',l?'Ativar tema escuro':'Ativar tema claro');b.title=b.getAttribute('aria-label');}
document.querySelectorAll('.desktop-nav, #mobile-menu nav, #mobile-menu').forEach((nav,i)=>{if(nav.id==='mobile-menu'&&nav.querySelector('nav'))return;const b=document.createElement('button');b.type='button';b.className='theme-toggle';label(b);
b.addEventListener('click',()=>{root.classList.toggle('light');localStorage.setItem('tema',root.classList.contains('light')?'claro':'escuro');document.querySelectorAll('.theme-toggle').forEach(label);});nav.append(b);});
})();
// Fundo animado (névoa)
(()=>{try{
const canvas=document.querySelector('.site-backdrop canvas');const gl=canvas?.getContext('webgl',{alpha:false,antialias:false});if(!gl){document.documentElement.classList.add('no-webgl');return;}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;}
const vertexSource='\n  attribute vec2 a_position;\n  varying vec2 v_uv;\n  \n  void main() {\n    v_uv = a_position * 0.5 + 0.5;\n    gl_Position = vec4(a_position, 0.0, 1.0);\n  }\n';
const fragmentSource='\n  #ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n  #else\n  precision mediump float;\n  #endif\n\n  varying vec2 v_uv;\n  uniform float u_time;\n  uniform vec2 u_resolution;\n\n  #define TWO_PI 6.28318530718\n  #define PI 3.14159265358979323846\n\n  float random(vec2 st) {\n    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);\n  }\n\n  float noise(vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n    float a = random(i);\n    float b = random(i + vec2(1.0, 0.0));\n    float c = random(i + vec2(0.0, 1.0));\n    float d = random(i + vec2(1.0, 1.0));\n\n    vec2 u = f * f * (3.0 - 2.0 * f);\n\n    float x1 = mix(a, b, u.x);\n    float x2 = mix(c, d, u.x);\n    return mix(x1, x2, u.y);\n  }\n\n  void main() {\n      vec2 uv = v_uv;\n\n      // Mist preset timing parameters: speed = 39, offset = -235\n      float t = u_time * 0.975 - 1.175;\n\n      // Mist preset scale parameter: scale = 0.48\n      float noise_scale = 0.00338; // .0005 + .006 * 0.48\n\n      uv -= 0.5;\n      uv *= (noise_scale * u_resolution);\n      uv /= 1.5; // pixel ratio normalization\n      uv += 0.5;\n\n      // 70% Same: Distortion & Swirl loops preserved exactly for perfect motion fidelity\n      // Distortion: distortion = 4 (u_distortion = 0.08)\n      float n1 = noise(uv * 1.0 + t);\n      float n2 = noise(uv * 2.0 - t);\n      float angle = n1 * TWO_PI;\n      uv.x += 0.32 * n2 * cos(angle);\n      uv.y += 0.32 * n2 * sin(angle);\n\n      // Swirl: swirl = 65, swirlIterations = 5\n      for (int i = 1; i <= 5; i++) {\n          float fi = float(i);\n          uv.x += 0.65 / fi * cos(t + fi * 1.5 * uv.y);\n          uv.y += 0.65 / fi * cos(t + fi * 1.0 * uv.x);\n      }\n\n      // Edge shape shape-mixer calculation (shapeSize = 48, proportion = 33)\n      float sh = 1.0 - uv.y;\n      sh -= 0.5;\n      sh /= (noise_scale * u_resolution.y);\n      sh += 0.5;\n\n      float shape_scaling = 0.104; // 0.2 * (1.0 - 0.48)\n      float shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (0.33 - 0.5));\n      float mixer = shape;\n\n      // 30% Premium Upgrade: Highly classy Parallax Fog & Cinematic Sweeping God Rays with Focused Ribbon\n      vec3 bg = vec3(0.0196, 0.0196, 0.0196);          // Obsidian background (#050505)\n      vec3 pink = vec3(1.0, 0.4, 0.7215);              // Pure elegant magenta core (#FF66B8)\n\n      // Exponent-sine bell curve to isolate mist into a beautiful center ribbon splaying dynamically\n      float mistFocus = pow(sin(mixer * PI), 4.2);\n\n      // Double-layer parallax mist density (blending broad background flow and fine parallax foreground)\n      float fineMist = noise(uv * 3.5 - t * 1.3) * 0.4 + noise(uv * 1.5 + t * 0.85) * 0.6;\n      float combinedDensity = mix(mixer, fineMist, 0.28) * mistFocus;\n\n      // Smooth constant-color gradient mapping\n      vec3 col = mix(bg, pink, smoothstep(0.0, 0.85, combinedDensity));\n\n      // Foreground parallax highlight glow, strictly bounded by the mist focus ribbon\n      float highlight = smoothstep(0.42, 0.88, fineMist) * smoothstep(0.12, 0.9, mixer) * mistFocus;\n      col = mix(col, pink * 1.15, highlight * 0.35);\n\n      // Sweeping Crepuscular God Rays (light shafts filtering through the moving fog ribbon)\n      vec2 raySource = vec2(0.2, 1.25); // light source positioned above the upper-left viewport\n      vec2 rayDir = normalize(v_uv - raySource);\n      float rayAngle = atan(rayDir.y, rayDir.x);\n      \n      // Sweep modulation using multiple low-frequency time-shifted sines\n      float rays = sin(rayAngle * 6.5 + t * 0.35) * 0.35 +\n                   sin(rayAngle * 12.0 - t * 0.22) * 0.25 +\n                   sin(rayAngle * 24.0 + t * 0.15) * 0.15;\n      rays = smoothstep(0.15, 0.82, rays * 0.5 + 0.5);\n\n      // Volumetric crepuscular light soft overlay, masked by fog density and center focus ribbon\n      float rayGlow = rays * smoothstep(0.15, 0.9, combinedDensity) * (1.1 - v_uv.y) * mistFocus * 0.7;\n      col += pink * rayGlow * 0.38;\n\n      // Cinematic Haze: micro-fine glowing particulate dust in illuminated center areas\n      float grain = random(gl_FragCoord.xy * 0.15 + t * 0.05);\n      float particles = step(0.988, grain) * smoothstep(0.2, 0.9, combinedDensity);\n      col += pink * particles * 0.32;\n\n      // Final contrast optimization\n      col = pow(col, vec3(0.92));\n\n      gl_FragColor = vec4(col, 1.0);\n  }\n';
const vs=shader(gl.VERTEX_SHADER,vertexSource),fs=shader(gl.FRAGMENT_SHADER,fragmentSource);if(!vs||!fs)return;
const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
const time=gl.getUniformLocation(program,'u_time'),resolution=gl.getUniformLocation(program,'u_resolution');const startTime=performance.now();const reduced={matches:false};
function resize(){if(!canvas.clientWidth)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=canvas.clientWidth*dpr;canvas.height=canvas.clientHeight*dpr;gl.viewport(0,0,canvas.width,canvas.height);if(reduced.matches)render();}
function render(){gl.uniform1f(time,(performance.now()-startTime)/1000*.6);gl.uniform2f(resolution,canvas.width,canvas.height);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!reduced.matches)requestAnimationFrame(render);}
resize();window.addEventListener('resize',resize);render();

}catch(e){console.error(e);}})();
// EDITE SEUS PROJETOS AQUI: nome, descrição, imagem e link.
// Imagem: caminho dentro de assets/ ou URL completa. Link: endereço https:// do site.
// Os cartões adicionais são exemplos; substitua-os pelos seus projetos reais.
const portfolioProjects = [
  { title: '', description: 'Prili Cosméticos', imageSrc: 'assets/prili_cosmeticos.png', href: 'https://prilicosmeticos.netlify.app/', tag: '' },
  { title: '', description: 'Brasa Burguer', imageSrc: 'assets/Burguer.png', href: 'https://brasahambur.netlify.app/', tag: '' },
  { title: '', description: 'Coco Bamboo', imageSrc: 'assets/coco_bamboo.png', href: 'https://cocobamboo.netlify.app/', tag: 'Demonstração' },
  { title: '', description: 'Luxe Mode', imageSrc: 'assets/luxe.png', href: 'https://luxemodeloja.netlify.app/', tag: 'Demonstração' },
 { title: 'Projeto 05', description: 'Projeto demonstrativo para personalizar.', imageSrc: 'assets/media-1.jpg', href: '', tag: 'Demonstração' }
];
// Standalone portfolio: no framework, package install or external dependency.
(() => {
const trigger=document.querySelector('.mobile-menu-button');
const menu=document.getElementById('mobile-menu');
function closeMenu(){if(!menu)return;menu.hidden=true;trigger?.setAttribute('aria-expanded','false');}
trigger?.addEventListener('click',()=>{menu.hidden=!menu.hidden;trigger.setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)menu.querySelector('a')?.focus();});
menu?.querySelector('.menu-close').addEventListener('click',()=>{closeMenu();trigger?.focus();});
document.addEventListener('click',e=>{if(menu&&!menu.contains(e.target)&&!trigger?.contains(e.target))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();trigger?.focus();}});
window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMenu();});
const tabs=[...document.querySelectorAll('.portfolio-tab')];
const panel=document.querySelector('[role="tabpanel"]');
const projectsMarkup=panel?.innerHTML;
function selectTab(tab){tabs.forEach(t=>t.setAttribute('aria-selected',String(t===tab)));panel.id=tab.getAttribute('aria-controls');panel.setAttribute('aria-labelledby',tab.id);panel.innerHTML=tab.id==='projects-tab'?projectsMarkup:document.getElementById('concept-template').innerHTML;initStack();}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];selectTab(next);next.focus();}});});
function initStack(){
const stack=document.querySelector('[data-project-stack]');
const stage=document.querySelector('.stack-stage');if(!stage)return;
if(!stack)return; // Keep the visual-concept panel unchanged.
let active=0, startX=null, swiped=false;
const dotContainer=stack.querySelector('.stack-dots');
portfolioProjects.forEach((item,i)=>{
 const card=document.createElement('article');card.className='stack-card';
 const image=document.createElement('img');image.src=item.imageSrc;image.alt=item.title;image.draggable=false;card.append(image);
 const caption=document.createElement('div');caption.className='stack-caption';
 const tag=document.createElement('div');tag.className='eyebrow';tag.textContent=item.tag||'';caption.append(tag);
 const title=document.createElement('h2');title.textContent=item.title;caption.append(title);
 const description=document.createElement('p');description.textContent=item.description||'';caption.append(description);
 const link=document.createElement('a');link.className='project-site-button';link.textContent='Acessar site ↗';
 let url;try{url=new URL(item.href);}catch{}
 if(url&&['https:','http:'].includes(url.protocol)){link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';}
 else{link.setAttribute('aria-disabled','true');link.title='Link ainda não cadastrado';}
 caption.append(link);card.append(caption);stage.append(card);
 card.addEventListener('click',e=>{if(!e.target.closest('a')&&!swiped){active=i;update();}});
 const dot=document.createElement('button');dot.type='button';dot.className='stack-dot';dot.setAttribute('aria-label',`Mostrar ${item.title}`);dot.title=item.title;dot.addEventListener('click',()=>{active=i;update();});dotContainer.append(dot);
});
const cards=[...stage.querySelectorAll('.stack-card')];const dots=[...dotContainer.children];
function update(){cards.forEach((card,i)=>{
 let offset=i-active;if(offset>cards.length/2)offset-=cards.length;if(offset<-cards.length/2)offset+=cards.length;
 const abs=Math.abs(offset),on=offset===0;
 card.style.setProperty('--fan-offset',offset);card.style.setProperty('--fan-distance',abs);
 card.style.setProperty('--fan-scale',on?'1.03':'.94');card.style.setProperty('--fan-lift',on?'-22px':'0px');card.style.setProperty('--fan-tilt',on?'0deg':'12deg');card.style.zIndex=String(100-abs);
 card.hidden=abs>3;card.classList.toggle('is-active',on);
 card.setAttribute('aria-label',`${portfolioProjects[i].title}, ${i+1} de ${cards.length}`);
 card.querySelectorAll('a').forEach(a=>a.tabIndex=on&&a.hasAttribute('href')?0:-1);
});dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===active)));
stack.querySelector('.stack-status').textContent=cards.length?`${active+1} / ${cards.length} · ${portfolioProjects[active].title}`:'Nenhum projeto cadastrado';
stack.querySelectorAll('.stack-arrow').forEach(button=>button.disabled=cards.length<2);
}
function step(n){if(!cards.length)return;active=(active+n+cards.length)%cards.length;update();}
stack.querySelector('[aria-label="Projeto anterior"]').addEventListener('click',()=>step(-1));
stack.querySelector('[aria-label="Próximo projeto"]').addEventListener('click',()=>step(1));
stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}});
stage.addEventListener('pointerdown',e=>{swiped=false;if(!e.target.closest('a')){startX=e.clientX;stage.setPointerCapture(e.pointerId);}});
stage.addEventListener('pointerup',e=>{if(startX!==null&&Math.abs(e.clientX-startX)>60){swiped=true;step(e.clientX<startX?1:-1);}startX=null;});
stage.addEventListener('pointercancel',()=>startX=null);
update();}

initStack();
// Número público de contato, com código do país e DDD.
const whatsappNumber = '5519999867459';
const serviceMessages = {
 'institucional': 'um site institucional',
 'landing-page': 'uma landing page',
 'manutencao': 'manutenção para meu site'
};
const form = document.getElementById('contact-form');
if (form) {
 const nameInput = form.querySelector('#nome');
 const output = form.querySelector('#whatsapp-preview');
 const error = form.querySelector('#contact-error');
 const params = new URLSearchParams(window.location.search);
 const requested = params.get('servico');
 if (Object.hasOwn(serviceMessages, requested || '')) {
  const radio = [...form.querySelectorAll('[name="servico"]')].find(input => input.value === requested);
  if (radio) radio.checked = true;
 }
 function getName() { return nameInput.value.trim().replace(/\s+/g, ' '); }
 function getService() { return form.querySelector('[name="servico"]:checked')?.value; }
 function message(name, service) {
  return `Olá João, eu sou a ${name}, e quero ${serviceMessages[service] || '(escolha o serviço)'}, quero saber como funciona!`;
 }
 function preview() {
  nameInput.setCustomValidity('');
  error.hidden = true;
  output.textContent = message(getName() || '(seu nome)', getService());
 }
 form.addEventListener('input', preview);
 form.addEventListener('change', preview);
 form.addEventListener('submit', event => {
  event.preventDefault();
  const name = getName();
  const service = getService();
  if (name.length < 2 || name.length > 80 || !/^[\p{L}\p{M} .’'\-]+$/u.test(name) || !/\p{L}/u.test(name)) {
   nameInput.setCustomValidity('Informe um nome válido, com 2 a 80 caracteres.');
   error.textContent = 'Informe seu nome usando letras, espaços, apóstrofos ou hífens.';
   error.hidden = false;
   nameInput.reportValidity();
   return;
  }
  if (!Object.hasOwn(serviceMessages, service || '') || !form.reportValidity()) return;
  if (!/^55\d{10,11}$/.test(whatsappNumber)) return;
  output.textContent = message(name, service);
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(output.textContent)}`, '_blank', 'noopener,noreferrer');
 });
 preview();
}
})();
