// shapes.js

export function testFunction() {
    console.log('Module is working');
}
export class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {}
    contains(point) {}
    move(dx, dy) {}
}

export class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    contains(point) {
        return point.x >= this.x && point.x <= this.x + this.width &&
               point.y >= this.y && point.y <= this.y + this.height;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

export class Circle extends Shape {
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    contains(point) {
        return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2) <= this.radius;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

export class Line extends Shape {
    constructor(x, y, x2, y2) {
        super(x, y);
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    contains(point) {
        // Basic implementation; can be enhanced for accuracy
        const distance = Math.abs((this.y2 - this.y) * point.x - (this.x2 - this.x) * point.y + this.x2 * this.y - this.y2 * this.x) / Math.sqrt(Math.pow(this.y2 - this.y, 2) + Math.pow(this.x2 - this.x, 2));
        return distance <= 5;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.x2 += dx;
        this.y2 += dy;
    }
}

export class Pencil extends Shape {
    constructor(points) {
        super(points[0].x, points[0].y);
        this.points = points;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(point => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    }

    contains(point) {
        // This might require complex hit detection logic
        return false;
    }

    move(dx, dy) {
        this.points.forEach(p => {
            p.x += dx;
            p.y += dy;
        });
    }
}
