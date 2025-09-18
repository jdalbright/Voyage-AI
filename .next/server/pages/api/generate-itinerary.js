"use strict";(()=>{var e={};e.id=829,e.ids=[829],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},3023:e=>{e.exports=import("@google/generative-ai")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,i){return i in t?t[i]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,i)):"function"==typeof t&&"default"===i?t:void 0}}})},4486:(e,t,i)=>{i.a(e,async(e,r)=>{try{i.r(t),i.d(t,{config:()=>l,default:()=>d,routeModule:()=>u});var n=i(1802),a=i(7153),o=i(6249),s=i(6304),c=e([s]);s=(c.then?(await c)():c)[0];let d=(0,o.l)(s,"default"),l=(0,o.l)(s,"config"),u=new n.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/generate-itinerary",pathname:"/api/generate-itinerary",bundlePath:"",filename:""},userland:s});r()}catch(e){r(e)}})},6304:(e,t,i)=>{i.a(e,async(e,r)=>{try{i.r(t),i.d(t,{default:()=>o});var n=i(3023),a=e([n]);async function o(e,t){if("POST"!==e.method)return t.setHeader("Allow","POST"),t.status(405).json({error:"Method Not Allowed"});let{originCity:i,destinationCity:r,startDate:a,endDate:o,interests:s,budget:c}=e.body;if(!process.env.GEMINI_API_KEY)return t.status(500).json({error:"Gemini API key not configured"});try{let e=new n.GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({model:"gemini-2.5-pro"}),d=new Date(a),l=new Date(o),u=Math.ceil((l.getTime()-d.getTime())/864e5)+1,p=`Create a detailed travel itinerary in JSON format for the following trip:

Origin: ${i}
Destination: ${r}
Start Date: ${a}
End Date: ${o}
Duration: ${u} days
Interests: ${s}
Budget: ${c}

Please generate a JSON response that matches this exact structure:
{
  "tripName": "A creative name for this trip",
  "origin": "${i}",
  "destination": "${r}",
  "startDate": "${a}",
  "endDate": "${o}",
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

Generate exactly ${u} days. Consider the budget level (${c}) when making recommendations. Tailor activities to the interests: ${s}. Be specific and practical with recommendations. Include real places and activities in ${r}.

Return only valid JSON, no additional text.`,m=(await e.generateContent(p)).response.text().match(/\{[\s\S]*\}/);if(!m)throw Error("Invalid JSON response from Gemini");let f=JSON.parse(m[0]);return t.status(200).json({itinerary:f})}catch(e){return console.error("Error generating itinerary:",e),t.status(500).json({error:e instanceof Error?e.message:"Failed to generate itinerary"})}}n=(a.then?(await a)():a)[0],r()}catch(e){r(e)}})},7153:(e,t)=>{var i;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return i}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(i||(i={}))},1802:(e,t,i)=>{e.exports=i(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var i=t(t.s=4486);module.exports=i})();