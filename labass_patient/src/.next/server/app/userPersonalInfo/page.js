(()=>{var e={};e.id=882,e.ids=[882],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1017:e=>{"use strict";e.exports=require("path")},7310:e=>{"use strict";e.exports=require("url")},570:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>m,originalPathname:()=>h,pages:()=>x,routeModule:()=>f,tree:()=>p});var s=r(7623);r(4555),r(7121);var n=r(2933),l=r(1409),o=r(7301),i=r.n(o),d=r(7101),u={};for(let e in d)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(u[e]=()=>d[e]);r.d(t,u);var c=e([s]);s=(c.then?(await c)():c)[0];let p=["",{children:["userPersonalInfo",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,7623)),"/Users/yazeed/nextjs_patient/labass_patient/src/app/userPersonalInfo/page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7977))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,4555)),"/Users/yazeed/nextjs_patient/labass_patient/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,7121,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7977))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],x=["/Users/yazeed/nextjs_patient/labass_patient/src/app/userPersonalInfo/page.tsx"],h="/userPersonalInfo/page",m={require:r,loadChunk:()=>Promise.resolve()},f=new n.AppPageRouteModule({definition:{kind:l.x.APP_PAGE,page:"/userPersonalInfo/page",pathname:"/userPersonalInfo",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:p}});a()}catch(e){a(e)}})},7854:()=>{},3651:(e,t,r)=>{Promise.resolve().then(r.bind(r,8897))},8115:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2383,23)),Promise.resolve().then(r.t.bind(r,2928,23)),Promise.resolve().then(r.t.bind(r,983,23)),Promise.resolve().then(r.t.bind(r,7489,23)),Promise.resolve().then(r.t.bind(r,5232,23)),Promise.resolve().then(r.t.bind(r,6534,23))},8897:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});var a=r(7657),s=r(7123),n=r(1774),l=r(6426);let o=()=>{let e=(0,l.useRouter)(),[t,r]=(0,s.useState)({firstName:"",lastName:"",nationalId:"",dateOfBirth:"",gender:""}),[n,o]=(0,s.useState)(null),[i,d]=(0,s.useState)(!1),u=e=>{let{name:t,value:a}=e.target;r(e=>({...e,[t]:a}))},c=async e=>{e.preventDefault(),d(!0),o(null);try{let e=await fetch("https://yourapiendpoint.com/personal-info",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw Error(`Error: ${e.status} ${e.statusText}`);let r=await e.json();console.log("Submission successful:",r)}catch(e){console.error("Submission failed:",e)}finally{d(!1)}};return(0,a.jsxs)("form",{onSubmit:c,className:"flex flex-col justify-between w-full h-screen p-4 rtl",noValidate:!0,children:[(0,a.jsxs)("div",{className:"space-y-2 overflow-auto mb-4",children:[a.jsx("input",{type:"text",name:"firstName",value:t.firstName,onChange:u,placeholder:"الاسم الأول",required:!0,className:"px-4 py-2 border border-gray-300 w-full text-black text-right focus:outline-none focus:border-custom-green   placeholder-gray-400"}),a.jsx("input",{type:"text",name:"lastName",value:t.lastName,onChange:u,placeholder:"الاسم الاخير",required:!0,className:"px-4 py-2 border border-gray-300 text-black w-full text-right placeholder:text-right focus:outline-none focus:border-custom-green  placeholder-gray-400"}),a.jsx("input",{type:"text",name:"nationalId",value:t.nationalId,onChange:u,placeholder:"رقم الهوية أو الإقامة",required:!0,className:"px-4 py-2 border text-black border-gray-300 w-full text-right placeholder:text-right focus:outline-none focus:border-custom-green  placeholder-gray-400"}),(0,a.jsxs)("div",{dir:"rtl",className:"flex flex-col text-black mb-4",children:["تاريخ الميلاد"," ",a.jsx("input",{type:"date",name:"dateOfBirth",value:t.dateOfBirth,onChange:u,required:!0,className:"px-4 py-2 mt-2 border border-gray-300 w-full text-right text-black placeholder:text-right  placeholder-black",placeholder:"تاريخ الميلاد"})]}),(0,a.jsxs)("select",{name:"gender",value:t.gender,onChange:u,required:!0,autoComplete:"off",className:"px-4 py-2 border focus:outline-none  border-gray-300 w-full text-black text-right focus:border-custom-green  placeholder:text-right  rtl",children:[a.jsx("option",{value:"",dir:"rtl",children:"اختر الجنس"}),a.jsx("option",{value:"male",dir:"rtl",children:"ذكر"}),a.jsx("option",{value:"female",dir:"rtl",children:"أنثى"})]})]}),a.jsx("div",{className:"sticky bottom-0 pb-4",children:a.jsx("button",{type:"submit",className:"w-full font-bold bg-custom-green text-white py-4 px-4 rounded-3xl",onClick:()=>{e.push("/waitingDoctor")},children:"إرسال"})})]})},i=()=>(0,a.jsxs)("div",{className:"flex flex-col bg-gray-100 min-h-screen",children:[a.jsx(n.default,{title:"أدخل المعلومات الشخصية",showBackButton:!0}),(0,a.jsxs)("div",{className:"pt-16 w-full",children:[" ",a.jsx(o,{})]})]})},1774:(e,t,r)=>{"use strict";r.d(t,{default:()=>l});var a=r(7657);r(7123);var s=r(6426),n=r(2556);let l=({title:e,showBackButton:t=!1})=>{let r=(0,s.useRouter)();return(0,a.jsxs)("div",{className:"fixed top-0 w-full bg-white p-4 flex items-center justify-between z-10",children:[a.jsx("h1",{className:"text-lg text-gray-500 font-normal flex-grow text-center",children:e}),t&&a.jsx("button",{onClick:()=>r.back(),className:"ml-2",children:a.jsx(n.Z,{className:"h-5 w-5 text-gray-500","aria-hidden":"true"})})]})}},6426:(e,t,r)=>{"use strict";var a=r(7752);r.o(a,"usePathname")&&r.d(t,{usePathname:function(){return a.usePathname}}),r.o(a,"useRouter")&&r.d(t,{useRouter:function(){return a.useRouter}}),r.o(a,"useSearchParams")&&r.d(t,{useSearchParams:function(){return a.useSearchParams}})},4555:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n,metadata:()=>s});var a=r(5180);r(6004);let s={title:"Next.js",description:"Generated by Next.js"};function n({children:e}){return a.jsx("html",{lang:"ar",children:a.jsx("body",{children:e})})}},7623:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{default:()=>e});var s=r(1903);let e=(await (0,s.createProxy)(String.raw`/Users/yazeed/nextjs_patient/labass_patient/src/app/userPersonalInfo/page.tsx`)).default;a()}catch(e){a(e)}},1)},7977:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});var a=r(9047);let s=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,a.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},6004:()=>{},2556:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});var a=r(7123);let s=a.forwardRef(function({title:e,titleId:t,...r},s){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?a.createElement("title",{id:t},e):null,a.createElement("path",{fillRule:"evenodd",d:"M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z",clipRule:"evenodd"}))})}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[208,95,47],()=>r(570));module.exports=a})();