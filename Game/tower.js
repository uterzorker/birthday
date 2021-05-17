class Tower {
    constructor(_initpos, type) {
        this.searchmodes = ['close', 'front']
        this.pose = 0
        this.dir = 0
        this.t = type
        if (type=='basic') {
            this.pos = createVector(_initpos.x, _initpos.y)
            this.sidelength = grid.xlen
            this.range = main_width/7
            this.cooldown = .4
            this._framerate = this.cooldown*fr
            this.shots = []
            this._prev_shot = 0;
            this._shotspeed = 50
            this.shot_r = 4
            this.power = 50
            this.crit = .1  
            this.mode_ind=0
            this.shot_color = [255, 255, 255]
        } else if (type=='fancy') {
            this.pos = createVector(_initpos.x, _initpos.y)
            this.sidelength = grid.xlen
            this.range = main_width/7
            this.cooldown = .6
            this._framerate = this.cooldown*fr
            this.shots = []
            this._prev_shot = 0;
            this._shotspeed = 20
            this.shot_r = 15
            this.power = 300
            this.crit = .2
            this.mode_ind=0
            this.shot_color = ['O']
        } else if (type=='sniper') {
            this.pos = createVector(_initpos.x, _initpos.y)
            this.sidelength = grid.xlen
            this.range = main_width/2
            this.cooldown = .8
            this._framerate = this.cooldown*fr
            this.shots = []
            this._prev_shot = 0;
            this._shotspeed = 60
            this.shot_r = 15
            this.power = 500
            this.crit = .5
            this.mode_ind=1
            this.shot_color = [255, 50, 50]
        }
    }

    search(objs) {
        let options = []
        let mode = this.searchmodes[this.mode_ind]
        if (mode=='close') {
            if (objs.length > 0) {
                for (let o of objs) {
                    if (o.alive && o.dir) {
                        let lead = o.dir
                        let _o_pos = o.pos
                        let _towobj = p5.Vector.sub(_o_pos, this.pos)
                        //leading
                        lead.setMag(o.speed*_towobj.mag()/this._shotspeed)
                        _o_pos.add(lead)
                        let dir = p5.Vector.sub(_o_pos, this.pos)
                        //this.dir = dir.heading()
                        let dist = dir.mag()

                        if (dist <= this.range && o.alive) {
                            options.push([dist, dir, o.pos])
                        }  
                    }
                } if (options.length) {
                            options = options.sort((a, b)=> a[0]-b[0])
                        }   
            }
        } else if (mode=='front') {
            if (objs.length > 0) {
                for (let o of objs) {
                    if (o.alive && o.dir.mag()) {
                        let lead = o.dir
                        //lead.setMag(o.speed)
                        let _o_pos = o.pos
                        let _towobj = p5.Vector.sub(_o_pos, this.pos)
                        //leading
                        //lead.setMag(o.speed*_towobj.mag()/(this._shotspeed))
                                    
                                    
                        lead.setMag(o.speed*Math.sqrt(_towobj.mag()*_towobj.mag()/(this._shotspeed*this._shotspeed - o.speed*o.speed)))
                        _o_pos.add(lead)
                        let dir = p5.Vector.sub(_o_pos, this.pos)
                        //this.dir = dir.heading()
                        let dist = dir.mag()

                        if (dist <= this.range && o.alive) {
                            options.push([o.l, dir, o.pos])
                        } 
                    }  
                } if (options.length) {
                                options = options.sort((a, b)=> b[0] - a[0])
                }
            }
        } if (options.length > 0) {
            if (targets.length) {
               for (let targ of targets) {
                   for (let j=0; j<options.length; j++) {
                       if (options[j][2] == targ[2]) {
                           options.splice(j, 1)
                       }    
                   }     
               }    
            }
            targets.push(options[0])
            return options[0][1]
        } else {
            return false
        }
    }

    fire(_dir) {
        if (frameCount - this._prev_shot > this._framerate) {
            this.shots.push([this.pos, _dir])
            this._prev_shot = frameCount
            this.dir = _dir.heading()
            //console.log(this.dir)
            if (this.t=='basic') {
                let s_choice = Math.floor(random(s_orko.length))
                let s_sound = s_orko[s_choice]
                s_sound.play()
            } else if (this.t=='fancy') {
                let s_choice = Math.floor(random(s_mickey.length))
                let s_sound = s_mickey[s_choice]
                s_sound.play()
            } else if (this.t=='sniper') {
                s_ent.play()
            }
        }

    }

    hit(obj) {
        //let _x_ = obj.pos
        let hits = 0
        let _radius_ = obj.health/4 + 5*this.shot_r
        if (this.shots.length > 0) {
            for (let i=0;i<this.shots.length;i++) {
                let shot = this.shots[i]
                let _ranged = shot[1].mag()
                //shot:obj distance
                let _shotobj = p5.Vector.sub(shot[0], obj.pos)
                //tower:shot distance
                let _towshot = p5.Vector.sub(shot[0], this.pos)
                //tower:obj distance
                let _towobj = p5.Vector.sub(obj.pos, this.pos)
                let _delta = p5.Vector.sub(_towshot, _towobj)
                if (_shotobj.mag() <= _radius_) {
                    hits += 1
                    for (let j=0;j<targets.length;j++) {
                        if (targets[j][1] == shot[1]) {
                            targets.splice(j, 1)
                        }
                    }
                    
                    this.shots.splice(i, 1)
                    //console.log(this.dir)
                    
                } 
            }
        }
        
        return hits > 0
    }

    update() {
        if (this.shots.length > 0) {
            for (let i of this.shots) {
                // if (i.length < 2) {
                //     console.log(i[1])
                // }
                i[0] = p5.Vector.add(i[0], (i[1].setMag(this._shotspeed)))
            }   
        }

    }

    display() {
        //TOWER
        push();
        let hop = 0
        if ((this.t == "fancy" || this.t == "basic") && this.shots.length > 0) {
            if (p5.Vector.sub(this.shots[this.shots.length-1][0], this.pos).mag() < 250) {
                hop = -15
            } else {
                hop = 0
            }
        } 
        translate(this.pos.x + grid.xlen/2, this.pos.y + grid.ylen/2 + hop)
        rectMode(CENTER)
        fill(255)
        noStroke()
        if (this.t == "basic") {
            let pose;
            imageMode(CENTER)
            if (Math.abs(this.dir) > PI/2) {
                pose=1
            } else {
                pose=0
            }
            rotate(this.dir )
            if (pose==0) {
                image(orko, 0, 0, grid.xlen*3, grid.xlen*3)
            } else if (pose==1) {
                image(orko2, 0, 0, grid.xlen*3, grid.xlen*3)
            }
        } else if (this.t == "fancy") {
            let pose;
            imageMode(CENTER)
            if (Math.abs(this.dir) > PI/2) {
                pose=1
            } else {
                pose=0
            }
            rotate(this.dir )
            if (pose==0) {
                image(mickey, 0, 0, grid.xlen*4, grid.xlen*4)
            } else if (pose==1) {
                image(mickey2, 0, 0, grid.xlen*4, grid.xlen*4)
            }
        } else if (this.t == "sniper") {
            let pose;
            imageMode(CENTER)
            if (Math.abs(this.dir) > PI/2) {
                pose=1
            } else {
                pose=0
            }
            rotate(this.dir )
            if (pose==0) {
                image(enterprise, 0, 0, grid.xlen*5, grid.xlen*3)
            } else if (pose==1) {
                image(enterprise2, 0, 0, grid.xlen*5, grid.xlen*3)
            }
        } else {
            square(0, 0, 30)

        }
        
        pop();

        //SHOTS
        push();
        if (this.shots.length > 0) {
            for (let shot of this.shots) {
                let _shotpos = shot[0]
                if (this.shot_color[0] == "O") {
                    push();
                    translate(_shotpos.x, _shotpos.y)
                    rotate(frameCount*PI/10)
                    imageMode(CENTER)
                    image(epcot, 0, 0, this.shot_r*3, this.shot_r*3)
                    pop();
                } else {
                    stroke(this.shot_color[0], this.shot_color[1], this.shot_color[2])
                    strokeWeight(10*this.shot_r)
                    if (this.t=='sniper') {
                        strokeWeight(this.shot_r)
                    }
                    point(_shotpos.x, _shotpos.y)
                }
            }
        }

        pop();
    }
}
