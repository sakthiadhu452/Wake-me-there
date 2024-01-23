var stbtnflag=0;
var optbutton=document.querySelector("#options");
var xbutton=document.querySelector(".fa-square-xmark");
var divoptionbtn=document.querySelector("#divoptions");
var optionsdiv=document.querySelector("#optionsdiv")
var startbtn=document.querySelector("#startbtn");
var inputbox=document.querySelector(".Input-Box");
var writingcontent=document.querySelector(".Writing-Content")
var setbtn=document.querySelector("#set")
var i = 0;
var flag=0;
var txt = ` Set your destination and a comfortable range, and our website will alert you when you approach your destination. Enjoy a stress-free journey with timely notifications. Your safety, our priority. Let's make every trip memorable and worry-free together. Safe travels! 🌍🚗`; /* The text */
var speed = 50; /* The speed/duration of the effect in milliseconds */
var music;
var vibrate;


// select music 

function settingvalues(){
music=document.querySelector("#musicselect").value;
vibrate=document.querySelector("#vibrationselect").value;
}
settingvalues();









function typeWriter() {
  if (i < txt.length) {
    document.querySelector(".lighter").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
typeWriter();






optbutton.addEventListener("click",addoptionsdiv);
function addoptionsdiv(){
    optionsdiv.style.display="flex";
}



xbutton.addEventListener("click",removeoptionsdiv);
divoptionbtn.addEventListener("click",removeoptionsdiv);
function removeoptionsdiv(){
    optionsdiv.style.display="none";
}





startbtn.addEventListener("click",()=>{
    //  alert(screen.width);
     writingcontent.style.display="none";
    inputbox.style.width="100vw";
inputbox.style.display="flex";
stbtnflag=1;

})




function GetMa(){
 
  map = new Microsoft.Maps.Map('#myMap', {});

  Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
      var manager = new Microsoft.Maps.AutosuggestManager({ map: map });
      manager.attachAutosuggest('#searchBox', '#searchBoxContainer');
  });
  
}


function AssiningValues(){


}
AssiningValues();


setbtn.addEventListener("click", () => {
  // Get the value from the input element and encode it
  const inputValue = encodeURIComponent(document.querySelector(".dest").value);
  var inputRange = encodeURIComponent(document.querySelector("#range").value); // Assuming you have an input element with class "range"
  
  if(document.querySelector("#distanceUnit").value=="Meter"){
    inputRange=ChangeUnit(inputRange);
  }
  // Construct the URL with the encoded values as query parameters
  const newPagePath = "../MapsPage/map.html" + "?place=" + inputValue + "&range=" + inputRange+"&music="+music+"&vibration="+vibrate;

  // Navigate to the new local file after a delay of 7 seconds
   window.location.href=newPagePath;
});

function ChangeUnit(i){
  return i/1000;
}





window.addEventListener("resize",()=>{
  if(window.innerWidth>1000){
    inputbox.style.width="33%";
    writingcontent.style.display="flex";
  }
  else{
    inputbox.style.width="100vw";
    if(stbtnflag==1){
      writingcontent.style.display="none";
    }
  }
})