var svg = null;
var group = null;
var completedRegions = 0;
var array_of_questions = [];
var currentQuestion = null;
var max_sidebar_extention = 0;

$(document).ready(function(){
   svg = d3.select('svg');
   group = svg.append('g');

   max_sidebar_extention = 0.15 * $(window).width();

   $(window).resize(function(){
     max_sidebar_extention = 0.15 * $(window).width();
   });

   $('body').on('click','#btn-submitter',function(){
       evaluateQuestion();
   });

   $('body').on('keyup','#answer',function(ev){
     if(ev.keyCode == 13) {
       $( "#btn-submitter" ).trigger( "click" );
     }
   });

   $('body').on('click','.highscore',function(){
      showHighscores();
   });

   $('body').on('click','#showHS-ingame',function(){
      showHighscores();
   });

   $('body').on('keydown',function(ev){
     if(ev.keyCode == 27) {
       toggleSideBar();
     }
   });

   $('body').on('click','.start',function(){
     document.getElementById('startSound').play();

     setTimeout(function(){ $('.menu').fadeOut(4500); },1000);

     setTimeout(function(){
        $('#questionnaire').show();
        $('#answer').focus();
        $('#sidebar-menu').fadeIn(1000);

        toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
        }
        toastr.info('Press "Esc" to enter the Menu');
     },5500)
   });

   extract_qestion_data();
   initialize_SVG_components();
});

function extract_qestion_data(){
  $.getJSON('./data.json',function(data){
    $.each(data.questions,function(key,val){

      var temp = { title: val.title, answer:val.answer };
      array_of_questions.push(temp);
    });

    askQuestion();
  });
}

function initialize_SVG_components(){

  var Vidin = createRegion('M60,52 Q82,67 92,68 Q90,85 78,80 Q74,85 76,95 Q89,101 90,105 L86,110 Q101,112 81,127 L81,134 Q72,140 73,152 Q66,151 66,160 L47,145 L43,145 L38,117 L32,109 L31,86 Q35,85 35,80 Q39,75 37,77 Q43,80 50,71 L54,71 L60,52Z','Vidin');

  var Montana = createRegion('M89,103 90,105 L86,110 Q101,112 81,127 L81,134 Q72,140 73,152 Q66,151 66,160 Q81,171 85,178 Q96,178 99,190 L115,190 Q113,185 124,183 Q133,180 130,172 L122,171 Q117,165 127,161 L127,148 L134,142 L145,138 Q137,136 141,118 Q148,114 144,103 Q142,105 132,98 L113,98 L112,101 L89,103Z','Montana');

  var Vraca = createRegion('M115,190 Q113,185 124,183 Q133,180 130,172 L122,171 Q117,165 127,161 L127,148 L134,142 L145,138 Q137,136 141,118 Q148,114 144,103 L155,102 L211,117 Q203,128 196,129 L197,141 L201,143 L200,150 L177,162 L179,178 Q191,183 178,195 L179,200 Q166,201 166,195 L157,196 L154,201 L134,201 L134,184 Q117,183 115,190Z','Vraca');

  var Pleven = createRegion('M211,117 Q203,128 196,129 L197,141 L201,143 L200,150 L177,162 L179,178 Q184,172 207,172 Q215,166 223,178 L239,178 Q248,163 266,167 Q276,148 281,168 L295,159 Q281,150 291,145 L291,124 L296,124 L295,117 L275,117 L274,113 L216,113 L211,117Z','Pleven');

  var Veliko_Tyrnovo = createRegion('M281,168 L295,159 Q281,150 291,145 L291,124 L296,124 L295,117 L309,123 L315,123 L315,136 L323,143 L324,148 L337,157 L337,160 L352,159 L367,171 Q374,168 373,175 L373,198 Q375,205 383,209 Q374,231 341,229 L337,234 L332,234 L332,228 L327,225 L326,207 L318,199 L301,197 L299,190 L280,185 Q277,175 286,171 L281,168Z','Veliko Tyrnovo');

  var Ruse = createRegion('M315,123 L315,136 L323,143 L324,148 L337,157 L337,160 L352,159 L361,166 Q361,156 367,151 Q362,141 371,137 Q367,125 378,123 L402,122 Q411,120 415,111 L390,101 Q388,89 399,84 L393,73 L379,76 L330,123Z','Ruse');

  var Razgrad = createRegion('M371,137 Q367,125 378,123 L402,122 Q411,120 415,111 L390,101 Q388,89 399,84 Q421,87 428,97 Q435,91 453,111 L459,111 L459,120 L449,133 L439,133 L436,134 L436,156 L412,156 L412,163 Q410,168 402,168 Q392,159 402,150 Q402,143 398,139 L397,134 L382,134 L382,141 L371,137Z','Razgrad');

  var Silistra = createRegion('M399,84 Q421,87 428,97 Q435,91 453,111 L459,111 L475,106 L498,92 L501,86 L512,85 L513,77 L519,72 L518,66 L490,66 L486,61 L470,55 L448,55 L437,61 L437,64 L428,68 L410,68 L394,73 L399,84Z','Silistra')

  var Dobrich = createRegion('M475,106 L498,92 L501,86 L512,85 L513,77 L519,72 L526,77 L542,73 Q548,83 546,91 L566,91 L579,98 Q583,95 586,100 L602,102 L602,135 L591,148 L529,147 L529,135 L503,132 L497,121 L485,121 L475,106Z','Dobrich');

  var Varna = createRegion('M559,148 L529,147 L529,135 L503,132 L497,121 L483,140 L483,167 Q476,175 481,183 Q468,190 475,197 Q470,198 467,207 L492,206 L497,210 L523,209 L529,216 L545,216 L545,173 Q557,168 555,155 L559,148Z','Varna');

  var Shumen = createRegion('M497,121 L483,140 L483,167 Q476,175 481,183 Q468,190 475,197 Q470,198 467,207 L448,207 L428,213 L416,208 L414,202 L428,195 L428,180 L436,177 L436,156 L436,134 L439,133 L449,133 L459,120 L459,111 L475,106 L475,106 L485,121 L497,121Z','Shumen');

  var Tyrgovishte = createRegion('M414,202 L428,195 L428,180 L436,177 L436,156 436,156 L412,156 L412,163 Q410,168 402,168 Q392,159 402,150 Q402,143 398,139 L397,134 L382,134 L382,141 L371,137 Q362,141 367,151 Q361,156 361,166 L367,171 Q374,168 373,175 L373,198 Q375,205 383,209 L389,202 Q395,195 400,203 L414,202Z','Tyrgovishte');

  var Burgas = createRegion('M419,209 L428,213 L448,207 L467,207 L492,206 L497,210 L523,209 L529,216 L545,216 L545,233 L529,239 L528,245 Q507,257 512,269 Q530,264 534,289 L555,306 Q550,310 560,325 L513,333 L499,320 L463,320 L459,292 Q442,282 457,274 L431,242 Q437,237 419,220 L419,209Z','Burgas');

  var Plovdiv = createRegion('M216,238 Q228,228 243,236 L269,239 L276,237 L276,263 L283,268 L290,269 Q281,283 290,294 Q289,298 281,297 L281,311 L302,311 L306,336 L295,345 L288,345 L282,351 L271,353 L265,364 Q252,372 253,351 L249,351 L248,343 L236,344 Q230,345 221,338 Q221,332 228,328 Q232,300 217,261 L223,261 L223,256 L220,253 L219,251 L219,249 L216,248 Q215,242 220,240 L216,238Z','Plovdiv');

  var Kyrjali = createRegion('M295,345 L288,345 L282,351 L282,377 L274,385 L282,392 L289,392 L289,414 Q296,418 298,423 L321,423 L331,415 L345,415 L347,412 L364,412 Q362,408 355,405 L355,395 L350,395 Q349,387 355,385 L355,374 Q348,372 342,378 L335,377 L335,362 L319,359 L311,353 L300,353 L300,345 L295,345Z','Kyrjali');

  var Lovech = createRegion('M179,178 Q184,172 207,172 Q215,166 223,178 L239,178 Q248,163 266,167 Q276,148 281,168 L286,171 Q279,173 280,186 Q266,170 269,188 L264,190 L264,206 L261,206 L261,221 L274,227 L274,237 L269,239 L243,236 Q228,228 216,238 L211,233 Q193,239 197,215 Q191,200 179,199 L179,195 Q192,182 179,178Z','Lovech');

  var Gabrovo = createRegion('M280,186 Q266,170 269,188 L264,190 L264,206 L261,206 L261,221 L274,227 L274,237 L284,237 Q293,230 306,234 L332,234 L332,228 L327,225 L326,207 L318,199 L301,197 L299,190 L281,185Z','Gabrovo');

  var Sliven = createRegion('M383,209 Q372,230 351,229 L351,244 Q360,253 352,265 L352,272 L365,291 L371,291 L384,303 Q395,293 385,282 L390,274 Q405,270 401,256 L417,256 L431,242 Q437,236 419,219 L419,210 L416,206 L414,202 L399,202 Q394,194 388,203 L383,209Z','Sliven');

  var Qmbol = createRegion('M463,320 L459,292 Q442,282 457,274 L431,242 L417,256 L401,256 Q405,270 390,274 L385,282 Q395,293 384,303 Q416,303 423,335 L430,328 L451,328 L463,320Z','Qmbol');

  var Stara_Zagora = createRegion('M276,237 L276,263 L283,268 L290,269 Q281,283 290,294 Q289,298 281,297 L281,311 L302,311 L303,319 L318,322 L321,311 L330,311 L334,314 L343,314 L343,320 Q350,323 363,316 L368,322 L384,322 L384,303 L371,291 L365,291 L352,272 L352,265 Q360,253 351,244 L351,229 L341,229 L337,234 L332,234 L306,234 Q293,230 284,237 L276,237Z','Stara Zagora');

  var Haskovo = createRegion('M364,412 Q362,408 355,405 L355,395 L350,395 Q349,387 355,385 L355,374 Q348,372 342,378 L335,377 L335,362 L319,359 L311,353 L300,353 L300,345 L295,345 L306,336 L303,319 L318,322 L321,311 L330,311 L334,314 L343,314 L343,320 Q350,323 363,316 L368,322 L384,322 L384,303 Q416,303 423,335 L423,347 L409,347 L404,352 L402,357 L401,358 L399,359 L399,363 L383,363 Q377,368 380,376 L387,380 L387,404 L375,412 L364,412Z','Haskovo');

  var Smolqn = createRegion('M282,351 L282,377 L274,385 L282,392 L289,392 L289,414 L259,406 L257,411 Q233,397 229,388 L222,391 L207,391 L207,386 L200,389 L188,389 Q187,382 192,378 Q195,376 189,369 L210,362 Q208,346 220,350 L220,339 L221,338 Q230,345 236,344 L248,343 L249,351 L253,351 Q252,372 265,364 L271,353 L282,351Z','Smolqn');

  var Pazarjik = createRegion('M221,338 Q221,332 228,328 Q232,300 217,261 L212,260 L211,257 L206,257 L204,253 L199,253 L196,257 L188,257 L182,262 L176,264 Q170,276 186,274 L184,287 Q180,285 180,292 L179,301 L170,301 L161,311 L161,344 Q165,344 173,359 L189,369 L210,362 Q208,346 220,350 L220,339Z','Pazarjik');

  var Blagoevgrad = createRegion('M161,311 L161,344 Q165,344 173,359 L189,369 Q195,376 192,378 Q187,382  188,389 L188,399 L178,399 Q175,405 166,400 L163,400 L144,406 L113,406 L103,418 L82,418 Q73,412 81,408 L81,375 Q82,370 88,365 Q84,360 79,350 L73,330 Q79,328 82,321 L131,321 L133,318 138,318 L142,314 L147,314 L149,311 L161,311Z','Blagoevgrad');

  var Sofia = createRegion('M133,318 138,318 L142,314 L147,314 L149,311 L161,311 L170,301 L179,301 L180,292 Q180,285 184,287 L186,274 Q170,276 176,264 L182,262 L188,257 L196,257 L199,253 L204,253 L206,257 L211,257  L212,260 L217,261  217,261 L223,261 L223,256 L220,253 L219,251 L219,249 L216,248 Q215,242 220,240 L216,238 L216,238 L211,233 Q193,239 197,215 Q191,200 179,199 L179,200 Q166,201 166,195 L157,196 L154,201 L134,201 L134,184 Q117,183 115,190 L99,190 Q96,178 85,178 L85,192 L76,201 L73,201 L73,206 L68,206 L68,213 L62,219 L69,219 Q90,235 112,265 L112,285 Q132,291 118,305 L118,309 L132,311 L133,318Z','Sofia');

  var Pernik = createRegion('M62,219 L69,219 Q90,235 112,265 L112,285 L106,285 L102,282 L71,282 L60,264 L54,263 L53,258 L51,258 L50,252 L41,252 Q43,240 36,229 L36,228 L40,227 L40,224 L52,219 L62,219Z','Pernik');

  var Kiustendil = createRegion('M112,285 L106,285 L102,282 L71,282 L60,264 L54,263 L53,258 L51,258 L50,252 L41,252 L41,265 Q48,271 37,278 Q36,287 30,288 L30,297 L37,306 41,306 Q66,322 73,330 Q79,328 82,321 L131,321 L133,318 L132,311 L118,309 L118,305 Q132,291 112,285Z','Kiustendil');

}

function MakeErrorSound(){
  document.getElementById('errorSound').play();
}

function ShowErrorMessage() {
  toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
  toastr.error('This area is already taken !');
}

function ShowSuccessRegionWinMessage(){
  toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "2500",
  "extendedTimeOut": "0",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
  }
  toastr.success('You have obtained a new region !');
}

function createRegion(regPath,id) {
  return group.append('path')
  .attr('d',regPath)
  .attr('fill','black')
  .attr('stroke','blue')
  .attr('id',id)
  .attr('stroke-width','1px')
  .on('click',function(){
    var color = d3.select(this).attr('fill');
    if(color.toString().toLowerCase() === 'yellow') {
      MakeErrorSound();
      ShowErrorMessage();
    }
    else {
      d3.select(this).attr('fill','yellow');
      $('#clickPreventer').show();
      document.getElementById('successSound').play();
      completedRegions+=1;
      checkForEndGame();
    }
  })
}

function checkForEndGame() {
  if(completedRegions == 27) {
    setTimeout(function(){
        swal({   title: "CONGRATULATIONS!",   text: "You are the new king of Bulgaria !",   imageUrl: "./resources/Pictures/ferdinant_the_first.jpg" });
    },2000);
  }
  else {

    if(array_of_questions.length == 0) {
      alert('NO MORE QUESTIONS!');
      return;
    }
    askQuestion();
    ShowSuccessRegionWinMessage();
    setTimeout(function(){ $('#questionnaire').show(200); $('#backgrounder').show(200); $('#answer').focus(); },4000);
  }
}

function evaluateQuestion() {
  if($('#answer').val() == "") {
    swal('Error !', "You have no provided any answer !",'error');
    return;
  }
  if(checkAnswer() == true) {
    $('#clickPreventer').hide();
    $('#questionnaire').hide();
    $('#backgrounder').hide();
  }
  else {
    swal('WRONG!', "We expected more from you...",'error');
    askQuestion();
    setTimeout(function(){ $('#questionnaire').show(200); $('#backgrounder').show(200); },2000);
  }
}

function checkAnswer() {
  if(currentQuestion.answer.toString().toLowerCase() != $('#answer').val().toString().toLowerCase()) {
    return false;
  }
  return true;
}

function askQuestion(){

      if(array_of_questions.length == 0) {
        alert('NO MORE QUESTIONS!');
        return;
      }

  $('#answer').val('');
  var index = Math.round(Math.random() * (array_of_questions.length-1));
   currentQuestion = array_of_questions[index];
   array_of_questions.splice(index,1);
   $('#question-title').text(currentQuestion.title);
}

function showHighscores() {
  // $('#highscore-data-container')
  $.get('./highscores.txt',function(data){
    console.log(data);
  });
}


function writeToFile(playername, points){
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var fh = fso.OpenTextFile("./highscores.txt", 8, false, 0);
    fh.WriteLine(playername + ':' + points);
    fh.Close();
}

function toggleSideBar() {
  var item = $('#sidebar-menu');
  if(item.css('width').toString() == '0px') {
    item.css('width',parseFloat(max_sidebar_extention) + 'px');
    item.children().css('display','block');
  }
  else {
    item.children().hide();
    item.css('width','0px');
  }
}
