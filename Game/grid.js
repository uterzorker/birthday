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
        this.occupied = [[0,7], [1,7], [2,7], [3,7], [4,7], [5,7], [6,7], [7,7], 
            [7,6], [7,5], [7,4], [7,3], [7,2],
            [8,2], [9,2], [10,2], [11,2], [12,2], [13,2], [14,2], [15,2], [16,2], [17,2], [18,2], [19,2], [20,2], [21,2],
            [21,3], [21,4], [21,5], [21,6], [21,7], [21,8], [21,9], [21,10], [21,11], [21,12], [21,13], [21,14],
            [21,15], [21,16], [21,17], [21,18], [21,19], [21,20], [21,21],
            [20,21], [19,21], [18,21], [17,21], [16,21], [15,21], [14,21], 
            [13,21], [12,21], [11,21], [10,21], [9,21], [8,21], [7,21],
            [7,20], [7,19], [7,17], [7,16], [8,16], [9,16], [10,16], [11,16],
            [12,16], [13,16], [14,16], [15,16], [17,16], [18,16], [19,16], [20,16],
            [21,16], [22,16], [23,16], [24,16], [25,16], [26,16], [27,16], [28,16],
            [29,16], [30,16], [31,16], [32,16], [33,16], [34,16], [35,16]

            [26,1], [27,1], [28,1], [29,1], [30,1], [31,1], [32,1],
            [26,2], [27,2], [28,2], [29,2], [30,2], [31,2], [32,2],
            [26,3], [27,3], [28,3], [29,3], [30,3], [31,3], [32,3],
            [26,4], [27,4], [28,4], [29,4], [30,4], [31,4], [32,4],
            [26,5], [27,5], [28,5], [29,5], [30,5], [31,5], [32,5],
            [26,6], [27,6], [28,6], [29,6], [30,6], [31,6], [32,6],
            [26,7], [27,7], [28,7], [29,7], [30,7], [31,7], [32,7],
            [26,8], [27,8], [28,8], [29,8], [30,8], [31,8], [32,8],
            [26,9], [27,9], [28,9], [29,9], [30,9], [31,9], [32,9],
            [26,10], [27,10], [28,10], [29,10], [30,10], [31,10], [32,10]            
    
        ]
        for (let l of loclist) {
            this.occupied.push(l)
        }
    }

    mouseCheck(clicked=false) {
        let x;
        let y;
        let _occ = 0
        if (clicked) {
            x = Math.floor(mouseX/(this.xlen*.8)*this.conv)
            y = Math.floor(mouseY/this.ylen)
            for (let box of this.occupied) {
                if (box[0] == x && box[1] == y) {
                    _occ = 1
                    break
                }
            }
            if (x < main_width && x > 0 && y < main_height && y > 0 && _occ==0) {
                let pos = createVector(this.cols[x], this.rows[y])
                
                return pos            
            } else {
                return false
            }
        }
        else if (mouseX > 0 && mouseY > 0 &&  mouseX < main_width && mouseY < main_height && (mouseX + mouseY)%1 != this.mouseState) {
            x = Math.floor(mouseX/(this.xlen)*this.conv)
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
