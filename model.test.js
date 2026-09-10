import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evaluate,mixes,status} from './model.js';
test('Las mezclas reproducen las capturas',()=>{const a=evaluate(mixes.eficaz),b=evaluate(mixes.eficiente);assert.equal(a.income,1045);assert.equal(b.income,963);assert.equal(a.usage.at(-1).used,494);assert.equal(b.usage.at(-1).used,500);assert.equal(a.variety,4);assert.equal(b.variety,7);assert.ok(a.feasible&&b.feasible);assert.equal(b.usage[1].used,5250);});
test('400 minutos no permite afirmar factibilidad',()=>{assert.equal(evaluate(mixes.eficaz,400).feasible,false);assert.equal(evaluate(mixes.eficiente,400).feasible,false);});
test('Simular un Salmón adicional revela ambos excesos',()=>{const x=[...mixes.eficaz];x[3]++;const r=evaluate(x);assert.equal(r.income,1075);assert.equal(r.usage[1].used,5750);assert.equal(r.usage.at(-1).used,506);assert.equal(r.feasible,false);});
test('El simulador verifica integridad y mínimos, no solo recursos',()=>{assert.equal(evaluate([0,0,0,0,0,0,0]).feasible,false);assert.equal(evaluate([5,0,5,0,0,3,0]).feasible,true);assert.equal(evaluate([5,0,5,0,0,3,0],400).feasible,false);assert.equal(evaluate([5.5,0,5,0,0,3,0]).feasible,false);});
test('Umbrales se calculan sin redondear',()=>{assert.equal(status({used:66,cap:70}),'Alto');assert.equal(status({used:5250,cap:5500}),'Crítico');assert.equal(status({used:500,cap:400}),'Excedido');});
test('Óptimo entero independiente mediante enumeración y dominancia',()=>{
 // Dominancia: California es peor que Acevichado en ingreso/minuto;
 // Salmón domina Tokyo; salsa, salmón, palta y queso no limitan con <=22 makis.
 // Enumerar X1,X3,X4 y X6,X7 basta para certificar el valor máximo.
 let best=0;
 for(let a=5;a<=17;a++)for(let f=5;f<=22-a;f++)for(let s=0;s<=22-a-f;s++)for(let r=3;r<=16;r++){
 const remaining=500-10*a-15*f-12*s-15*r;if(remaining<0)continue;const c=Math.min(30-r,Math.floor(remaining/10));const z=22*a+25*f+30*s+30*r+15*c;if(z>best)best=z;
 }assert.equal(best,1045);
});
