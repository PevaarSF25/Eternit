var e=4e3,t=400,n={success:`check-circle`,error:`x-circle`,info:`info`},r={success:{bg:`rgba(6, 214, 160, 0.15)`,border:`#06d6a0`,icon:`#06d6a0`},error:{bg:`rgba(239, 71, 111, 0.15)`,border:`#ef476f`,icon:`#ef476f`},info:{bg:`rgba(0, 180, 216, 0.15)`,border:`#00b4d8`,icon:`#00b4d8`}};function i(){let e=document.querySelector(`.toast-container`);return e||(e=document.createElement(`div`),e.className=`toast-container`,document.body.appendChild(e)),Object.assign(e.style,{position:`fixed`,top:`24px`,right:`24px`,zIndex:`9999`,display:`flex`,flexDirection:`column`,gap:`12px`,pointerEvents:`none`}),e}function a(a,s=`info`){let c=i(),l=r[s]||r.info,u=n[s]||n.info,d=document.createElement(`div`);d.className=`toast toast-${s}`,Object.assign(d.style,{display:`flex`,alignItems:`center`,gap:`12px`,padding:`14px 20px`,borderRadius:`10px`,background:l.bg,border:`1px solid ${l.border}`,color:`#ffffff`,fontSize:`14px`,fontFamily:`'Inter', sans-serif`,minWidth:`280px`,maxWidth:`420px`,boxShadow:`0 8px 32px rgba(0,0,0,0.3)`,backdropFilter:`blur(10px)`,pointerEvents:`auto`,opacity:`0`,transform:`translateX(40px)`,transition:`opacity ${t}ms ease, transform ${t}ms ease`}),d.innerHTML=`
        <i data-lucide="${u}" style="width:20px;height:20px;color:${l.icon};flex-shrink:0;"></i>
        <span style="flex:1;line-height:1.4;">${a}</span>
        <button class="toast-close" style="background:none;border:none;color:#8899aa;cursor:pointer;padding:2px;flex-shrink:0;">
            <i data-lucide="x" style="width:16px;height:16px;"></i>
        </button>
    `,c.appendChild(d),typeof lucide<`u`&&lucide.createIcons({nodes:[d]}),requestAnimationFrame(()=>{d.style.opacity=`1`,d.style.transform=`translateX(0)`}),d.querySelector(`.toast-close`).addEventListener(`click`,()=>o(d));let f=setTimeout(()=>o(d),e);d.addEventListener(`mouseenter`,()=>clearTimeout(f)),d.addEventListener(`mouseleave`,()=>{setTimeout(()=>o(d),1500)})}function o(e){e.dataset.dismissing||(e.dataset.dismissing=`true`,e.style.opacity=`0`,e.style.transform=`translateX(40px)`,setTimeout(()=>{e.remove()},t))}var s=null;function c({title:e,content:t,onConfirm:n,onCancel:r,confirmText:i=`Confirmar`,cancelText:a=`Cancelar`}){return u(),new Promise(o=>{let c=document.createElement(`div`);c.className=`modal-overlay`,Object.assign(c.style,{position:`fixed`,inset:`0`,zIndex:`10000`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`rgba(0, 0, 0, 0.6)`,backdropFilter:`blur(4px)`,opacity:`0`,transition:`opacity 250ms ease`}),c.innerHTML=`
            <div class="modal-dialog" style="
                background: var(--bg-card-solid, #ffffff);
                border: 1px solid var(--border-default, #e2e8f0);
                border-radius: 16px;
                padding: 0;
                min-width: 400px;
                max-width: 520px;
                width: 90%;
                box-shadow: var(--shadow-lg);
                transform: scale(0.85);
                opacity: 0;
                transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease;
            ">
                <div class="modal-header" style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-light, #f1f5f9);
                ">
                    <h3 style="margin:0;color:var(--text-primary, #1e293b);font-size:18px;font-weight:600;">${e}</h3>
                    <button class="modal-close-btn" style="
                        background: none;
                        border: none;
                        color: var(--text-secondary, #64748b);
                        cursor: pointer;
                        padding: 4px;
                        border-radius: 6px;
                        transition: color 200ms;
                    ">
                        <i data-lucide="x" style="width:20px;height:20px;"></i>
                    </button>
                </div>
                <div class="modal-body" style="
                    padding: 24px;
                    color: var(--text-primary, #1e293b);
                    font-size: 14px;
                    line-height: 1.6;
                ">${t}</div>
                <div class="modal-footer" style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    padding: 16px 24px;
                    border-top: 1px solid var(--border-light, #f1f5f9);
                ">
                    <button class="modal-cancel-btn" style="
                        padding: 10px 20px;
                        border-radius: 8px;
                        border: 1px solid var(--border-default, #e2e8f0);
                        background: transparent;
                        color: var(--text-secondary, #64748b);
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 200ms;
                        font-family: 'Inter', sans-serif;
                    ">${a}</button>
                    <button class="modal-confirm-btn" style="
                        padding: 10px 20px;
                        border-radius: 8px;
                        border: none;
                        background: var(--gradient-accent, #2563eb);
                        color: #fff;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 200ms;
                        font-family: 'Inter', sans-serif;
                    ">${i}</button>
                </div>
            </div>
        `,document.body.appendChild(c),s=c,typeof lucide<`u`&&lucide.createIcons({nodes:[c]}),requestAnimationFrame(()=>{c.style.opacity=`1`;let e=c.querySelector(`.modal-dialog`);e.style.transform=`scale(1)`,e.style.opacity=`1`});function l(e){let t=c.querySelector(`.modal-dialog`);c.style.opacity=`0`,t.style.transform=`scale(0.85)`,t.style.opacity=`0`,setTimeout(()=>{c.remove(),s===c&&(s=null)},250),e?n?.():r?.(),o(e)}c.querySelector(`.modal-confirm-btn`).addEventListener(`click`,()=>l(!0)),c.querySelector(`.modal-cancel-btn`).addEventListener(`click`,()=>l(!1)),c.querySelector(`.modal-close-btn`).addEventListener(`click`,()=>l(!1)),c.addEventListener(`click`,e=>{e.target===c&&l(!1)});let u=e=>{e.key===`Escape`&&(document.removeEventListener(`keydown`,u),l(!1))};document.addEventListener(`keydown`,u)})}function l(e,t){return c({title:e,content:`<p style="margin:0;">${t}</p>`,confirmText:`Sí, confirmar`,cancelText:`Cancelar`})}function u(){s&&=(s.remove(),null)}export{c as n,a as r,l as t};