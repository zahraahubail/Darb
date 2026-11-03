import {nextDate,today} from './rules.js';
export const demoUser={name:'Sara Ahmed',email:'20240001@student.polytechnic.bh',gender:'Female',phone:'33334444'};
export function createDemoData(now=Date.now()) {
  const owner={name:demoUser.name,email:demoUser.email,gender:'Female',phone:demoUser.phone,seats:1,color:'sage'};
  const offers=[
    {id:'sample-offer-1',...owner,day:'Sunday',time:'10:00',type:'campus',city:'Riffa',campus:'Campus A'},
    {id:'sample-offer-2',...owner,day:'Sunday',time:'15:00',type:'home',city:'Riffa',campus:'Campus A'},
    {id:'sample-offer-3',...owner,day:'Monday',time:'11:30',type:'transfer',city:'',campus:'Campus A → Campus B'},
    {id:'sample-offer-4',...owner,day:'Tuesday',time:'09:00',type:'campus',city:'Isa Town',campus:'Campus B'},
    {id:'sample-offer-5',...owner,day:'Wednesday',time:'14:00',type:'home',city:'Riffa',campus:'Campus B'},
    {id:'sample-offer-6',...owner,day:'Thursday',time:'12:00',type:'transfer',city:'',campus:'Campus B → Campus A'},
  ];
  const ahmed={id:1,name:'Ahmed Al Khalifa',gender:'Male',city:'Riffa',type:'campus',campus:'Campus A',day:'Sunday',time:'08:00',email:'20240011@student.polytechnic.bh',phone:'33000011',seats:1,color:'sage'};
  const fatima={id:2,name:'Fatima Hassan',gender:'Female',city:'Isa Town',type:'home',campus:'Campus B',day:'Monday',time:'14:00',email:'20240012@student.polytechnic.bh',phone:'33000012',seats:1,color:'rose'};
  const pastDate=offer=>{const d=new Date(nextDate(offer,now)+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-14);return d.toISOString().slice(0,10)};
  const outgoing=(id,offer,status,past=false,reason)=>({id:'sample-booking-'+id,offer,email:demoUser.email,phone:demoUser.phone,passenger:demoUser.name,driverEmail:offer.email,date:past?pastDate(offer):nextDate(offer,now),status,...(reason?{reason}:{})});
  const incoming=(id,offer,name,email,status)=>({id:'sample-booking-'+id,offer,email,phone:'33000000',passenger:name,driverEmail:demoUser.email,date:nextDate(offer,now),status});
  const bookings=[
    incoming(1,offers[0],'Noor Ahmed','20240013@student.polytechnic.bh','Pending'),
    incoming(2,offers[0],'Yousif Ali','20240014@student.polytechnic.bh','Pending'),
    incoming(3,offers[2],'Fatima Hassan',fatima.email,'Accepted'),
    outgoing(4,ahmed,'Accepted'),outgoing(5,fatima,'Pending'),
    outgoing(6,ahmed,'Completed',true),
    outgoing(7,fatima,'Rejected',true,'Expired: the ride time passed before the driver accepted.'),
    outgoing(8,{...ahmed,id:4,name:'Noor Ahmed',day:'Wednesday',time:'09:00',gender:'Female',color:'sand'},'Cancelled',true,'You cancelled this request before the driver responded.'),
  ];
  const texts=[
    `Noor Ahmed requested your Sunday ride to Campus A at 10:00. Accept or reject in Bookings.`,
    `Yousif Ali also requested your Sunday 10:00 ride. Both requests are pending; you can accept one student.`,
    `Your ride with Ahmed Al Khalifa on ${bookings[3].date} at 08:00 is accepted. Contact details are ready.`,
    `You accepted Fatima Hassan for your Monday campus hop at 11:30. This dated slot is now booked.`,
    `Your request to Fatima Hassan for ${bookings[4].date} at 14:00 is pending.`,
    `Your previous Monday ride was automatically rejected because the scheduled time passed.`,
    `Journey complete! Your shared ride to Campus A is saved in History.`,
  ];
  return {offers,bookings,notes:texts.map((text,i)=>({id:'sample-note-'+i,email:demoUser.email,text,date:today(now)}))};
}
// One-time additive migration also fills browsers that already saved empty arrays.
export function seedDemoStorage(storage=localStorage,now=Date.now()) {
  if(storage.getItem('drab-demo-data-v1'))return;
  const data=createDemoData(now);
  for(const key of ['offers','bookings','notes']) {
    let existing=[];try{existing=JSON.parse(storage.getItem('drab-'+key))||[]}catch{}
    if(!Array.isArray(existing))existing=[];
    storage.setItem('drab-'+key,JSON.stringify([...existing,...data[key].filter(row=>!existing.some(old=>old.id===row.id))]));
  }
  storage.setItem('drab-demo-data-v1','ready');
}
