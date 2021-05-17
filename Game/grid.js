class Grid {
    constructor(loclist) {
        this.conv = 1440/main_width
        this.xdiv = 40
        this.xlen = main_width / this.xdiv
        this.ydiv = main_height/this.xlen
        this.ylen = this.xlen
        this.rows = []
        this.cols = []
        for (let i=0;i<this.ydiv; i++) {
            this.rows.push(i*this.ylen)
        }
        for (let j=0;j<this.xdiv; j++) {
            this.cols.push(j*this.xlen)
        }
        this.highlights = [];
        this.mouseState = [0, 0]
        this.occupied = [[0,7], [1,7], [2,7], [3,7], [4,7], [5,7], [6,7], [7,7], [8, 7],
            [7,6], [7,5], [7,4], [7,3], [7,2],
            [8,6], [8,5], [8,4], [8,3], [8,2],
            [9,2], [10,2], [11,2], [12,2], [13,2], [14,2], [15,2], [16,2], [17,2], [18,2], [19,2], [20,2], [21,2], [22,2], [23,2], [24,2],
            [23,3], [23,4], [23,5], [23,6], [23,7], [23,8], [23,9], [23,10], [23,11], [23,12], [23,13], [23,14], [23,15], [23,16], [23,17],
            [24,3], [24,4], [24,5], [24,6], [24,7], [24,8], [24,9], [24,10], [24,11], [24,12], [24,13], [24,14], [24,15], [24,16], [24,17],
            [22,16], [21,16], [20,16], [19,16], [18,16], [17,16], [16,16], [15,16], [14,16], [13,16], [12,16], [11,16], [10,16], [9,16], [8,16], [7,16],
            [22,17], [21,17], [20,17], [19,17], [18,17], [17,17], [16,17], [15,17], [14,17], [13,17], [12,17], [11,17], [10,17], [9,17], [8,17], [7,17],
            [24,21],[23,21], [22,21], [21,21], [20,21], [19,21], [18,21], [17,21], [16,21], [15,21], [14,21], [13,21], [12,21], [11,21], [10,21], [9,21], [8,21], [7,21],
            [23,18], [23,19], [23,20],
            [24,18], [24,19], [24,20],
            [7, 18], [7, 19], [7, 20], [7, 21],
            [8, 18], [8, 19], [8, 20], [8, 21],
            [25,16], [26,16], [27,16], [28,16], [29,16], [30,16], [31,16], [32,16], [33,16], [34,16], [35,16], [36,16], [37,16], [38,16], [39,16],
            [25,17], [26,17], [27,17], [28,17], [29,17], [30,17], [31,17], [32,17], [33,17], [34,17], [35,17], [36,17], [37,17], [38,17], [39,17]

                      
    
        ]
        //HUD boxes
        for (let i=1;i<12;i++) {
            for (let j=30;j<37;j++) {
                this.occupied.push([j,i])
            }
        }
        //GATES boxes
        for (let i=13;i<20;i++) {
            for (let j=36;j<40;j++) {
                this.occupied.push([j,i])
            }
        }

        for (let l of loclist) {
            this.occupied.push(l)
        }
    }

    mouseCheck(clicked=false) {
        let x;
        let y;
        let _occ = 0
        if (clicked) {
            x = Math.floor(mouseX/(this.xlen))
            y = Math.floor(mouseY/this.ylen)
            for (let box of this.occupied) {
                if (box[0] == x && box[1] == y) {
                    _occ = 1
                    break
                }
            }
            if (x < main_width && x > 0 && y < main_height && y > 0 && _occ==0) {
                let pos = createVector(this.cols[x], this.rows[y])
                console.log(x, y)
                return pos            
            } else {
                return false
            }
        }
        else if (mouseX > 0 && mouseY > 0 &&  mouseX < main_width && mouseY < main_height && (mouseX + mouseY)%1 != this.mouseState) {
            x = Math.floor(mouseX/(this.xlen))
            y = Math.floor(mouseY/this.ylen)
            this.highlights.push([x, y])
            this.mouseState = (mouseX + mouseY)%1            
            return true
        } else if (clicked=false) {
            this.highlights = []
            return false
        }

        
    }

    display() {
        push();


        for (let i=0;i<this.rows.length; i++) {
            for (let j=0;j<this.cols.length; j++) {
                //stroke(50, 50, 50)
                if (this.highlights.length > 0) {
                    for (let h of this.highlights) {
                        if (h[0] == j && h[1] == i) {
                            let occ = 0
                            for (let box of this.occupied) {
                                if (box[0] == j && box[1] == i) {
                                    push();
                                    fill(255, 0, 0, 75)
                                    strokeWeight(0)
                                    square(this.cols[j], this.rows[i], this.xlen*.95)
                                    pop();
                                    occ = 1
                                    break
                                }
                            }
                            if (occ==0) {
                                //console.log(j, i)
                                push();
                                fill(0, 255, 0, 75)
                                strokeWeight(0)
                                square(this.cols[j], this.rows[i], this.xlen*.95)
                                pop();
                            }
                            
                        }
                    }
                }
                push();
                fill(200, 200, 200, 20)
                stroke(200)
                strokeWeight(0)
                square(this.cols[j], this.rows[i], this.xlen*.95)
                pop();
                
            }
        }
        pop();
        
    }
}