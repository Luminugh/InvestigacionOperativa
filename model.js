export const products=['Maki Acevichado','Maki California','Maki Furai','Maki Salmón','Maki Tokyo Roll','Ramen Especial','Ramen Clásico'];
export const prices=[22,20,25,30,28,30,15];
export const mixes={eficaz:[5,0,5,12,0,15,0],eficiente:[10,1,5,4,1,9,12]};
export const resources=[
 {name:'Salsas',unit:'L',cap:3,a:[.08,.04,.06,.04,.07,0,0]},
 {name:'Arroz',unit:'g',cap:5500,a:[250,250,250,250,250,0,0]},
 {name:'Salmón',unit:'porciones',cap:30,a:[1,0,0,1,1,0,0]},
 {name:'Langostino',unit:'unidades',cap:70,a:[3,3,3,3,3,0,0]},
 {name:'Fideos',unit:'unidades',cap:30,a:[0,0,0,0,0,1,1]},
 {name:'Palta',unit:'porciones',cap:100,a:[3,3,3,3,3,0,0]},
 {name:'Queso crema',unit:'porciones',cap:100,a:[3,3,3,3,3,0,0]},
 {name:'Cerdo',unit:'porciones',cap:50,a:[0,0,0,0,0,3,0]},
 {name:'Tiempo',unit:'min',cap:500,a:[10,10,15,12,12,15,10]}];
export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export function evaluate(x,limit=500){const usage=resources.map(r=>({...r,cap:r.name==='Tiempo'?limit:r.cap,used:dot(r.a,x)}));return {income:dot(prices,x),units:x.reduce((a,b)=>a+b,0),variety:x.filter(v=>v>0).length,usage,feasible:usage.every(r=>r.used<=r.cap+1e-8)&&x.every(v=>Number.isInteger(v)&&v>=0)&&x[0]>=5&&x[2]>=5&&x[5]>=(limit===400?5:3)};}
export function status(r){const p=r.used/r.cap;return p>1+1e-8?'Excedido':p>=.95?'Crítico':p>=.8?'Alto':p>=.5?'Medio':'Bajo';}
