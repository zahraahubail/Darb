// All scheduled rides use Bahrain time, independent of the device timezone.
export const rideTime = (date, time) => Date.parse(`${date}T${time}:00+03:00`);
export const today = (now = Date.now()) => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Bahrain',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
export function nextDate(offer, now = Date.now()) {
  const names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const start = today(now);
  for(let i=0;i<=7;i++) {
    const d=new Date(`${start}T12:00:00+03:00`); d.setUTCDate(d.getUTCDate()+i);
    const date=d.toISOString().slice(0,10);
    if(names[d.getUTCDay()]===offer.day && rideTime(date,offer.time)>now) return date;
  }
}
export const sameSlot = (a,b) => a.date===b.date && a.offer.time===b.offer.time && (a.offer.email && b.offer.email ? a.offer.email===b.offer.email : a.offer.id===b.offer.id);
export const reserved = (bookings,offer,date) => bookings.some(b=>['Accepted','Completed'].includes(b.status)&&sameSlot(b,{offer,date}));
export const hasConflict = (offers,offer) => offers.some(o=>o.id!==offer.id&&o.email===offer.email&&o.day===offer.day&&o.time===offer.time);
export function expireBookings(bookings,now=Date.now()) {
  return bookings.map(b=>b.status==='Pending'&&rideTime(b.date,b.offer.time)<=now?{...b,status:'Rejected',reason:'Expired: the ride time passed before the driver accepted.'}:b);
}
export function acceptBooking(bookings,id,now=Date.now()) {
  const current=expireBookings(bookings,now), target=current.find(b=>b.id===id);
  if(!target||target.status!=='Pending') throw Error('This request is no longer pending.');
  if(reserved(current,target.offer,target.date)) throw Error('This driver’s time slot is already booked.');
  return current.map(b=>b.id===id?{...b,status:'Accepted'}:b.status==='Pending'&&sameSlot(b,target)?{...b,status:'Rejected',reason:'The driver accepted another student for this time slot.'}:b);
}
