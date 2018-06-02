var uObj
var ustr=""
var str = "";
var oReq;
var index = 0,
  index2 = 0;
var answer = [];
var questionIds = [];
var questions = [];
var keywords = [];
var keySearch = "";
var qids = "";
var inp = document.getElementById("qw");
inp.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById("but").click();
  }
});
function search() {
  str = document.getElementById("qw").value;
  console.log(str);
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open(
    "POST",
    `https://apis.paralleldots.com/v3/keywords?api_key=c3QDGriQp9S4DXDVWDqf7wvqazd0B5xHWWCQfEfgCc4&text=${str}`
  );
  oReq.send();
}
function reqListener() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.keywords) {
    keywords[i] = obj.keywords[i].keyword;
    keySearch = "[" + keywords[i].replace(/ /g, "-") + "];";
    ustr=ustr+keywords[i].replace(/ /g, "+")+"+";
  }
  ustr = ustr.substring(0, ustr.length - 1);
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener1);
  oReq.open(
    "GET",
    `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=${str}&site=stackoverflow`
  );
  oReq.send();
  var uoReq=new XMLHttpRequest()
  uoReq.open("GET",`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${ustr}&maxResults=10&type=video&videoCaption=closedCaption&key=AIzaSyBgRBtfg3im4_6a3XGq3r4UcLJ0bweU6-4`)
  var z=uoReq.addEventListener("load",ureqListener)
  uoReq.send(); 
}
function reqListener1() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.items) {
    if (index2 >= 5) break;
    if (obj.items[i].is_answered === true) {
      questionIds[index2] = obj.items[i].question_id;
      questions[index2] = obj.items[i].title;
      console.log(questions[index2]);
      index2++;
    }
  }
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener2);
  oReq.open(
    "GET",
    `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=${keySearch}&site=stackoverflow`
  );
  oReq.send();
}
function reqListener2() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.items) {
    if (index2 >= 10) break;
    let check = -1;
    for (let j = 0; j < index2; j++) {
      if (questionIds[j] == obj.items[i].question_id) {
        check = 1;
        break;
      }
    }
    if (obj.items[i].is_answered === true && check == -1) {
      questionIds[index2] = obj.items[i].question_id;
      questions[index2] = obj.items[i].title;
      console.log(questions[index2]);
      index2++;
    }
  }
  for (i = 0; i < index2; i++) {
    qids = qids + questionIds[i] + ";";
  }
  qids = qids.substring(0, qids.length - 1);
  console.log(qids);
  var oReq1 = new XMLHttpRequest();
  oReq1.addEventListener("load", reqListener3);
  oReq1.open(
    "GET",
    `https://api.stackexchange.com/2.2/questions/${qids}?order=desc&sort=votes&site=stackoverflow&filter=!-y(KwOdKR5Ga7mmruVArx2SJykc-M)3jKiDQBk1fq`
  );
  oReq1.send();
}
function reqListener3() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.items) {
    let quid = obj.items[i].question_id;
    let j;
    for (j = 0; j < index2; j++) {
      if (quid == questionIds[j]) {
        answer[j] = obj.items[i].answers[0].body;
        break;
      }
    }
  }
  var parent = document.getElementById("content");
  for (i = 0; i < index2; i++) {
    var newDiv = document.createElement("div");
    var newSpan1 = document.createElement("span");
    newSpan1.setAttribute("id", "quesTitle");
    var newSpan2 = document.createElement("span");
    newSpan2.setAttribute("id", "ansBody");
    newSpan1.innerHTML = questions[i];
    newSpan2.innerHTML = answer[i];
    newDiv.appendChild(newSpan1);
    newDiv.appendChild(newSpan2);
    parent.appendChild(newDiv);
  }
}


//
//


function ureqListener(){
  //console.log('herev also')
  console.log(this.responseText)
  uObj=JSON.parse(this.responseText)
  for(i=0;i<10;i++){
    let x=uObj.items[i].id.videoId
  //console.log(Obj.items[0].id.videoId)
    let d=document.createElement('div')
    let h=document.createElement('h5')
    h.innerHTML=uObj.items[i].snippet.title
    let a=document.createElement('iframe')
  //a.setAttribute("width","560")
  //a.setAttribute("height","315")
    a.setAttribute("src",`https://www.youtube.com/embed/${x}`)
    a.setAttribute("frameborder","0")
    a.setAttribute("allow","autoplay;encrypted-media")
    a.setAttribute("allowfullscreen","true")
    let b=document.getElementById('video')
    d.append(h)
    d.append(a)
    b.append(d)
  }
}