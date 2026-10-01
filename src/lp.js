// Simplex de dos fases. Solo depende de matrices numéricas y funciona en el navegador.
const EPS=1e-9;
function simplex(A,b,c){
 const m=b.length,n=c.length,B=Array(m),N=Array(n+1),D=Array.from({length:m+2},()=>Array(n+2).fill(0));
 for(let i=0;i<m;i++){for(let j=0;j<n;j++)D[i][j]=A[i][j];B[i]=n+i;D[i][n]=-1;D[i][n+1]=b[i];}
 for(let j=0;j<n;j++){N[j]=j;D[m][j]=-c[j];}N[n]=-1;D[m+1][n]=1;
 const pivot=(r,s)=>{const inv=1/D[r][s];for(let i=0;i<m+2;i++)if(i!==r)for(let j=0;j<n+2;j++)if(j!==s)D[i][j]-=D[r][j]*D[i][s]*inv;for(let j=0;j<n+2;j++)if(j!==s)D[r][j]*=inv;for(let i=0;i<m+2;i++)if(i!==r)D[i][s]*=-inv;D[r][s]=inv;[B[r],N[s]]=[N[s],B[r]];};
 function run(phase){const row=phase===1?m+1:m;for(;;){let s=-1;for(let j=0;j<=n;j++){if(phase===2&&N[j]===-1)continue;if(s===-1||D[row][j]<D[row][s]-EPS||(Math.abs(D[row][j]-D[row][s])<EPS&&N[j]<N[s]))s=j;}if(s<0||D[row][s]>=-EPS)return true;let r=-1;for(let i=0;i<m;i++){if(D[i][s]<=EPS)continue;const q=D[i][n+1]/D[i][s];if(r<0||q<D[r][n+1]/D[r][s]-EPS||(Math.abs(q-D[r][n+1]/D[r][s])<=EPS&&B[i]<B[r]))r=i;}if(r<0)return false;pivot(r,s);}}
 if(m){let r=0;for(let i=1;i<m;i++)if(D[i][n+1]<D[r][n+1])r=i;if(D[r][n+1]<-EPS){pivot(r,n);if(!run(1)||D[m+1][n+1]<-EPS||Math.abs(D[m+1][n+1])>EPS)return{estado:'infactible'};const ar=B.indexOf(-1);if(ar!==-1){let s=0;for(let j=1;j<=n;j++)if(D[ar][j]<D[ar][s]-EPS||(Math.abs(D[ar][j]-D[ar][s])<=EPS&&N[j]<N[s]))s=j;if(Math.abs(D[ar][s])>EPS)pivot(ar,s);}}}
 if(!run(2))return{estado:'no_acotado'};const x=Array(n).fill(0);for(let i=0;i<m;i++)if(B[i]<n)x[B[i]]=Math.abs(D[i][n+1])<EPS?0:D[i][n+1];return{estado:'optimo',x};
}

export function solveLP({objective,constraints,sense='max',lowerBounds=[]}){
 const n=objective.length,lb=Array.from({length:n},(_,i)=>Number(lowerBounds[i]??0));
 if(!n||constraints.some(r=>r.a.length!==n)||lb.some(v=>!Number.isFinite(v)))throw new Error('Modelo lineal con dimensiones o cotas inválidas.');
 // Sustituir x = lowerBounds + y, de forma que y >= 0.
 const A=[],b=[],original=[];
 for(const row of constraints){
  const relation=row.sense||'<=',rhs=row.b-row.a.reduce((s,a,i)=>s+a*lb[i],0),a=[...row.a];original.push(row);
  if(relation==='<='||relation==='≤'){A.push(a);b.push(rhs);}
  else if(relation==='>='||relation==='≥'){A.push(a.map(v=>-v));b.push(-rhs);}
  else if(relation==='='){A.push(a);b.push(rhs);A.push(a.map(v=>-v));b.push(-rhs);}
  else throw new Error(`Relación inválida: ${relation}`);
 }
 const direction=sense==='min'?-1:1,raw=simplex(A,b,objective.map(v=>direction*v));
 if(raw.estado!=='optimo')return{estado:raw.estado,x:[],z:raw.estado==='no_acotado'?(sense==='min'?-Infinity:Infinity):NaN,holguras:[]};
 const x=raw.x.map((v,i)=>v+lb[i]),z=objective.reduce((s,c,i)=>s+c*x[i],0);
 const holguras=original.map(r=>{const activity=r.a.reduce((s,a,i)=>s+a*x[i],0),rel=r.sense||'<=';return rel==='='?Math.abs(r.b-activity):((rel==='>='||rel==='≥')?activity-r.b:r.b-activity);});
 return{estado:'optimo',x,z,holguras};
}
