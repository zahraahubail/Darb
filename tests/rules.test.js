import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rideTime,hasConflict,reserved,expireBookings,acceptBooking,nextDate,today} from '../src/rules.js';
const offer={id:1,email:'driver@example.test',day:'Sunday',time:'10:00',type:'campus'};
const date='2026-11-08';const now=rideTime(date,'09:00');
const request=(id,email='student'+id)=>({id,email,offer,date,status:'Pending'});
test('driver slot conflicts across all journey types, except self when editing',()=>{
assert.ok(hasConflict([offer],{...offer,id:2,type:'home'}));assert.equal(hasConflict([offer],offer),false);
assert.equal(hasConflict([offer],{...offer,id:2,time:'11:00'}),false);assert.equal(hasConflict([offer],{...offer,id:2,day:'Monday'}),false);
assert.equal(hasConflict([offer],{...offer,id:2,email:'other'}),false);
});
test('multiple pending requests do not reserve a slot; acceptance locks it and rejects competitors',()=>{
const pending=[request(1),request(2)];assert.equal(reserved(pending,offer,date),false);
const accepted=acceptBooking(pending,2,now);assert.equal(accepted[1].status,'Accepted');assert.equal(accepted[0].status,'Rejected');assert.ok(accepted[0].reason);
assert.ok(reserved(accepted,offer,date));assert.equal(reserved(accepted,offer,'2026-11-15'),false);
assert.throws(()=>acceptBooking([...accepted,request(3)],3,now),/already booked/);
});
test('requests expire exactly at departure, including when app reopens later',()=>{
assert.equal(expireBookings([request(1)],rideTime(date,'10:00')-1)[0].status,'Pending');
assert.equal(expireBookings([request(1)],rideTime(date,'10:00'))[0].status,'Rejected');
assert.throws(()=>acceptBooking([request(1)],1,rideTime(date,'10:00')),/no longer pending/);
const accepted={...request(2),status:'Accepted'};assert.equal(expireBookings([accepted],rideTime(date,'11:00'))[0].status,'Accepted');
});
test('Bahrain calendar and weekly slots ignore device timezone',()=>{
assert.equal(today(Date.parse('2026-11-07T22:00:00Z')),date);
assert.equal(nextDate(offer,now),date);assert.equal(nextDate(offer,rideTime(date,'10:00')),'2026-11-15');
assert.equal(rideTime(date,'10:00'),Date.parse('2026-11-08T07:00:00Z'));
});
test('same driver time locks across legacy duplicate offers; other drivers stay available',()=>{
const accepted=[{...request(1),status:'Accepted'}];assert.ok(reserved(accepted,{...offer,id:5},date));assert.equal(reserved(accepted,{...offer,email:'another'},date),false);
assert.ok(reserved([{...request(1),status:'Completed'}],offer,date));
});
