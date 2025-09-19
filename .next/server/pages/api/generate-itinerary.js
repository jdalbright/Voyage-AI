"use strict";(()=>{var a={};a.id=398,a.ids=[398],a.modules={2572:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{config:()=>o,default:()=>n,handler:()=>m});var e=c(9046),f=c(8667),g=c(3480),h=c(6435),i=c(5807),j=c(8112),k=c(8766),l=a([i]);i=(l.then?(await l)():l)[0];let n=(0,h.M)(i,"default"),o=(0,h.M)(i,"config"),p=new g.PagesAPIRouteModule({definition:{kind:f.A.PAGES_API,page:"/api/generate-itinerary",pathname:"/api/generate-itinerary",bundlePath:"",filename:""},userland:i,distDir:".next",relativeProjectDir:""});async function m(a,b,c){let d=await p.prepare(a,b,{srcPage:"/api/generate-itinerary"});if(!d){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h,routerServerContext:i}=d;try{let c=a.method||"GET",d=(0,j.getTracer)(),e=d.getActiveScopeSpan(),l=p.instrumentationOnRequestError.bind(p),m=async e=>p.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:h.preview,propagateError:!1,dev:p.isDev,page:"/api/generate-itinerary",internalRevalidate:null==i?void 0:i.revalidate,onError:(...b)=>l(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==k.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await m(e):await d.withPropagatedContext(a.headers,()=>d.trace(k.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:j.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},m))}catch(a){if(p.isDev)throw a;(0,e.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}d()}catch(a){d(a)}})},3813:a=>{a.exports=import("@google/generative-ai")},5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5807:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{default:()=>g});var e=c(3813),f=a([e]);async function g(a,b){if("POST"!==a.method)return b.setHeader("Allow","POST"),b.status(405).json({error:"Method Not Allowed"});let{originCity:c,destinationCity:d,startDate:f,endDate:g,interests:h,budget:i}=a.body;if(!process.env.GEMINI_API_KEY)return b.status(500).json({error:"Gemini API key not configured"});try{let a=new e.GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({model:"gemini-2.5-pro"}),j=new Date(f),k=new Date(g),l=Math.ceil((k.getTime()-j.getTime())/864e5)+1,m=`Create a detailed travel itinerary in JSON format for the following trip:

Origin: ${c}
Destination: ${d}
Start Date: ${f}
End Date: ${g}
Duration: ${l} days
Interests: ${h}
Budget: ${i}

Please generate a JSON response that matches this exact structure:
{
  "tripName": "A creative name for this trip",
  "origin": "${c}",
  "destination": "${d}",
  "startDate": "${f}",
  "endDate": "${g}",
  "days": [
    {
      "day": "Day 1",
      "summary": "Brief summary of the day's theme",
      "flights": ["Flight suggestions or details"],
      "hotels": ["Hotel recommendations"],
      "activities": [
        {"time": "Morning", "description": "Specific activity description"},
        {"time": "Afternoon", "description": "Specific activity description"},
        {"time": "Evening", "description": "Specific activity description"}
      ]
    }
  ]
}

Generate exactly ${l} days. Consider the budget level (${i}) when making recommendations. Tailor activities to the interests: ${h}. Be specific and practical with recommendations. Include real places and activities in ${d}.

Return only valid JSON, no additional text.`,n=(await a.generateContent(m)).response.text().match(/\{[\s\S]*\}/);if(!n)throw Error("Invalid JSON response from Gemini");let o=JSON.parse(n[0]);return b.status(200).json({itinerary:o})}catch(a){return console.error("Error generating itinerary:",a),b.status(500).json({error:a instanceof Error?a.message:"Failed to generate itinerary"})}}e=(f.then?(await f)():f)[0],d()}catch(a){d(a)}})}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=2572));module.exports=c})();