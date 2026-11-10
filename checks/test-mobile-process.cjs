const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('dist/app.js','utf8').split('// Desktop progress follows')[1];
let scroll=0;const values=[0,0,0,0];
const steps=values.map((_,i)=>({style:{setProperty:(k,v)=>values[i]=+v,getPropertyValue:()=>String(values[i])},getBoundingClientRect:()=>({top:1000+i*376-scroll+(1-values[i])*18})}));
const ctx={document:{querySelector:s=>s==='#team'?{classList:{add(){}}}:{getBoundingClientRect:()=>({top:1000-scroll}),addEventListener(){}},querySelectorAll:()=>steps},matchMedia:()=>({matches:false,addEventListener(){}}),reduced:{matches:false,addEventListener(){}},innerHeight:800,innerWidth:390,window:{addEventListener(){}},requestAnimationFrame:()=>1};
vm.createContext(ctx);vm.runInContext('// Desktop progress follows'+source,ctx);
function at(s){scroll=s;vm.runInContext('updateProcessProgress()',ctx);return [...values]}
assert.deepEqual(at(0),[0,0,0,0]);
assert.deepEqual(at(520),[1,0,0,0]);
assert.deepEqual(at(896),[1,1,0,0]);
assert.deepEqual(at(1272),[1,1,1,0]);
assert.deepEqual(at(1648),[1,1,1,1]);
assert.deepEqual(at(1272),[1,1,1,0]);
assert.deepEqual(at(0),[0,0,0,0]);
console.log('PASS mobile: each vertical stage reveals on entry, remains readable below midpoint, reverses on upward scroll.');
