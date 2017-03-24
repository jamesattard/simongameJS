$(document).ready(function(){

  var responseTimeout,
      lightTimeout,
      fadeTimeout,
      lightShowTimeout,
      launchTimeout,
      winTimeout,
      nextMoveTimeout,
      wrongTimeout,
      goBackTimeout,
      startTimeout;

  var strictMode = false;
  var playerTurn = false;

  var moveTime = 1500;

  var wrongSound = document.getElementById("wrong");

  var blueObj = {id:  "#blue", sound:  "blueSound", litClass: "lightBlue", num: 0};
  var redObj = {id:  "#red", sound:  "redSound", litClass: "lightRed", num: 1};
  var yellowObj = {id:  "#yellow", sound:  "yellowSound", litClass: "lightYellow", num: 2};
  var greenObj = {id:  "#green", sound:  "greenSound", litClass: "lightGreen", num: 3};

  var colors = [blueObj, redObj, yellowObj, greenObj];

  var moves = [];
  var playerMoves = [];

  function clearResponse(){
    clearTimeout(responseTimeout);
  }

  function clearReturn(){
    clearTimeout(wrongTimeout);
    clearTimeout(goBackTimeout);
  }

  function clearEverything(){
    clearTimeout(lightTimeout);
    clearTimeout(fadeTimeout);
    clearTimeout(lightShowTimeout);
    clearTimeout(launchTimeout);
    clearTimeout(winTimeout);
    clearTimeout(nextMoveTimeout);
    clearTimeout(wrongTimeout);
    clearTimeout(goBackTimeout);
    clearTimeout(startTimeout)
  }

  function lightIt(number, timer){

    var thisObj = colors[number];
    var sound = document.getElementById(thisObj.sound);

    lightTimeout = setTimeout(function(){
        sound.play();
        $(thisObj.id).addClass(thisObj.litClass);
      }, timer);

    fadeTimeout = setTimeout(function(){
        $(thisObj.id).removeClass(thisObj.litClass);
      }, timer+900);
   }

  function nextSimon() {
    var nextPick = Math.floor(Math.random() * 4);
    moves.push(nextPick);
  }

  function lightShow() {

    $(".color-btn").removeClass("cursor");
    playerMoves = [];

    if(moves.length>1){
      moveTime = 1500*moves.length;
    }

    for (var i = 0; i<moves.length; i++){
      var time = (400*i)+(900*i);
      lightIt(moves[i], time)
    }

    lightShowTimeout = setTimeout(function(){
      playerTurn = true;
      $(".color-btn").addClass("cursor");
      responseTimeout = setTimeout(function(){
        playerMoves.push(5);
        compare();
      }, 3000)
    }, moveTime)

  }

  function display(string) {
    $("#screen").text(string);
  }

  function launchNextSimon(){
    nextSimon();
    moveTime = 1500;
    launchTimeout = setTimeout(function(){
      display(moves.length);
      lightShow()
    }, 1500);
  }

  function compare(){
    var index = playerMoves.length - 1;

    if (playerMoves[index] == moves[index]){

      if (playerMoves.length == moves.length){
        nextMoveTimeout = setTimeout(function(){
          launchNextSimon();
          }, 800);
      }
      else {
        setTimeout(function(){
          playerTurn = !playerTurn;
          responseTimeout = setTimeout(function(){
          playerMoves.push(5);
          compare();
          }, 2000)
        }, 800)
      }
    }
    else {
      playerMoves = [];
      if (!strictMode){
        wrongTimeout = setTimeout(function(){
            wrongSound.play();
            display("# #")
            goBackTimeout = setTimeout(function(){
              display(moves.length);
              lightShow();
              }, 1500)
            }, 1000)
      }
      else if (strictMode){
        wrongTimeout = setTimeout(function(){
            wrongSound.play();
            display("# #")
            goBackTimeout = setTimeout(function(){
              moves = [];
              launchNextSimon();
            }, 1500)
          }, 1000)
      }
    }
  }

  $(".color-btn").click(function(){

    if((playerTurn) & ($("#off").hasClass("slider-off-state")) ){

      clearResponse();
      clearReturn();

      var clickedClr = "#" + $(this).attr("id");
      for (var x=0; x<colors.length; x++){
        if (clickedClr == colors[x].id){
          lightIt(x, 0)
          playerMoves.push(x)
        }
      }

      playerTurn = !playerTurn;
      compare();
    }
  })

  $("#start").click(function(){
    if($("#off").hasClass("slider-off-state")){
      clearResponse();
      clearEverything();
      moves = [];
      display("- -")
      startTimeout = setTimeout(function(){
        launchNextSimon()
      // }, 2500);
      }, 1000);
    }
  })

  $("#strict").click(function(){
    if($("#off").hasClass("slider-off-state")){
      $("#strict-light").toggle();
      strictMode = !strictMode;
    }
  })

  $("#on").click(function(){
    if($(this).hasClass("slider-off-state")){
      $(this).addClass("slider-on-state");
      $(this).removeClass("slider-off-state");
      $("#off").addClass("slider-off-state");
      $("#off").removeClass("slider-on-state");
      display("- -")
      strictMode = false;
      playerTurn = false;
    }
  })

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
      clearResponse();
      clearEverything();
    }
   })

}) // end of drf
