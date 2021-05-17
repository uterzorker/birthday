let main_width;
let main_height;
let grid;
let fraktur;
let debug = 0;

let fr = 30;

let away = 0;
function away_check() {
  if (document.visibilityState == "hidden") {
    away = 1
    s_rowing.stop()
    s_start.stop()
    console.log('away')
  } else {
    away = 0
  }
}

document.addEventListener('visibilitychange', away_check)


let pauseStatus = 1

//IMAGES
let paper;
let enterprise;
let enterprise2;
let orko;
let orko2;
let space;
let gates;
let gates_front;
let rowers = []
let smile;
let flag;
let president;
let epcot;
let mickey;
let mickey2;

//SOUNDS
let s_theme;
let s_start;
let s_hitler = [];
let s_orko_spawn;
let s_orko = [];
let s_mickey_spawn;
let s_mickey = [];
let s_ent_spawn;
let s_ent = [];
let s_victory;
let s_gameover;
let s_rowing;
let s_slide;


let path = {};
let path_pts;

let orcs = [];
let init;
let t;
let towers = [];
let _occ_check = 0;
let tower_list = []
let targets = []


let wavenum = 0;
let wavesize = 1
let orc_health = 50 + wavenum*5
let wavesouls = 0;
let wave_cas = 0;
let earnings = 300;
let lives = 10;

let tower_queue = "";
let tower_options = {'basic': 250, 'fancy': 1000, 'sniper': 3000}
let tower_ranges = {'basic': 200, 'fancy': 400, 'sniper': 800}
let tower_post_button = 0;

let waiting = 0;
let _wait_end = 0;
let popup = 0;
let popup_state = 0;
let popup_text = '';
let popup_wait = 60;
let outro = 0;
let fade = 0;
let _restart = 0;
let _restart_frame = 0;
let end = 0;
let won = 0;

//headspin
let theta = 0
let launch = 0
let shrink = 1

function reset() {
  console.log('reset')
  wavenum = 0
  wavesouls = 0
  wavesize = 1
  wave_cas = 0
  waiting = 0
  earnings = 300
  lives = 10
  fade = 0
  outro = 0
  loop();

  orcs = []
  towers = []
  tower_list = []
  theta = 0
  launch = 0
  shrink = 1
  _restart = 1
  _restart_frame = frameCount
  pauseStatus = 1
  end = 0
  won = 0
  s_victory.stop()
  s_gameover.stop()
  s_slide.stop()
}

function preload() {
  fraktur = loadFont('libraries/fraktur.ttf')
  
  paper = loadImage('libraries/paper.jpg')
  enterprise = loadImage('libraries/enterprise.png')
  enterprise2 = loadImage('libraries/enterprise2.png')
  orko = loadImage('libraries/orko.png')
  orko2 = loadImage('libraries/orko2.png')
  mickey = loadImage('libraries/mickey.png')
  mickey2 = loadImage('libraries/mickey2.png')
  epcot = loadImage('libraries/epcot.png')
  space = loadImage('libraries/space.png')
  gates = loadImage('libraries/gates.png')
  gates_front = loadImage('libraries/gates_front.png')
  for (let i=0;i<8;i++) {
    let r = loadImage('libraries/rower' + str(i) + '.png')
    rowers.push(r)
  }
  smile = loadImage('libraries/smile.png')
  flag = loadImage('libraries/USA.png')
  pres = loadImage('libraries/president.png')

  //SOUND PRELOADS
  soundFormats('mp3')
  s_theme = loadSound('libraries/sounds/theme2')
  s_start = loadSound('libraries/sounds/start2')
  s_start.setVolume(.5)
  for (let i=0; i<4; i++) {
    let s_temp = loadSound('libraries/sounds/hitler' + str(i) + '.mp3')
    s_temp.setVolume(.3)
    s_hitler.push(s_temp)
  }
  s_rowing = loadSound('libraries/sounds/rowing.mp3')
  s_rowing.setVolume(.2)
  s_orko_spawn = loadSound('libraries/sounds/orko_spawn.mp3')
  for (let i=0; i<5; i++) {
    let s_temp = loadSound('libraries/sounds/orko' + str(i) + '.mp3')
    s_temp.setVolume(.4)
    s_orko.push(s_temp)
  }
  s_mickey_spawn = loadSound('libraries/sounds/mickey_spawn.mp3')
  s_mickey_spawn.setVolume(.6)
  for (let i=0; i<2; i++) {
    let s_temp = loadSound('libraries/sounds/mickey' + str(i) + '.mp3')
    s_temp.setVolume(.2)
    s_mickey.push(s_temp)
  }
  s_ent_spawn = loadSound('libraries/sounds/makeitso.mp3')
  s_ent = loadSound('libraries/sounds/photon0.mp3')
  s_ent.setVolume(.3)
  s_gameover = loadSound('libraries/sounds/gameover.mp3')
  s_victory = loadSound('libraries/sounds/victory.mp3')
  s_victory.setVolume(.7)
  s_slide = loadSound('libraries/sounds/slide.mp3')
  s_slide.setVolume(.5)
}


function setup() {
  main_width = windowWidth*.9;
  main_height = main_width*.6;
  createCanvas(main_width, main_height);

  // basic_button = createButton('basic tower: $250')
  // basic_button.mousePressed(basic_tower_choose)

  // fancy_button = createButton('fancy tower: $1000')
  // fancy_button.mousePressed(fancy_tower_choose)
  
  frameRate(fr);

  path["a"] = createVector(main_width*0., main_height*.3)
  path["b"] = createVector(main_width*.2, main_height*.3)
  path["c"] = createVector(main_width*.2, main_height*.1)
  path["d"] = createVector(main_width*.6, main_height*.1)
  path["e"] = createVector(main_width*.6, main_height*.9)
  path["f"] = createVector(main_width*.2, main_height*.9)
  path["g"] = createVector(main_width*.2, main_height*.7)
  path["h"] = createVector(main_width*1., main_height*.7)
  // path["a"] = createVector(main_width*0., main_height*.5)
  // path["b"] = createVector(main_width*1., main_height*.5)
  path_pts = Object.keys(path)
  init = path[path_pts[0]]

}

function mouseUp(LEFT) {
  userStartAudio()
}

// function _isMouseButtonInState(LEFT, UP) {
//   userStartAudio()
// }

function tower_choose(choice) {
  tower_queue = Object.keys(tower_options)[choice]
  // if (earnings >= tower_options[tq]) {
  //   tower_queue = tq

  // }
  tower_post_button = frameCount + 15

}



function keyTyped() {
  if (key=='z') {
    tower_choose(0)
  } else if (key=='x') {
    tower_choose(1)
  } else if (key=='c') {
    tower_choose(2)
  } else if (key==' ') {
    pauseStatus = pauseStatus + 1 - 2*pauseStatus

    if (pauseStatus == 0) {
      loop();
    }
  } else if (key=='/') {
      tower_queue = ""
  }
  
  
  else if (key=='r') {
      reset();
  }

  if (debug) {
    if (key=='=') {
      //lives = 0
      wavenum = 10
    } else if (key=='-') {
      lives = 0
    } else if (key=='4') {
      earnings *= 10
    } else if (key=='0') {
      lives = 900
    }
  }
   
}

function mouseClicked() {

  let _pos = grid.mouseCheck(clicked=true)
  if (_pos != false && earnings > 0 && tower_queue.length > 0) {
    let val = tower_options[tower_queue]
    if (earnings >= val && frameCount > tower_post_button) {
      earnings -= val
      towers.push(new Tower(_pos, type=tower_queue))
      if (tower_queue == 'basic') {
        s_orko_spawn.play()
      } else if (tower_queue == 'fancy') {
        s_mickey_spawn.play()
      } else if (tower_queue == 'sniper') {
        s_ent_spawn.play()
      }
      tower_queue = ""
    } else if (earnings < val) {
      popup_text = 'insufficient funds'
      popup = frameCount+popup_wait
      popup_state=1
      tower_queue=""
    }

  }
  // if (earnings > 0) {
  //   earnings -= 250
  //   towers.shift()
  // }
}

function draw() {
  away_check()
  background(0);
  image(space, 0,0, main_width, main_height)

  if (away) {
    s_rowing.stop()
  }

  if (frameCount-_restart_frame == 4) {
    if (s_theme.isPlaying()) {
      s_theme.stop()
    }
    s_start.play()
  }

  //OCCUPATION
  if (tower_list.length < towers.length) {
    let _new_pos = towers[towers.length-1].pos
    let _x = grid.cols.indexOf(_new_pos.x)
    let _y = grid.rows.indexOf(_new_pos.y)
    tower_list.push([_x, _y])
  }

  
  grid = new Grid(tower_list)


  if (tower_queue.length) {
    let val = tower_options[tower_queue]
    if (earnings < val) {
      popup_text = 'insufficient funds'
      popup = frameCount+popup_wait
      popup_state=1
      tower_queue=""
    } else if (grid.mouseCheck()) {
      grid.display();
    } 
  }
  



  //PATH
  push();
  let n = noise(frameCount/150)
  stroke(255*n, 255*(n*n), 255*(1-n))
  strokeWeight(20)
  for (let i=1; i<path_pts.length; i++) {
    let a_pos = path[path_pts[i-1]]
    let b_pos = path[path_pts[i]]
    line(a_pos.x, a_pos.y, b_pos.x, b_pos.y)
  }
  pop();

  //PARTY
  push();
  let party_n = noise(frameCount/20)
  let party_beat = frameCount%40*2
  noStroke()
  fill(255*(1-party_n), 255*party_n, 255*party_n*party_n, party_beat)
  beginShape();
  vertex(main_width*.92, main_height*.57)
  vertex(main_width*.92, main_height*.7)
  vertex(main_width*.97, main_height*.75)
  vertex(main_width*.97, main_height*.63)
  endShape();
  pop();

  //GATES (BACK)
  push();
  image(gates, main_width*.9, main_height*.55, main_width/7, main_width/7)
  pop();


  //DISPLAY RANGE
  if (tower_queue.length > 0) {
    let _show_r = tower_ranges[tower_queue]
    if (earnings >= tower_options[tower_queue]) {
      push();
      stroke(255, 75)
      strokeWeight(1)
      noFill();
      circle(mouseX, mouseY, _show_r)
      pop();
    }
  }

  //HUD
  push();
  let hudX = main_width*.75
  let hudY = main_height*.05
  translate(hudX, hudY)

  ///HUD SHADOW
  fill(5, 100)
  let shadow_angle = 20
  rect(shadow_angle, shadow_angle, main_width*.15, main_height*.4)

  let _hud_font_size = main_width*.015
  fill(75, 20, 75)
  rect(0, 0, main_width*.15, main_height*.4)
  stroke(0)
  fill(255, 255, 0)
  textFont('Courier New')
  textSize(_hud_font_size)
  text("$ " + str(Math.floor(earnings)), main_width*.02, main_height*.04)
  text("WAVE: " + str(wavenum+1), main_width*.02, main_height*.08)

  ///HUD TOWER DESCRIPTION
  push();
  textSize(_hud_font_size-2)
  text("'z':TOWER 1", main_width*.01, main_height*.12)
  text("'x':TOWER 2", main_width*.01, main_height*.18)
  text("'c':TOWER 3", main_width*.01, main_height*.24)
  textSize(_hud_font_size-4)
  text("cost -- $250", main_width*.05, main_height*.14)
  text("cost -- $1000", main_width*.05, main_height*.2)
  text("cost -- $3000", main_width*.05, main_height*.26)

  pop();
  text("LIVES: " + str(lives), 25, main_height*.35)
  text(str(wavesize - wave_cas) + "/" + str(wavesize) + " left", 25, main_height*.38)
  pop();

  //WAVEMACHINE
  let _frame_spacing = (fr)/(1+wavenum)
  if (frameCount%(_frame_spacing) < 1 && wavesouls < wavesize && end == 0 && (frameCount - _restart_frame) >= fr*3) {
    wavesouls += 1
    let _o = new Orc(init, orc_health, ((10+wavenum)))
    orcs.push(_o)
  } 

  //NEXTWAVE
  if (orcs.length==0 && wavesouls >= wavesize && end == 0) {
    //console.log(_wait_end, frameCount)
    if (waiting==0 && frameCount >= _wait_end) {
      _wait_end = frameCount + fr*3
      waiting = 1
    } else if (waiting && frameCount > _wait_end) {
      wavesouls = 0
      wavenum += 1
      wavesize = 10 + 2*wavenum
      wave_cas = 0
      waiting = 0
      console.log("wave health: " + str(50 + 5*wavenum))
      earnings += wavenum*100
    }
  }

  //ORCS
  if (orcs.length > 0 && s_rowing.isPlaying() == false && isLooping()) {
    s_rowing.play()
  } else if (orcs.length==0 || isLooping() == false || pauseStatus) {
    s_rowing.pause()
  }

  for (let i=0;i<orcs.length;i++) {
    orcs[i].update()
    orcs[i].display()
    for (let t of towers) {
      if (t.hit(orcs[i])) {
        if (random() <= t.crit) {
          orcs[i].heath -=t.power*2
          console.log("CRITICAL HIT")
        }
        orcs[i].health -= t.power
        if (orcs[i].health <= 1) {
          earnings += orc_health
          wave_cas += 1
          orcs[i].die()
          orcs.splice(i, 1)
        }
        break
      }
    }
    
  }
  
  //TOWER
  for (let t of towers) {
    var _aim = t.search(orcs)
    if (_aim) {
      t.fire(_aim)
    }
    t.update()
    t.display()
  }

  //GATES (FRONT)
  push();
  image(gates_front, main_width*.9, main_height*.55, main_width/7, main_width/7)
  pop();
  

  //POPUP
  if (popup_state) {
    if (frameCount < popup) {
      let size = main_width/32
      push();
      textFont('Courier New')
      textAlign(RIGHT)
      textSize(size)
      fill(255)
      text(popup_text, main_width-15, main_height-size)
      pop();
    }
    else {
      popup_state=0;
    }
  }
      

  //ENDGAME
  let title_size = main_width/8

  if (wavenum > 8) {
    if (outro==0) {
      outro = frameCount
      s_victory.play()
    }
    won = 1
    end = 1
    orcs = []
    fade = frameCount - outro

    push();
    fill(0, 191 + fade/4)
    rect(0, 0, main_width, main_height)
    imageMode(CENTER)
    tint(255, fade)
    image(flag, main_width/2, main_height/2, main_width, main_height)
    pop();

    push();
    strokeWeight(10)
    stroke(0)
    fill(75, 75, 200)
    textSize(title_size)
    textAlign(CENTER)
    text('YOU WIN!', main_width/2, main_height/2)
    if (fade > 150) {
      textSize(title_size/3)
      strokeWeight(3)
      text('HITLER IS BACK IN HELL', main_width/2, main_height/2 + title_size/2)

    }

    if (fade > 180) {
      push();
      imageMode(CORNER)
      image(pres, main_width-(main_width/8/45)*(fade-180), main_height*.4, main_width/5, main_width/5)
      pop();
    } if (fade > 220) {
      push();
      textSize(title_size/5)
      fill(0)
      noStroke();
      text("'Thank you for saving me, specifically.' -- Mr. Gun, President of the USA", main_width/2, main_height/2 + title_size*1.2)
      pop();
    }
    if (fade > 250) {
      push();
      strokeWeight(0)
      textSize(title_size/5)
      fill(0)
      text("press 'r' to restart", main_width/2, main_height-title_size/5)
      pop();
    }
    

    pop();
  }

  if ((lives <= 0 || (earnings < 250 && towers.length < 1)) && !won) {
    if (outro == 0) {
      outro = frameCount
      s_gameover.play()
    }
    fade = frameCount - outro

    push();
    fill(0, fade) 
    rect(0, 0, main_width, main_height)
    pop(); 

    push();
    translate(main_width/2 + launch/4, main_height-fade-launch)
    rotate(theta)
    imageMode(CENTER)
    tint(255, fade)
    image(smile, 0, 0, 4*title_size*shrink, 4*title_size*shrink)
    pop();

    push();
    strokeWeight(2)
    stroke(255, 50, 0)
    fill(255, 0, 0)
    textSize(title_size)
    textAlign(CENTER)
    text('GAME OVER', main_width/2, main_height/2)
    if (fade > 150) {
      textSize(title_size*.4)
      text('HITLER GOT INTO HEAVEN', main_width/2, main_height/2 + title_size*.8)

      if (fade > 180) {
        if (launch==0) {
          s_slide.play()
        }
        theta += PI/6
        launch += 10
        shrink *= .9
      }
    }
    if (fade > 250) {
      textSize(title_size/5)
      fill(255)
      text("press 'r' to restart", main_width/2, main_height-25)
    }
    

    pop();
  }
  if (fade==255) {
    noLoop();
  }

  //PAUSE SCREENS

  if (pauseStatus) {
    push();
    console.log('paused')
    let moment = 'CONTINUE';
    if (frameCount - _restart_frame < 5) {
      mouseUp(LEFT)
      if (s_theme.isPlaying() == false) {
        s_theme.play()
      }
      moment = 'BEGIN'
      restart = 0
    } 

    rectMode(CORNER)
    fill(255)
    image(paper, 0, -50, main_width, main_height+50)
    textAlign(CENTER)

    //TITLE
    push();
    let title = 'Runaway Hitler'
    textFont(fraktur)
    textSize(title_size)
    fill(50, 0, 0, 150)
    text(title, main_width/2+5, main_height/2-50+5)
    fill(255, 0, 0)
    text(title, main_width/2, main_height/2-50)
    pop();

    textSize(title_size*.3)
    textFont('Courier New')
    fill(0, 150)
    text('SATAN HAS MISPLACED HIS KEYS', main_width/2, main_height/2 + title_size*.5)
    text('WE MUST KEEP THE HITLERS OUT OF HEAVEN', main_width/2, main_height/2 + title_size)
    textSize(title_size*.2)
    text('PRESS SPACEBAR TO ' + moment, main_width/2, main_height/2 + title_size*1.5)
    //rect(0, 0, main_width, main_height)
    pop();
    noLoop();
  }
} 
