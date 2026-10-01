const NS='http://www.w3.org/2000/svg';
export function lineChart(values,{minX,maxX,label='',validRange=null,base=null,marker=null,color='#ff754c'}={}){
 const W=660,H=260,L=55,R=18,T=20,B=42,ys=values.map(v=>v.y),minY=Math.min(...ys),maxY=Math.max(...ys),span=maxY-minY||1;
 const x=v=>L+(v-minX)/(maxX-minX)*(W-L-R),y=v=>T+(maxY-v)/span*(H-T-B);let s=`<svg class="svg-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">`;
 if(validRange)s+=`<rect x="${x(validRange[0])}" y="${T}" width="${Math.max(0,x(validRange[1])-x(validRange[0]))}" height="${H-T-B}" fill="#ff754c" opacity=".12"/>`;
 s+=`<path d="M${L} ${H-B}H${W-R}M${L} ${T}V${H-B}" stroke="#ffffff28" fill="none"/>`;
 s+=`<polyline points="${values.map(v=>`${x(v.x)},${y(v.y)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
 if(base)s+=`<circle cx="${x(base.x)}" cy="${y(base.y)}" r="5" fill="#f3eee4" stroke="${color}" stroke-width="3"/>`;
 if(marker){const mx=x(marker.x);s+=`<line x1="${mx}" y1="${T}" x2="${mx}" y2="${H-B}" stroke="#fff" stroke-dasharray="4 5" opacity=".5"/><circle cx="${mx}" cy="${y(marker.y)}" r="8" fill="#fff" stroke="${color}" stroke-width="3"/>`;}
 s+=`<text x="${L}" y="${H-12}" fill="#a99f94" font-size="10">${minX} ${label}</text><text x="${W-R}" y="${H-12}" fill="#a99f94" font-size="10" text-anchor="end">${maxX}</text><text x="${L}" y="${T+11}" fill="#a99f94" font-size="10">S/ ${maxY.toFixed(1)}</text><text x="${L}" y="${H-B-4}" fill="#a99f94" font-size="10">S/ ${minY.toFixed(1)}</text></svg>`;return s;
}
export function bars(items,{max=null,baseColor='#ff754c'}={}){const scale=max||Math.max(1,...items.map(v=>Math.abs(v.value)));return `<div class="chart-bars">${items.map(v=>`<div class="bar-row"><span>${v.label}</span><span class="track"><i class="fill ${v.class||''}" style="width:${Math.min(100,Math.abs(v.value)/scale*100)}%;background:${v.color||baseColor}"></i></span><b>${v.text??v.value}</b></div>`).join('')}</div>`;}
export function flowSvg(plan,costs,suppliers,stores,id='flow'){
 const W=760,H=390,x1=130,x2=620,ys=[78,190,302],out=[`<svg id="${id}" class="svg-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Red de distribución de proveedores a locales">`];
 plan.forEach((row,i)=>row.forEach((q,j)=>{if(!q)return;const cost=costs[i][j],color=cost<1?'#ff754c':cost>=5?'#bd5438':'#e7a64c',y2=ys[j],width=2+q*1.25;out.push(`<path class="flow-link" d="M${x1} ${ys[i]} C330 ${ys[i]},430 ${y2},${x2} ${y2}" stroke="${color}" stroke-width="${width}"/><text class="flow-label" x="375" y="${(ys[i]+y2)/2-7}" text-anchor="middle">${q} sacos · S/ ${cost}/saco</text>`);}));
 suppliers.forEach((p,i)=>out.push(`<circle cx="${x1}" cy="${ys[i]}" r="31" fill="#24221e" stroke="#ff754c"/><text class="flow-label" x="${x1}" y="${ys[i]-3}" text-anchor="middle">${p.name}</text><text class="flow-label" x="${x1}" y="${ys[i]+13}" text-anchor="middle">oferta ${p.supply}</text>`));
 stores.forEach((p,i)=>out.push(`<rect x="${x2-44}" y="${ys[i]-31}" width="88" height="62" rx="12" fill="#26211b" stroke="#e7a64c"/><text class="flow-label" x="${x2}" y="${ys[i]-3}" text-anchor="middle">${p.name}</text><text class="flow-label" x="${x2}" y="${ys[i]+13}" text-anchor="middle">demanda ${p.demand}</text>`));
 return out.join('')+'</svg>';
}
export function cycleSvg(labels,delta){return `<svg class="svg-chart" viewBox="0 0 600 170" role="img" aria-label="Ciclo de transporte con cambio de costo ${delta} por saco"><path d="M80 45H520V130H80Z" fill="none" stroke="#ff754c" stroke-width="3" stroke-dasharray="7 6"/><text x="80" y="30" fill="#e7a64c">+</text><text x="520" y="30" fill="#bd5438">−</text><text x="520" y="153" fill="#e7a64c">+</text><text x="80" y="153" fill="#bd5438">−</text><text x="300" y="93" fill="#f4eee6" font-size="16" text-anchor="middle">Δ = ${delta} S/ por saco</text><text x="300" y="165" fill="#a99f94" font-size="10" text-anchor="middle">${labels.join(' → ')}</text></svg>`;}
