import{n as e,t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./api-zg8Q53Gv.js";var i,a=e((()=>{i=`<header\r
  class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10 bg-[#FFFFFF]"\r
>\r
  <a\r
    href="#"\r
    data-navbar-home\r
    class="font-display text-xl font-extrabold tracking-tight"\r
    ><img data-navbar-logo alt="Logo" class="h-10 w-auto"\r
  /></a>\r
  <nav\r
    class="hidden items-center gap-8 text-sm font-medium text-muted md:flex"\r
    aria-label="Main navigation"\r
  >\r
    <a class="transition hover:text-ink" href="#" data-navbar-home>Home</a>\r
    <a class="transition hover:text-ink" href="#" data-navbar-commercial\r
      >Commercial</a\r
    >\r
    <a class="transition hover:text-ink" href="#" data-navbar-residential\r
      >Residential</a\r
    >\r
    <a class="transition hover:text-ink" href="#" data-navbar-new-launch-project\r
      >New Launch Project</a\r
    >\r
    <a class="transition hover:text-ink" href="#" data-navbar-about>About Me</a>\r
    <a class="transition hover:text-ink" href="#" data-navbar-contact\r
      >Contact Me</a\r
    >\r
  </nav>\r
  <button\r
    type="button"\r
    data-login-open\r
    data-dashboard-action\r
    class="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-muted"\r
    aria-haspopup="dialog"\r
    aria-controls="login-dialog"\r
  >\r
    Login\r
  </button>\r
\r
  <div\r
    data-login-dialog\r
    id="login-dialog"\r
    class="fixed inset-0 z-50 hidden items-center justify-center bg-ink/40 px-6 backdrop-blur-sm"\r
    role="dialog"\r
    aria-modal="true"\r
    aria-labelledby="login-dialog-title"\r
    aria-hidden="true"\r
  >\r
    <div class="relative w-full max-w-sm rounded-2xl bg-paper p-8 shadow-2xl">\r
      <button\r
        type="button"\r
        data-login-close\r
        class="absolute right-5 top-5 text-2xl leading-none text-muted transition hover:text-ink"\r
        aria-label="Close login dialog"\r
      >\r
        &times;\r
      </button>\r
      <h2 id="login-dialog-title" class="font-display text-2xl font-extrabold">\r
        Login\r
      </h2>\r
      <form data-login-form class="mt-6 space-y-4">\r
        <div>\r
          <label for="login-email" class="mb-2 block text-sm font-medium"\r
            >Email</label\r
          >\r
          <input\r
            id="login-email"\r
            name="email"\r
            type="email"\r
            autocomplete="email"\r
            required\r
            class="w-full rounded-lg border border-muted/30 bg-white px-4 py-3 outline-none transition focus:border-ink"\r
          />\r
        </div>\r
        <div>\r
          <label for="login-password" class="mb-2 block text-sm font-medium"\r
            >Password</label\r
          >\r
          <input\r
            id="login-password"\r
            name="password"\r
            type="password"\r
            autocomplete="current-password"\r
            required\r
            class="w-full rounded-lg border border-muted/30 bg-white px-4 py-3 outline-none transition focus:border-ink"\r
          />\r
        </div>\r
        <button\r
          type="submit"\r
          class="w-full rounded-lg bg-ink px-4 py-3 font-semibold text-paper transition hover:bg-muted"\r
        >\r
          Login\r
        </button>\r
      </form>\r
    </div>\r
  </div>\r
</header>\r
`})),o=t((()=>{a(),n();var e=document.querySelectorAll(`[data-navbar]`);if(e.length===0)throw Error(`Navbar mount point not found.`);var t=`/Meng-Yen-Page/`,o=window.location.pathname.includes(t)?t:new URL(`/Meng-Yen-Page/`,window.location.origin).pathname,s=(window.location.pathname.split(o)[1]||``).split(`/`).filter(Boolean);s.at(-1)?.endsWith(`.php`)&&s.pop();var c=o,l=s.at(-1)===`dashboard`;e.forEach(e=>{e.innerHTML=i;let t=e.querySelector(`[data-navbar-logo]`),n=e.querySelectorAll(`[data-navbar-home]`),a=e.querySelector(`[data-navbar-commercial]`),o=e.querySelector(`[data-navbar-residential]`),s=e.querySelector(`[data-navbar-new-launch-project]`),u=e.querySelector(`[data-navbar-about]`),d=e.querySelector(`[data-navbar-contact]`);t.src=`${c}assets/image/Company%20Logo.jpg`,n.forEach(e=>{e.href=`${c}index.php`}),a.href=`${c}commercial/index.php`,o.href=`${c}residential/index.php`,s.href=`${c}new_launch_project/index.php`,u.href=`${c}about/index.php`,d.href=`${c}contact/index.php`;let f=e.querySelector(`[data-login-dialog]`),p=e.querySelector(`[data-login-open]`),m=e.querySelector(`[data-login-close]`),h=e.querySelector(`[data-login-form]`),g=`login`,_=()=>{window.location.href=`${c}dashboard/`},v=()=>{f.classList.add(`hidden`),f.classList.remove(`flex`),f.setAttribute(`aria-hidden`,`true`),p.focus()},y=()=>{f.classList.remove(`hidden`),f.classList.add(`flex`),f.setAttribute(`aria-hidden`,`false`),f.querySelector(`input`).focus()};p.addEventListener(`click`,y);let b=e=>{let t=l&&e?`logout`:e?`dashboard`:`login`;if(g!==t){if(g=t,p.removeEventListener(`click`,_),p.removeEventListener(`click`,y),e&&!l){p.textContent=`Dashboard`,p.removeAttribute(`data-login-open`),p.removeAttribute(`aria-haspopup`),p.removeAttribute(`aria-controls`),p.addEventListener(`click`,_);return}if(l&&e){p.textContent=`Log out`,p.dataset.logout=``,p.removeAttribute(`data-login-open`),p.removeAttribute(`aria-haspopup`),p.removeAttribute(`aria-controls`);return}}};m.addEventListener(`click`,v),f.addEventListener(`click`,e=>{e.target===f&&v()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&f.getAttribute(`aria-hidden`)===`false`&&v()}),h.addEventListener(`submit`,async e=>{e.preventDefault();let t=h.elements.email.value.trim(),n=h.elements.password.value,i=h.querySelector(`button[type='submit']`);if(t&&n){i.disabled=!0,i.textContent=`Logging in...`;try{await r.login(t,n)}catch{alert(`Invalid username or password.`),i.disabled=!1,i.textContent=`Login`;return}window.location.href=`${c}dashboard/`}}),r.session().then(({user:e})=>b(e)).catch(()=>b(null))})}));export default o();