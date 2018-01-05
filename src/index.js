import './index.css';
import nameGenerator from './name-generator';
import isDef from './is-def';
import { POINT_CONVERSION_COMPRESSED } from 'constants';
import { type } from 'os';
  


var pos_x = 0,
pos_y = 0,
mouse_down=false
var sel;
var colorUser=getRandomColorUser();
var listDraw=[];

var rcvName,rcvParticipation

// Store/retrieve the name in/from a cookie.
const cookies = document.cookie.split(';');
let wsname = cookies.find(function(c) {
  if (c.match(/wsname/) !== null) return true;
  return false;
});
if (isDef(wsname)) {
  wsname = wsname.split('=')[1];
  
} else {
  wsname = nameGenerator();
  document.cookie = "wsname=" + encodeURIComponent(wsname);
}

// Set the name in the header
//document.querySelector('header>p').textContent = decodeURIComponent(wsname);

// Create a WebSocket connection to the server
const ws = new WebSocket("ws://" + window.location.host+ "/socket");

// We get notified once connected to the server



var participeA=decodeURIComponent(wsname)
ws.onopen = (event) => {


  console.log("We are connected "+wsname+".");
  selectOptionCreate()
  
 /* sel=document.getElementById("mySelect");
  var option=document.createElement("option")
  option.setAttribute("value","valscript")

  option.textContent="optionScript"
  sel.appendChild(option)*/
   /* line = document.createElement('li');

  line.textContent = event.data;
 // draw_canv.textContent=event.data;
  messages.appendChild(line);*/
};

// Listen to messages coming from the server. When it happens, create a new <li> and append it to the DOM.
const messages = document.querySelector('#messages');
let line;
//set by default option to curent user
var select=document.getElementById("mySelect");
var opt1 = document.createElement('option')
opt1.textContent=decodeURIComponent(wsname)
select.appendChild(opt1)
select.value=decodeURIComponent(wsname)

select.addEventListener("change",function(event){
  context.clearRect(0, 0, canvas.width, canvas.height);
  var strUser = select.options[select.selectedIndex].text;
  draw(listDraw[strUser].split("|")[2],listDraw[strUser].split("|")[1])
  listDraw[decodeURIComponent(wsname)]=decodeURIComponent(wsname)+"|"+colorUser
})





var canvas = document.getElementById('canvas');

let context = canvas.getContext("2d");
var bouton = document.getElementById('bouton');
var actualiser = document.getElementById('bouton');


bouton.addEventListener("click",function(event){
  context.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("mySelect").options[0].selected=true
  listDraw[decodeURIComponent(wsname)]=decodeURIComponent(wsname)+"|"+colorUser
   // draw(listDraw[participeA].split("|")[2],"#FFFFFF")
    
})
actualiser.addEventListener("click",function(event){
})


//context.fillRect(10, 10, size,size);
////////////////////////////////////////////////////////////////////////////////////////

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  pos_x=evt.clientX - rect.left;
  pos_y=evt.clientY - rect.top;
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
canvas.addEventListener('mousemove', function(evt) {
  var mousePos = getMousePos(canvas, evt);
 if(mouse_down===true){
   //******************************* */
  var select=document.getElementById("mySelect");
  var opt = document.createElement('option')
 
  
  participeA = select.options[select.selectedIndex].text;


   //*********************************** */
  context.beginPath();

     context.fillStyle=colorUser
    context.fillRect(pos_x,pos_y,15,15)
    context.stroke();

  sendMessage(evt);
   
 }
}, false);

canvas.addEventListener('mousedown', function(e) {
  var mousePos = getMousePos(canvas, e);
  var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  mouse_down=true;
},false);
canvas.addEventListener('mouseup', function(e) {
  var mousePos = getMousePos(canvas, e);
  var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  mouse_down=false;
},false);


/////////////////////////////////////////////////////////////////////////////////////////////
function selectOptionCreate() {
  
    var select=document.getElementById("mySelect");
    for(var key in listDraw){
      var opt = document.createElement('option')
      opt.value=key.split("=")[0]
      opt.innerHTML = key.split("=")[0];
      select.appendChild(opt);
     }
  }
ws.onmessage = (event) => {
  //get element selected in select opion element
  var strUser
  
  /////recuperer les clients qui dessinent
 
  var select=document.getElementById("mySelect");
  var global=document.getElementById("can_container");
  var opt = document.createElement('option')
  var data= event.data.split("=");
  var parti=data[1]
  var name=data[0]
  var color=data[2]
  var points=data[3]
  rcvParticipation=parti
  rcvName=name
    opt.value=name
    opt.innerHTML = name


 if(typeof(listDraw[name])=="undefined"){
  listDraw[name]=name+"|"+color+"|"+points;//si nouveau utilisateur on l'ajoute au tableau des dessins avec son nom et sa couleu
  
  var li=document.createElement("li");
  li.textContent=name
  li.style.color=color
  li.style.position="static"
  global.appendChild(li)
  opt.style.color=color
  if(listDraw[name].split("|")[0]!==decodeURIComponent(wsname)){
     select.appendChild(opt);//ajouter l'element
  }
  }else{
    listDraw[name]+=("/"+points)
  }

 for(var element in listDraw){
    opt.value= listDraw[element].split("|")[0];
    opt.innerHTML =  listDraw[element].split("|")[0];  

}

 var select = document.getElementById("mySelect");
 if(typeof(select)!=='undefined'){
    
    strUser = select.options[select.selectedIndex].text;

if(typeof(listDraw[strUser])!=='undefined' && typeof(listDraw[strUser].split("|")[2])!=="undefined"){


  draw(listDraw[strUser].split("|")[2],listDraw[strUser].split("|")[1])
  if(parti===decodeURIComponent(wsname)){
    listDraw[name]=name+"|"+color+"|"+points;
    draw(listDraw[name].split("|")[2],listDraw[name].split("|")[1])
    
  }

  }
 }
   
   
  
};
function draw(points,color){
  var point=points.split("/")
  context.beginPath();
  context.fillStyle=color
  
  for(var i in point){
    context.fillRect(point[i].split(";")[0],point[i].split(";")[1],15,15)
  }

 context.stroke();
}

// Retrieve the input element. Add listeners in order to send the content of the input when the "return" key is pressed.
function sendMessage(event) {
  event.preventDefault();
  event.stopPropagation();

    ws.send(participeA+"="+colorUser+"="+pos_x+";"+pos_y);
}
function getRandomColorUser() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
/*const sendForm = document.querySelector('form');
const sendInput = document.querySelector('form input');
sendForm.addEventListener('submit', sendMessage, true);
sendForm.addEventListener('blur', sendMessage, true);*/