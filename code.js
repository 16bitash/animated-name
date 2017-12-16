let particles = [];
let font;
function preload() {
    font = loadFont("./Anton-Regular.ttf");
}

function setup() {
    createCanvas(800, 300);
    textFont(font);
    // textSize(200);
    // fill(255);
    // noStroke();
    // text("train", 100, 200);
    let points = font.textToPoints("ASHISH", 100, 200, 200);
    for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        particles.push(new Particle(pt.x, pt.y));
    }
}
let x = 0, y = 0;
function draw() {
    background(0);
    for (let i = 0; i < particles.length; i++) {
        particles[i].behavior();
        particles[i].update();
        particles[i].show();
    }
}

class Particle {
    constructor(x, y) {
        this.pos = createVector(random(width), random(height));
        this.target = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.r = 8;
        this.maxSpeed = 5;
        this.maxForce = 0.3;
        this.arrive = (target) => {
            let desired = p5.Vector.sub(target, this.pos);
            let distance = desired.mag();
            let speed = this.maxSpeed;
            if (distance < 100) {
                speed = map(distance, 0, 100, 0, this.maxSpeed);
            }
            desired.setMag(speed);
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            return steer;
        };
        this.flee = (target) => {
            let desired = p5.Vector.sub(target, this.pos);
            let distance = desired.mag();
            if (distance < 50) {
                desired.setMag(this.maxSpeed);
                desired.mult(-1);
                let steer = p5.Vector.sub(desired, this.vel);
                steer.limit(this.maxForce);
                return steer;
            } else {
                return createVector(0, 0);
            }
        };
        this.behavior = () => {
            let arrive = this.arrive(this.target);
            let mouse = createVector(mouseX, mouseY);
            let flee = this.flee(mouse);
            arrive.mult(1);
            flee.mult(5)
            this.applyForce(arrive);
            this.applyForce(flee)
        };
        this.applyForce = (f) => {this.acc.add(f);};
        this.update = () => {
            this.pos.add(this.vel);
            this.vel.add(this.acc);
            this.acc.mult(0);
        };
        this.show = () => {
            stroke(255);
            strokeWeight(8);
            point(this.pos.x, this.pos.y);
        }
    }
}
