export const products=['Maki Acevichado','Maki California','Maki Furai','Maki Salmón','Maki Tokyo Roll','Ramen Especial','Ramen Clásico'];
export const prices=[22,20,25,30,28,30,15];
export const baseMix=[5,0,5,12,0,15.4,0];
export const resources=[
 {name:'Salsas',unit:'L',cap:3,a:[.08,.04,.06,.04,.07,0,0]},
 {name:'Arroz',unit:'g',cap:5500,a:[250,250,250,250,250,0,1]},
 {name:'Salmón',unit:'porciones',cap:30,a:[1,0,0,1,1,0,0]},
 {name:'Langostino',unit:'unidades',cap:70,a:[3,3,3,3,3,0,0]},
 {name:'Fideos',unit:'unidades',cap:30,a:[0,0,0,0,0,1,1]},
 {name:'Palta',unit:'porciones',cap:100,a:[3,3,3,3,3,0,0]},
 {name:'Queso crema',unit:'porciones',cap:100,a:[3,3,3,3,3,0,0]},
 {name:'Cerdo',unit:'porciones',cap:50,a:[0,0,0,0,0,3,0]},
 {name:'Tiempo',unit:'min',cap:500,a:[10,10,15,12,12,15,10]}
];
export const demand=[{index:0,value:5,label:'Acevichado'},{index:2,value:5,label:'Furai'},{index:5,value:3,label:'Ramen Especial'}];
export const sensitivityReport={
 objective:1057,
 products:[
  {name:'Acevichado',coef:22,min:0,max:26,reduced:0,solution:5},
  {name:'California',coef:20,min:0,max:26,reduced:-6,solution:0},
  {name:'Furai',coef:25,min:0,max:36,reduced:0,solution:5},
  {name:'Salmón',coef:30,min:28,max:null,reduced:0,solution:12},
  {name:'Tokyo Roll',coef:28,min:0,max:30,reduced:-2,solution:0},
  {name:'Ramen Especial',coef:30,min:22.43,max:37.5,reduced:0,solution:15.4},
  {name:'Ramen Clásico',coef:15,min:0,max:20.02,reduced:-5.02,solution:0}
 ],
 resources:[
  {name:'Tiempo',unit:'min',shadow:2,min:314,max:519},
  {name:'Arroz',unit:'g',shadow:.024,min:5104.17,max:5833.33},
  {name:'Acevichado mínimo',unit:'unid.',shadow:-4,min:0,max:14.5,index:0},
  {name:'Furai mínimo',unit:'unid.',shadow:-11,min:0,max:17,index:2}
 ]
};
export const transport={
 suppliers:[{name:'Macro',supply:8},{name:'Metro',supply:7},{name:'Mas',supply:5}],
 stores:[{name:'El Tambo',demand:8},{name:'Chilca',demand:5},{name:'Grau',demand:7}],
 costs:[[3,3,.5],[6,.5,3],[3,3,.5]],
 plans:{
  excel:[[7,0,1],[1,5,1],[0,0,5]],
  minCost:[[1,0,7],[2,5,0],[5,0,0]],
  optimalA:[[8,0,0],[0,5,2],[0,0,5]],
  optimalB:[[3,0,5],[0,5,2],[5,0,0]]
 }
};
export const transportCost=plan=>plan.reduce((z,row,i)=>z+row.reduce((s,q,j)=>s+q*transport.costs[i][j],0),0);
export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
