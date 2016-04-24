// sweet alerts config
swal.setDefaults({
    customClass: 'star-wars-alert',
});

var OpeningKey = null;

// make audio load on mobile devices
var audio = document.getElementsByTagName('audio')[0];
var audioIsLoaded = false;
var loadData = function () {
    if(!audioIsLoaded){
        audio.load();
        audioIsLoaded = true;
    }
};
document.body.addEventListener('touchstart', loadData);


// prevent arrow scrolling in firefox
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    var type = document.activeElement.type || '';
    if(type.indexOf('text') < 0){
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }
}, false);

var notPlayed = true;
var isLoading = false;
var showFooter = true;

function toggleLoading(){
    if(isLoading){
        $('#loader').hide();
        $('#form-starwars').show();
    }else{
        $('#loader').show();
        $('#form-starwars').hide();
    }
    isLoading = !isLoading;
};

toggleLoading();

var playIntro = function(opening) {
  $("#playBut").remove();
  $('body').removeClass('running');
  StarWars.opening = opening;
  $("#videoButton").show();

  var intro = opening.intro.replace(/</g,"&lt;");
  intro = intro.replace(/>/g,"&gt;");
  intro = intro.replace(/\n/g,"<br>");
  StarWars.animation.find("#intro").html(intro);
  StarWars.animation.find("#episode").text(opening.episode);
  StarWars.animation.find("#title").text(opening.title);

  var ps = opening.text.split('\n');

  var div = StarWars.animation.find("#text");
  div.text('');
  for(var i in ps){
      div.append($('<p>').text(ps[i]));
  }

  $('#logosvg',StarWars.animation).css('width',$(window).width()+'px'); // set width of the logo
  $('#logoimg',StarWars.animation).css('width',$(window).width()+'px');

  var logoText = opening.logo ? opening.logo : "star\nwars";
  var aLogo = logoText.split('\n'); // breaks logo text in 2 lines
  var logo1 = aLogo[0];
  var logo2 = aLogo[1] || "";
  var logo3 = aLogo[2] || "";
  if(logoText.toLowerCase() != "star\nwars"){
      var texts = $('#logosvg text',StarWars.animation);
      texts[0].textContent = logo1;
      texts[1].textContent = logo2;
      texts[2].textContent = logo3;

      // calculate the svg viewBox using the number of characters of the longest world in the logo.
      var logosize = Math.max(logo1.length, logo2.length, logo3.length);
      var vbox = '0 0 '+logosize*200+' 750';
      $('#logosvg',StarWars.animation).each(function () {$(this)[0].setAttribute('viewBox', vbox) });
      $('#logosvg',StarWars.animation).show();
      $('#logoimg',StarWars.animation).hide();
  }else{ // if the logo text is "Star Wars" set to the logo SVG.
      $('#logosvg',StarWars.animation).hide();
      $('#logoimg',StarWars.animation).show();
  }

  var play = function(){
      $.when(StarWars.audioDefer).then(function(){
          var buffered = StarWars.audio.buffered.end(StarWars.audio.buffered.length-1);
          if(buffered == 0 && !audioIsLoaded){
              $('#loader').hide();
              playbutton = $('<div class="verticalWrapper"><div class="playAudio"><button id="playBut" class="playButton" style="font-size: 80px">Play</button></div></div>');
              $('body').append(playbutton);
              $('#playBut',playbutton).click(function(){
                  $('#loader').show();
                  playbutton.remove();
              });
              StarWars.audio.oncanplaythrough = function () {
                  toggleLoading();
                  notPlayed = false;
                  StarWars.play();
              };
          }else{
              toggleLoading();
              notPlayed = false;
              StarWars.play();
          }
      });
  };

  if(document.hasFocus()){ // play if has focus
      play();
  }else{
      $(window).focus(function(){ // play when got focus
          if(notPlayed){
              play();
          }
      });
  }
};

var prepareAndPlayIntro = function() {
  var opening = {
    intro: $("#f-intro").val(),
    logo: $("#f-logo").val(),
    episode: $("#f-episode").val(),
    title: $("#f-title").val(),
    text: $("#f-text").val(),
  };
  var aLogo = opening.logo.split('\n');
  if(aLogo.length > 3){
      sweetAlert("Oops...", "Logo can't have more than 3 lines.", "warning");
      return;
  }
  playIntro(opening);
};

$(document).ready(function() {
  prepareAndPlayIntro();
});

var calcTime = function(queue){
    var minutes = (queue+1)*50;
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);
    var time = "";
    if(days > 0){
        time += days + " days";
    }
    if(days < 3){
        hours = hours%24;
        minutes = minutes%60;
        if(hours > 0){
            time += " " +hours + " hours";
        }
        if(minutes > 0){
            time += " " +minutes + " minutes";
        }
    }
    return time;
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
