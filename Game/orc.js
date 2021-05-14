class Orc {
    constructor(_initpos, health, speed) {
        this.pos = createVector(_initpos.x, _initpos.y)
        this.l = 0
        this.steps = 0
        this.speed = speed
        this.rad = health/2
        this.health = health
        this.dir;
        this.lap = 1
        this.alive = 1
    }

    update() {
        this.l = this.l % (path_pts.length-1)
        let start = path[path_pts[this.l]]
        let end = path[path_pts[this.l+1]]
        this.dir = p5.Vector.sub(end, start)
        let dist = this.dir.mag()
        this.dir = this.dir.setMag(this.steps)
        this.pos = p5.Vector.add(start, this.dir)
        let progress = p5.Vector.sub(this.pos, start)
        if (progress.mag() >= dist) {
            this.l += 1
            if (this.l == path_pts.length-1) {
                this.lap += 1
                lives -= 1
                earnings -= this.health/this.lap
            }
            this.steps -= dist
        }
        else {
            this.steps += this.speed
        }
    }

    ping() {
        return this.pos
    }

    display() {
        push();
        //strokeWeight(this.rad)
        //stroke(0, 0, 200)
        let phase = Math.floor(frameCount/4)%8
        let ref = rowers[phase]
        imageMode(CENTER)
        image(ref, this.pos.x+50, this.pos.y, 220, 220)
        //point(this.pos.x, this.pos.y)
        pop();
    }

    die() {
        //console.log('ow')
        this.alive = 0
        let s_choice = s_hitler[Math.floor(random(s_hitler.length))];
        s_choice.play()
    }
}