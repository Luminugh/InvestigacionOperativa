import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
const excelPath=new URL('./Excel/InvOperativa_FINAL.xlsx',import.meta.url);
export default defineConfig({plugins:[{
 name:'case-excel',
 configureServer(server){server.middlewares.use((req,res,next)=>{
  if(req.url?.split('?')[0]!=='/Excel/InvOperativa_FINAL.xlsx')return next();
  try{const bytes=readFileSync(excelPath);res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');res.setHeader('Content-Disposition','attachment; filename="InvOperativa_FINAL.xlsx"');res.end(bytes);}catch{res.statusCode=404;res.end('Excel no disponible');}
 });},
 generateBundle(){this.emitFile({type:'asset',fileName:'Excel/InvOperativa_FINAL.xlsx',source:readFileSync(excelPath)});}
}]});
