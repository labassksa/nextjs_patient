(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[266],{3933:function(e,t,s){Promise.resolve().then(s.bind(s,4134))},4134:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return d}});var a=s(4888),r=s(9318),l=s(7701);class n{validate(){return this.id?this.firstName.trim()?this.lastName.trim()?this.nationalId.trim()?this.dateOfBirth?this.gender?this.phoneNumber?this.role?null:"Role is required.":"Phone number is required.":"Gender selection is required.":"Date of birth is required.":"National ID is required.":"Last name is required.":"First name is required.":"User ID is required."}constructor(e=0,t="",s="",a="",r="",l="",n="",i=null,c=""){this.id=e,this.firstName=t,this.lastName=s,this.nationalId=a,this.dateOfBirth=r,this.gender=l,this.phoneNumber=n,this.email=i,this.role=c}}var i=(0,s(8278).Z)((0,a.jsx)("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"}),"Person"),c=e=>{let{patient:t,isSelected:s,onSelect:r}=e,l="".concat(t.firstName," ").concat(t.lastName);return(0,a.jsx)("div",{onClick:()=>r(t.nationalId),className:"p-4 rounded-lg w-24 h-28 text-center  ".concat(s?"bg-custom-green text-sm text-white ":"text-black outline-gray-200 border-2"),children:(0,a.jsxs)("div",{className:"flex flex-col items-center text-sm",children:[(0,a.jsx)("div",{className:"p-2 rounded-full ".concat(s?"bg-custom-green":"bg-white"),children:(0,a.jsx)(i,{})}),(0,a.jsx)("h2",{className:"font-medium",children:l})]})})},u=s(6300);let o=r.forwardRef(function(e,t){let{title:s,titleId:a,...l}=e;return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":a},l),s?r.createElement("title",{id:a},s):null,r.createElement("path",{fillRule:"evenodd",d:"M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z",clipRule:"evenodd"}))});var d=()=>{let e=(0,l.useRouter)(),[t,s]=(0,r.useState)(null),i=[new n(0,"أنا","","123456789","1990-01-01","male"),new n(1,"محمد","سمير","987654321","1992-07-15","male"),new n(2,"أماني","مرتضى","192837465","1993-05-20","female")],d=e=>{s(e)};return(0,a.jsxs)("div",{className:"min-h-screen bg-white flex",children:[(0,a.jsx)(u.default,{title:"أدخل المعلومات الشخصية",showBackButton:!0}),(0,a.jsxs)("div",{className:"flex flex-col justify-between m-2 w-full",children:[(0,a.jsx)("div",{className:"pt-16 px-2",dir:"rtl",children:(0,a.jsxs)("div",{className:"flex flex-row gap-2 flex-wrap",children:[(0,a.jsxs)("button",{className:"self-start w-24 h-28 text-sm py-2 px-4 bg-gray-100 rounded-lg text-black flex flex-col items-center justify-center",onClick:()=>e.push("/path/to/add/patient"),children:[(0,a.jsx)(o,{className:"h-6 w-6 mb-2"})," ","إضافة مريض"]}),i.map(e=>(0,a.jsx)(c,{patient:e,isSelected:t===e.nationalId,onSelect:d},e.nationalId))]})}),(0,a.jsx)("button",{className:"w-full py-3 bg-custom-green text-white rounded-3xl shadow sticky bottom-12",onClick:()=>e.push("/path/to/consultation"),children:"التالي"})]})]})}},6300:function(e,t,s){"use strict";var a=s(4888);s(9318);var r=s(7701),l=s(4517);t.default=e=>{let{title:t,showBackButton:s=!1}=e,n=(0,r.useRouter)();return(0,a.jsxs)("div",{className:"fixed top-0 w-full bg-white p-4 flex items-center justify-between z-10",children:[(0,a.jsx)("h1",{className:"text-lg text-gray-500 font-normal flex-grow text-center",children:t}),s&&(0,a.jsx)("button",{onClick:()=>n.back(),className:"ml-2",children:(0,a.jsx)(l.Z,{className:"h-5 w-5 text-gray-500","aria-hidden":"true"})})]})}},7701:function(e,t,s){"use strict";var a=s(5);s.o(a,"usePathname")&&s.d(t,{usePathname:function(){return a.usePathname}}),s.o(a,"useRouter")&&s.d(t,{useRouter:function(){return a.useRouter}}),s.o(a,"useSearchParams")&&s.d(t,{useSearchParams:function(){return a.useSearchParams}})},4517:function(e,t,s){"use strict";var a=s(9318);let r=a.forwardRef(function(e,t){let{title:s,titleId:r,...l}=e;return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":r},l),s?a.createElement("title",{id:r},s):null,a.createElement("path",{fillRule:"evenodd",d:"M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z",clipRule:"evenodd"}))});t.Z=r}},function(e){e.O(0,[278,419,248,744],function(){return e(e.s=3933)}),_N_E=e.O()}]);