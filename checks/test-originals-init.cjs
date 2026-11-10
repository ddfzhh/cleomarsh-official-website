const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('dist/index.html','utf8'),code=fs.readFileSync('dist/app.js','utf8');
const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
const nodes=new Map();function el(s){if(s.startsWith('#')&&!s.includes(' ')&&!ids.has(s.slice(1)))return null;if(!nodes.has(s))nodes.set(s,{textContent:'',innerHTML:'',style:{setProperty(){}},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},querySelector:el,querySelectorAll:()=>[],getBoundingClientRect:()=>({top:1000}),focus(){}});return nodes.get(s)}
for(const hash of ['#case/magic-maid','#case/second-bloom','#home']){
 const context={document:{querySelector:el,querySelectorAll:()=>[],getElementById:id=>el('#'+id),addEventListener(){},body:{classList:{remove(){},add(){}}}},window:{addEventListener(){}},location:{hash},matchMedia:()=>({matches:false,addEventListener(){}}),requestAnimationFrame:()=>1,innerHeight:800,innerWidth:390,console};vm.runInNewContext(code,context);
}
assert(nodes.get('#projects').innerHTML.includes('<article'));
assert(!nodes.get('#projects').innerHTML.includes('<a '));
console.log('PASS: application initializes on home and both retired case hashes; work cards are non-interactive articles.');
