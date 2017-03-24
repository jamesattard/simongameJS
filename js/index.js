$(document).ready(function(){

  var strictMode = false;
  var toggleTurn = false;

  var flashTimer,
      fadeTimer,
      lightShowTimer,
      launchTimer,
      winTimer,
      nextplayTimer,
      wrongTimer,
      restartGameTimer,
      startTimer;

  var playTime = 1500;

  var blueAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  var redAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  var yellowAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  var greenAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
  var loseAudio = new Audio("https://a.clyp.it/nmkpok4u.mp3");

  var greenPad = {
    id:  "#green",
    sound:  greenAudio,
    flashClass: "flashGreen",
    num: 0
  };

  var redPad = {
    id:  "#red",
    sound:  redAudio,
    flashClass: "flashRed",
    num: 1
  };

  var yellowPad = {
    id:  "#yellow",
    sound:  yellowAudio,
    flashClass: "flashYellow",
    num: 2
  };

  var bluePad = {
    id:  "#blue",
    sound:  blueAudio,
    flashClass: "flashBlue",
    num: 3
  };

  var simonPad = [greenPad, redPad, yellowPad, bluePad];

  var simonMoves = [];
  var playerMoves = [];

  // Clear all Timers and start afresh
  function clearEverything(){
    clearTimeout(flashTimer);
    clearTimeout(fadeTimer);
    clearTimeout(lightShowTimer);
    clearTimeout(launchTimer);
    clearTimeout(winTimer);
    clearTimeout(nextplayTimer);
    clearTimeout(wrongTimer);
    clearTimeout(restartGameTimer);
    clearTimeout(startTimer)
  }

  function clearReturn(){
    clearTimeout(wrongTimer);
    clearTimeout(restartGameTimer);
  }

  // Flash Pad
  function flashPad(number, timer){
    var thisObj = simonPad[number];
    var sound = thisObj.sound;

    flashTimer = setTimeout(function(){
        sound.play();
        $(thisObj.id).addClass(thisObj.flashClass);
      }, timer);

    fadeTimer = setTimeout(function(){
        $(thisObj.id).removeClass(thisObj.flashClass);
      }, timer+900);
   }

  // Generate next pick
  function nextSimon() {
    var nextPick = Math.floor(Math.random() * 4);
    simonMoves.push(nextPick);
    // console.log('S: ', simonMoves);
    // console.log('P: ', playerMoves);
  }

  // Flash the player's choice and compare with Simon
  function flashPlayerChoice() {
    $(".color-btn").removeClass("cursor");
    playerMoves = [];

    if(simonMoves.length>1){
      playTime = 1500*simonMoves.length;
    }

    for (var i = 0; i<simonMoves.length; i++){
      var time = (400*i)+(900*i);
      flashPad(simonMoves[i], time)
    }

    lightShowTimer = setTimeout(function(){
      toggleTurn = true;
      $(".color-btn").addClass("cursor");
    }, playTime)
  }

  // Display level number
  function display(string) {
    $("#screen").text(string);
  }

  // Launch game
  function launchNextSimon(){
    nextSimon();
    playTime = 1500;
    launchTimer = setTimeout(function(){
      display(simonMoves.length);
      flashPlayerChoice()
    }, 1500);
  }

  // Compare player's click with Simon's array
  function compare(){
    var index = playerMoves.length - 1;

    if (playerMoves[index] == simonMoves[index]){ // Player chose right pad and waiting answer
      if (playerMoves.length == simonMoves.length){ // Player completed series
        if (playerMoves.length == 20){ // Player has beaten Simon!
          display("WIN")
          flashPad(0, 100);
          flashPad(1, 100);
          flashPad(2, 100);
          flashPad(3, 100);
          winTimer = setTimeout(function(){
            simonMoves = [];
            launchNextSimon();
          }, 1500)
        }
      else { // Simon's turn
        nextplayTimer = setTimeout(function(){
          launchNextSimon();
        }, 800);
      }
    }
      else {
        setTimeout(function(){ // Player is currently playing and in the middle of series
          toggleTurn = !toggleTurn;
        }, 800)
      }
    }
    else { // Player chose wrong pad... Restart
      playerMoves = [];
      if (!strictMode){ // Just restart but do not reset Simon!
        wrongTimer = setTimeout(function(){
            loseAudio.play();
            display("# #")
            restartGameTimer = setTimeout(function(){
              display(simonMoves.length);
              flashPlayerChoice();
              }, 1500)
            }, 1000)
      }
      else if (strictMode){ // Reset Simon's Array and Restart!
        wrongTimer = setTimeout(function(){
            loseAudio.play();
            display("# #")
            restartGameTimer = setTimeout(function(){
              simonMoves = [];
              launchNextSimon();
            }, 1500)
          }, 1000)
      }
    }
  }

  // Run when player clicks on one of the 4 pads
  $(".color-btn").click(function(){
    if((toggleTurn) & ($("#off").hasClass("slider-off-state")) ){
      clearReturn();
      var clickedClr = "#" + $(this).attr("id");
      for (var x=0; x<simonPad.length; x++){
        if (clickedClr == simonPad[x].id){
          flashPad(x, 0)
          playerMoves.push(x)
        }
      }
      toggleTurn = !toggleTurn;
      compare();
    }
  })

  // Run when player clicks start button
  $("#start").click(function(){
    if($("#off").hasClass("slider-off-state")){
      clearEverything();
      simonMoves = [];
      display("- -")
      startTimer = setTimeout(function(){
        launchNextSimon()
      }, 1000);
    }
  })

  // Run when player clicks strict button
  $("#strict").click(function(){
    if($("#off").hasClass("slider-off-state")){
      $("#strict-light").toggle();
      strictMode = !strictMode;
    }
  })

  // Run when player slides to on
  $("#on").click(function(){
    if($(this).hasClass("slider-off-state")){
      $(this).addClass("slider-on-state");
      $(this).removeClass("slider-off-state");
      $("#off").addClass("slider-off-state");
      $("#off").removeClass("slider-on-state");
      display("- -");
      flashPad(0, 100);
      flashPad(1, 100);
      flashPad(2, 100);
      flashPad(3, 100);
      strictMode = false;
      toggleTurn = false;
    }
  })

  // Run when player slides to off
  $("#off").click(function(){
    if($(this).hasClass("slider-off-state")){
      $(this).addClass("slider-on-state");
      $(this).removeClass("slider-off-state");
      $("#on").addClass("slider-off-state");
      $("#on").removeClass("slider-on-state");
      $(".color-btn").removeClass("cursor");
      display("");
      $("#strict-light").hide();
      $(".color-btn").stop();
      clearEverything();
    }
   })

}) // end of drf
