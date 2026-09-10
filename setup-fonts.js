import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('public/fonts',{recursive:true});
for(const [pack,file] of [['poppins','poppins-latin-400-normal.woff2'],['poppins','poppins-latin-600-normal.woff2'],['bebas-neue','bebas-neue-latin-400-normal.woff2']]) await copyFile(`node_modules/@fontsource/${pack}/files/${file}`,`public/fonts/${file}`);
for(const pack of ['poppins','bebas-neue']) await copyFile(`node_modules/@fontsource/${pack}/LICENSE`,`public/fonts/${pack}-LICENSE.txt`);
