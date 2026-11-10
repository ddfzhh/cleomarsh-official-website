const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('dist/app.js','utf8').split('// Desktop progress follows')[1];
let top=1200;const values=[0,0,0,0],queue=[];
const steps=values.map((_,i)=>({style:{setProperty:(k,v)=>values[i]=+v}}));
const section={classList:{toggle(){},add(){}}};
const context={document:{querySelector:s=>s==='#team'?section:{getBoundingClientRect:()=>({top,height:400}),addEventListener(){}},querySelectorAll:()=>steps},matchMedia:()=>({matches:true,addEventListener(){}}),reduced:{matches:false,addEventListener(){}},innerHeight:1000,innerWidth:1440,window:{addEventListener(){}},requestAnimationFrame:f=>{queue.push(f);return 1}};
vm.createContext(context);vm.runInContext('// Desktop progress follows'+source,context);
function at(y){top=y;vm.runInContext('updateProcessProgress()',context);return [...values]}
assert.deepEqual(at(1200),[0,0,0,0]);
assert.deepEqual(at(821.25),[.5,0,0,0]);
assert.deepEqual(at(763.75),[1,.5,0,0]);
assert.deepEqual(at(706.25),[1,1,.5,0]);
assert.deepEqual(at(648.75),[1,1,1,.5]);
assert.deepEqual(at(620),[1,1,1,1]); // Earlier completion matches the user's second screenshot.
assert.deepEqual(at(560),[1,1,1,1]);
assert.deepEqual(at(-200),[1,1,1,1]); // Continue downward: retain all stages.
assert.deepEqual(at(648.75),[1,1,1,.5]);
assert.deepEqual(at(706.25),[1,1,.5,0]);
assert.deepEqual(at(763.75),[1,.5,0,0]);
assert.deepEqual(at(821.25),[.5,0,0,0]);
assert.deepEqual(at(1200),[0,0,0,0]);
console.log('PASS: offscreen hidden; downward 01–04 reveal; all visible at 62% viewport height; reverse 04–01 fade; repeatable.');
