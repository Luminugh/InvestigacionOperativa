import {initPage} from '../main.js';
import {transport,transportCost} from '../data.js';
import {solveLP} from '../lp.js';
import {flowSvg} from '../charts.js';
import {burst} from '../background3d.js';
import {decorateHero} from '../illustrations.js';

const $=(q,r=document)=>r.querySelector(q),fmt=(n,d=2)=>new Intl.NumberFormat('es-PE',{maximumFractionDigits:d}).format(n);
decorateHero('transport');
const close=(a,b)=>Math.abs(a-b)<1e-7;
function solveTransport(costs=transport.costs){const c=costs.flat(),constraints=[];transport.suppliers.forEach((p,i)=>constraints.push({a:c.map((_,k)=>Math.floor(k/3)===i?1:0),b:p.supply,sense:'='}));transport.stores.forEach((p,j)=>constraints.push({a:c.map((_,k)=>k%3===j?1:0),b:p.demand,sense:'='}));const r=solveLP({objective:c,constraints,sense:'min'});return r.estado==='optimo'?{...r,plan:Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>r.x[i*3+j]))}:r;}
const sum=a=>a.reduce((x,y)=>x+y,0);

function setupProblem(){const host=$('#cost-matrix');host.innerHTML=`<div class="matrix-head">ORIGEN ↓ / DESTINO →</div>${transport.stores.map((s,j)=>`<div class="matrix-head" data-dest="${j}" tabindex="0">${s.name}<br>Demanda ${s.demand}</div>`).join('')}${transport.suppliers.map((p,i)=>`<div class="matrix-label" data-origin="${i}" tabindex="0">${p.name}<br>Oferta ${p.supply}</div>${transport.costs[i].map((c,j)=>`<button class="cost-cell ${c>=5?'expensive':''}" data-cost-cell="${i},${j}" aria-label="${p.name} a ${transport.stores[j].name}, S/ ${c} por saco"><span>S/ ${c}</span></button>`).join('')}`).join('')}`;
 const detail=(text)=>$('#matrix-narrator').textContent=text;host.querySelectorAll('[data-origin]').forEach(el=>{const f=()=>detail(`${transport.suppliers[+el.dataset.origin].name} puede entregar ${transport.suppliers[+el.dataset.origin].supply} sacos.`);el.onpointerenter=f;el.onclick=f;el.onfocus=f;});host.querySelectorAll('.matrix-head[data-dest]').forEach(el=>{const f=()=>detail(`${transport.stores[+el.dataset.dest].name} requiere ${transport.stores[+el.dataset.dest].demand} sacos.`);el.onpointerenter=f;el.onclick=f;el.onfocus=f;});
 $('#cheapest-routes').onclick=()=>{const cheapest=transport.stores.map((_,j)=>Math.min(...transport.costs.map(r=>r[j])));host.querySelectorAll('[data-cost-cell]').forEach(el=>{const[,j]=el.dataset.costCell.split(',').map(Number);el.classList.toggle('selected',transport.costs[Number(el.dataset.costCell.split(',')[0])][j]===cheapest[j]);});detail('Rutas de menor tarifa iluminadas. La disponibilidad de oferta también condiciona el plan.');};$('#supply-demand').innerHTML=`<div class="stat"><b>20</b><span>SACOS OFERTADOS</span></div><div class="stat"><b>20</b><span>SACOS DEMANDADOS</span></div>`;}

let allocation=Array.from({length:3},()=>[0,0,0]);
function renderAllocation(){
 const rows=allocation.map(sum),cols=[0,1,2].map(j=>sum(allocation.map(r=>r[j]))),cost=transportCost(allocation),total=sum(rows);
 const matrix=`<div class="transport-matrix allocation-grid" role="group" aria-label="Asignaciones de sacos por proveedor y local">
  <div class="matrix-head">PROVEEDOR<br><span>oferta</span></div>
  ${transport.stores.map((s,j)=>`<div class="matrix-head">${s.name}<br><span>demanda ${s.demand} · recibido ${cols[j]}</span></div>`).join('')}
  <div class="matrix-head">TOTAL ENVIADO</div>
  ${allocation.map((row,i)=>`<div class="matrix-label"><strong>${transport.suppliers[i].name}</strong><br><span>disponible ${transport.suppliers[i].supply}</span></div>
    ${row.map((value,j)=>{const route=transport.costs[i][j],rowFull=rows[i]>=transport.suppliers[i].supply,colFull=cols[j]>=transport.stores[j].demand;return `<div class="cost-cell allocation-cell" aria-label="Ruta ${transport.suppliers[i].name} a ${transport.stores[j].name}"><span class="route-rate">Tarifa <strong>S/ ${fmt(route)}</strong> por saco</span><div class="cell-control"><button data-assign="${i},${j},-1" aria-label="Quitar 1 saco de ${transport.suppliers[i].name} a ${transport.stores[j].name}" ${value===0?'disabled':''}>−</button><b aria-live="polite">${value}</b><button data-assign="${i},${j},1" aria-label="Agregar 1 saco de ${transport.suppliers[i].name} a ${transport.stores[j].name}" ${rowFull||colFull?'disabled':''}>+</button></div></div>`;}).join('')}
    <div class="matrix-total">${rows[i]} <span>/ ${transport.suppliers[i].supply}</span></div>`).join('')}
 </div>`;
 const mobile=allocation.map((row,i)=>`<div class="mobile-provider"><h3>${transport.suppliers[i].name} <small>${rows[i]} / ${transport.suppliers[i].supply} sacos enviados</small></h3>${row.map((value,j)=>{const from=transport.suppliers[i].name,to=transport.stores[j].name,rate=transport.costs[i][j],full=rows[i]>=transport.suppliers[i].supply||cols[j]>=transport.stores[j].demand;return `<div class="mobile-route"><div><strong>${to}</strong><span>S/ ${fmt(rate)} por saco · recibido ${cols[j]} / ${transport.stores[j].demand}</span></div><div class="cell-control"><button data-assign="${i},${j},-1" aria-label="Quitar 1 saco de ${from} a ${to}" ${value===0?'disabled':''}>−</button><b>${value}</b><button data-assign="${i},${j},1" aria-label="Agregar 1 saco de ${from} a ${to}" ${full?'disabled':''}>+</button></div></div>`;}).join('')}</div>`).join('');
 $('#allocation-matrix').innerHTML=`<p class="allocation-instructions">Cada celda es una ruta. Usa <strong>+</strong> y <strong>−</strong> para asignar sacos; el número muestra cuántos enviar. El costo de una ruta es <strong>sacos × tarifa por saco</strong>.</p><div class="allocation-scroll">${matrix}</div><div class="mobile-route-list">${mobile}</div>`;
 const feasible=rows.every((v,i)=>v===transport.suppliers[i].supply)&&cols.every((v,j)=>v===transport.stores[j].demand),optimal=feasible&&close(cost,35);
 $('#live-cost').textContent=`S/ ${fmt(cost)}`;
 $('#tank-status').innerHTML=`<div class="balance-group"><strong>Oferta enviada</strong><div class="pill-row">${rows.map((v,i)=>`<span class="pill ${v===transport.suppliers[i].supply?'balanced':''}">${transport.suppliers[i].name}: ${v} / ${transport.suppliers[i].supply} sacos</span>`).join('')}</div></div><div class="balance-group"><strong>Demanda recibida</strong><div class="pill-row">${cols.map((v,j)=>`<span class="pill ${v===transport.stores[j].demand?'balanced':''}">${transport.stores[j].name}: ${v} / ${transport.stores[j].demand} sacos</span>`).join('')}</div></div>`;
 $('#distance-bar').style.width=`${total/20*100}%`;
 $('#distance-bar').parentElement.setAttribute('role','progressbar');$('#distance-bar').parentElement.setAttribute('aria-label','Sacos asignados');$('#distance-bar').parentElement.setAttribute('aria-valuemin','0');$('#distance-bar').parentElement.setAttribute('aria-valuemax','20');$('#distance-bar').parentElement.setAttribute('aria-valuenow',String(total));
 $('#distance-bar').closest('.card').querySelector('.micro').textContent=`Avance: ${total} de 20 sacos asignados · costo mínimo de referencia: S/ 35.00.`;
 const missing=cols.map((v,j)=>({name:transport.stores[j].name,left:transport.stores[j].demand-v})).filter(x=>x.left>0);
 $('#allocation-narrator').textContent=optimal?'¡Plan óptimo! Se cubrió toda la oferta y la demanda al menor costo: S/ 35.00.':feasible?`Plan completo. Costo: S/ ${fmt(cost)}; el menor costo posible es S/ 35.00.`:missing.length?`Aún faltan ${missing.map(x=>`${x.name}: ${x.left} sacos`).join(' · ')}. Completa esos destinos sin superar la oferta de cada proveedor.`:'La oferta está asignada. Revisa que cada local reciba su demanda exacta.';
 if(optimal&&!renderAllocation.celebrated){burst(.5,.5);renderAllocation.celebrated=true;}if(!optimal)renderAllocation.celebrated=false;
 $('#allocation-matrix').querySelectorAll('[data-assign]').forEach(button=>button.onclick=()=>{const[i,j,delta]=button.dataset.assign.split(',').map(Number),next=allocation[i][j]+delta;if(next>=0&&sum(allocation[i])+delta<=transport.suppliers[i].supply&&sum(allocation.map(r=>r[j]))+delta<=transport.stores[j].demand){allocation[i][j]=next;renderAllocation();}});
}
function setAllocation(plan){allocation=plan.map(r=>[...r]);renderAllocation();}
function setupBuilder(){
 $('#construye h2').textContent='Asignación de sacos por ruta';
 $('#construye .subtitle').textContent='Elige cuántos sacos enviar desde cada proveedor a cada local. Respeta la oferta y la demanda; cada envío suma sacos × tarifa.';
 $('#reset-plan').textContent='Vaciar asignación';$('#load-excel').textContent='Cargar plan del Excel · S/ 35.50';$('#reveal-optimal').textContent='Cargar plan óptimo · S/ 35';
 $('#reset-plan').onclick=()=>setAllocation(Array.from({length:3},()=>[0,0,0]));$('#load-excel').onclick=()=>setAllocation(transport.plans.excel);$('#reveal-optimal').onclick=()=>setAllocation(transport.plans.optimalA);
renderAllocation();
}




function setupCosts(){let costs=transport.costs.map(r=>[...r]);const control=$('#cost-controls');function render(){control.innerHTML=costs.map((r,i)=>r.map((v,j)=>`<label class="control">${transport.suppliers[i].name} → ${transport.stores[j].name}<output>S/ ${fmt(v)}</output><input class="range" type="range" min="0" max="8" step=".5" value="${v}" data-tariff="${i},${j}"></label>`).join('')).join('');control.querySelectorAll('[data-tariff]').forEach(el=>el.oninput=()=>{const[i,j]=el.dataset.tariff.split(',').map(Number);costs[i][j]=+el.value;el.previousElementSibling.textContent=`S/ ${fmt(el.value)}`;show();});show();}function show(presetText=''){const r=solveTransport(costs),base=solveTransport(),same=r.plan.every((row,i)=>row.every((v,j)=>close(v,base.plan[i][j])));$('#transport-scenario').textContent=`Óptimo calculado: S/ ${fmt(r.z)} · ${same?'el plan coincide con el base':'la distribución cambió'} · variación frente a S/ 35: ${r.z>=35?'+':''}S/ ${fmt(r.z-35)}. ${presetText}`;$('#scenario-flow').innerHTML=flowSvg(r.plan,costs,transport.suppliers,transport.stores,'scenario-flow-svg');$('#scenario-plan').innerHTML=`<table class="data-table"><thead><tr><th>Proveedor / Local</th>${transport.stores.map(s=>`<th>${s.name}</th>`).join('')}</tr></thead><tbody>${r.plan.map((row,i)=>`<tr><th>${transport.suppliers[i].name}</th>${row.map(v=>`<td>${fmt(v,3)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;$('#preset-narrator').textContent=presetText||'La modificación de tarifa ya se reflejó en el plan reoptimizado.';}
 $('#reset-costs').onclick=()=>{costs=transport.costs.map(r=>[...r]);render();};const presets=[['Metro → Chilca S/ 3',1,1,3,'Chilca pierde su ruta barata; todas cuestan S/ 3.'],['Macro → El Tambo S/ 1',0,0,1,'Ahorro S/ 16: ocho sacos ahorran S/ 2 cada uno.'],['Metro → El Tambo S/ 2',1,0,2,'Se vuelve atractivo abastecer El Tambo desde Metro.'],['Macro → Grau S/ 3',0,2,3,'La ruta sin uso cambia de tarifa; el costo puede mantenerse.']];$('#transport-presets').innerHTML=presets.map(p=>`<button class="button">${p[0]}</button>`).join('');$('#transport-presets').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{costs=transport.costs.map(r=>[...r]);const[,f,j,v,narr]=presets[i];costs[f][j]=v;render();show(narr);$('#escenarios').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});render();}

setupProblem();setupBuilder();setupCosts();
initPage({palette:[1,.39,.22],count:450,cameras:[[0,0,9],[.5,.3,8],[-.5,.5,7],[.5,-.2,8],[0,.3,7],[-.3,.2,8],[.3,.1,7],[0,0,9]]});
