import{i as e,n as t,r as n,t as r}from"./supabase-CL3eS8N3.js";var i,a=e((()=>{i=`<header\r
  class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"\r
>\r
  <a\r
    href="#"\r
    data-navbar-home\r
    class="font-display text-xl font-extrabold tracking-tight"\r
    >Meng-Yen<span class="text-muted">.</span></a\r
  >\r
  <nav\r
    class="hidden items-center gap-8 text-sm font-medium text-muted md:flex"\r
    aria-label="Main navigation"\r
  >\r
    <a class="transition hover:text-ink" href="#" data-navbar-home\r
      >Home</a\r
    >\r
    <a\r
      class="transition hover:text-ink"\r
      href="#"\r
      data-navbar-commercial\r
      >Commercial</a\r
    >\r
    <a\r
      class="transition hover:text-ink"\r
      href="#"\r
      data-navbar-residential\r
      >Residential</a\r
    >\r
    <a\r
      class="transition hover:text-ink"\r
      href="#"\r
      data-navbar-new-launch-project\r
      >New Launch Project</a\r
    >\r
    <a class="transition hover:text-ink" href="#" data-navbar-about>About Me</a>\r
    <a class="transition hover:text-ink" href="#" data-navbar-contact>Contact Me</a>\r
  </nav>\r
  <button\r
    type="button"\r
    data-login-open\r
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
`})),o=n((()=>{a(),r();var e=document.querySelectorAll(`[data-navbar]`);if(e.length===0)throw Error(`Navbar mount point not found.`);var n=window.location.pathname.split(`/`).filter(Boolean),o=n.at(-1);(o===`index.html`||o===`index.php`)&&n.pop();var s=`../`.repeat(n.length);e.forEach(e=>{e.innerHTML=i;let n=e.querySelectorAll(`[data-navbar-home]`),r=e.querySelector(`[data-navbar-commercial]`),a=e.querySelector(`[data-navbar-residential]`),o=e.querySelector(`[data-navbar-new-launch-project]`),c=e.querySelector(`[data-navbar-about]`),l=e.querySelector(`[data-navbar-contact]`);n.forEach(e=>{e.href=`${s}index.html`}),r.href=`${s}commercial/index.html`,a.href=`${s}residential/index.html`,o.href=`${s}new_launch_project/index.html`,c.href=`${s}about/index.html`,l.href=`${s}contact/index.html`;let u=e.querySelector(`[data-login-dialog]`),d=e.querySelector(`[data-login-open]`),f=e.querySelector(`[data-login-close]`),p=e.querySelector(`[data-login-form]`),m=()=>{u.classList.add(`hidden`),u.classList.remove(`flex`),u.setAttribute(`aria-hidden`,`true`),d.focus()};d.addEventListener(`click`,()=>{u.classList.remove(`hidden`),u.classList.add(`flex`),u.setAttribute(`aria-hidden`,`false`),u.querySelector(`input`).focus()}),f.addEventListener(`click`,m),u.addEventListener(`click`,e=>{e.target===u&&m()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&u.getAttribute(`aria-hidden`)===`false`&&m()}),p.addEventListener(`submit`,async e=>{e.preventDefault();let n=p.elements.email.value.trim(),r=p.elements.password.value,i=p.querySelector(`button[type='submit']`);if(!n||!r)return;i.disabled=!0,i.textContent=`Logging in...`;let{error:a}=await t.auth.signInWithPassword({email:n,password:r});if(a){alert(`Invalid username or password.`),i.disabled=!1,i.textContent=`Login`;return}window.location.href=`${s}dashboard/`})})}));export{o as t};