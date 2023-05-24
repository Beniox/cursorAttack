"use strict";

const svg = ""


/**
 * This is a Game, where helicopter are attacking your cursor.
 */

class Game {
    enemies = [];
    cursor = {
        x: 0, y: 0
    }
    config = {
        enemySpawnInterval: 1000,
        attackRadius: 100,
        minAttackRadius: 50,
    }
    static container = document.createElement('div');

    constructor() {
        console.log('init game');

        // add container
        Game.container.setAttribute('id', 'game');
        document.body.appendChild(Game.container);

        // add health bar
        this.healthBar = new HealthBar();

        // circle for cursor for debugging
        const circle = document.createElement('div');
        circle.dataset.type = 'cursor';
        circle.style.width = '200px';
        circle.style.height = '200px';
        circle.style.backgroundColor = 'blue';
        circle.style.position = 'absolute';
        circle.style.top = '0px';
        circle.style.left = '0px';
        circle.style.zIndex = '5';
        circle.style.borderRadius = '50%';
        circle.style.opacity = '0.1';
        // Game.container.appendChild(circle);


        // add event listener
        document.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX;
            this.cursor.y = event.clientY;

            circle.style.top = event.clientY - 100 + 'px';
            circle.style.left = event.clientX - 100 + 'px';
        });
    }

    start() {
        console.log('start game');
        this.healthBar.show();
        this.spawnEnemy();
    }

    spawnEnemy() {
        console.log('spawn enemy');
        this.enemies.push(new Enemy());
    }

    death() {
        this.healthBar.setHealth(100);
    }
}

/**
 * This is the Enemy class
 * @class Enemy
 */
class Enemy {
    maxSpeed = 2;
    speed = 0;
    acceleration = 0.01;
    intervalTime = 10;
    damage = 10;
    attackSpeed = 1000;
    lastAttack = 0;
    timer = null;
    config = {
        width: 50,
        height: 25,
    }
    pos = {
        x: 0,
        y: 0,
    }
    velocity = {
        x: 0,
        y: 0,
    }

    constructor() {
        this.div = document.createElement('div');
        this.div.dataset.type = 'enemy';
        this.div.style.width = this.config.width + 'px';
        this.div.style.height = this.config.height + 'px';
        this.div.style.backgroundImage =  `url("data:image/svg+xml,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 684.22 271.93'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%2324316a;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M554.54,97.4l-20.43-27a60.84,60.84,0,0,0-48.53-24.15H349.77a60.85,60.85,0,0,0-43,17.82L282,88.8a36.55,36.55,0,0,1-21.72,10.48L55.43,122.68l-11.84-35A17.11,17.11,0,0,0,25.38,76.13L15.09,77.35A17.11,17.11,0,0,0,.73,99.26c11.09,36.81,15.05,39.93,2.35,56.86a14.74,14.74,0,0,0,4.1,21.41l12,7.34a17.45,17.45,0,0,0,23.87-5.61c12.56-20,10.7-16.94,12.29-19.93L260,176.63a31.54,31.54,0,0,1,19.77,9.6c26.85,27.35,88.56,46.48,160.43,46.48,96.52,0,174.77-34.5,174.77-77.07C614.94,132.38,591.52,111.53,554.54,97.4ZM431.77,99.91H346.16c-7,0-11.05-8.77-6.85-14.94l14.85-21.88a13,13,0,0,1,10.71-5.84h56.18a6.23,6.23,0,0,1,5.87,4.15l10.72,30.2A6.22,6.22,0,0,1,431.77,99.91Zm85.88,0h-56.4a7.54,7.54,0,0,1-7.1-5l-9.8-27.59a7.54,7.54,0,0,1,7.11-10.06h40.3A26.57,26.57,0,0,1,514.68,71l9.47,16.53C527.27,92.93,523.61,99.91,517.65,99.91Z'/%3E%3Cpath class='cls-1' d='M412.58,22.87h17.33a8.32,8.32,0,1,0,0-16.63H412.58a8.32,8.32,0,1,0,0,16.63Z'/%3E%3Cpath class='cls-1' d='M167.4,25.79c3.29,1.06-11.29,1.26,214.67-7.71a2.86,2.86,0,0,0,2.75-2.86v-4a2.86,2.86,0,0,0-2.75-2.86L172,0C156.59-.6,152.91,21.11,167.4,25.79Z'/%3E%3Cpath class='cls-1' d='M670.51,0,460.42,8.35a2.86,2.86,0,0,0-2.75,2.86v4a2.86,2.86,0,0,0,2.75,2.86c225.79,9,211.37,8.78,214.68,7.71C689.58,21.11,685.9-.6,670.51,0Z'/%3E%3Cpath class='cls-1' d='M577.91,255.42H487.3V241a8.26,8.26,0,1,0-16.51,0v14.45H367.58V236.84a8.26,8.26,0,1,0-16.52,0v18.58h-68.8a8.26,8.26,0,1,0,0,16.51H577.91a8.26,8.26,0,1,0,0-16.51Z'/%3E%3C/svg%3E")`;
        this.div.style.backgroundSize = 'contain';
        this.div.style.backgroundRepeat = 'no-repeat';
        this.div.style.position = 'absolute';
        this.div.style.top = '0px';
        this.div.style.left = '0px';
        this.div.style.zIndex = '100';

        Game.container.appendChild(this.div);
        this.move();

        // remove the enemy when it is clicked
        this.div.addEventListener('click', () => {
            this.div.remove();
            clearInterval(this.timer);
        });
    }

    /**
     * Pathfinding
     */
    move() {
        this.timer = setInterval(() => {

            // calculate the distance between the cursor and the enemy
            let distanceX = game.cursor.x - this.pos.x - this.config.width / 2;
            let distanceY = game.cursor.y - this.pos.y - this.config.height / 2;

            // calculate the current distance between the enemy and the cursor
            const distanceToCursor = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            // calculate the desired distance from the cursor
            const desiredDistance = game.config.attackRadius;

            // calculate the angle between the cursor and the enemy
            const angle = Math.atan2(distanceY, distanceX) + (Math.random() * 0.2 - 0.1);

            // calculate the speed of the enemy
            if (this.speed < this.maxSpeed) {
                this.speed += this.acceleration;
            }


            // calculate the speed of the enemy
            let speedX = Math.cos(angle) * this.speed;
            let speedY = Math.sin(angle) * this.speed;

            // check for obstacles (other enemies)
            const obstacles = game.enemies.filter(enemy => enemy !== this);

            let avoidX = 0;
            let avoidY = 0;

            for (const obstacle of obstacles) {
                const distanceToObstacleX = obstacle.pos.x - this.pos.x;
                const distanceToObstacleY = obstacle.pos.y - this.pos.y;
                const distanceToObstacle = Math.sqrt(distanceToObstacleX * distanceToObstacleX + distanceToObstacleY * distanceToObstacleY);

                if (distanceToObstacle < this.config.width) {
                    avoidX -= distanceToObstacleX;
                    avoidY -= distanceToObstacleY;
                }
            }

            // Adjust the enemy's movement direction based on obstacle avoidance
            const avoidanceForce = 0.5; // A factor to control the strength of avoidance

            speedX += avoidX * avoidanceForce;
            speedY += avoidY * avoidanceForce;

            // check if the enemy is too close to the cursor and move away
            if (distanceToCursor < desiredDistance) {

                // calculate the distance to move away from the cursor
                const distanceToMove = desiredDistance - distanceToCursor;

                // calculate the movement in the opposite direction of the cursor
                speedX = -speedX * (distanceToMove / distanceToCursor);
                speedY = -speedY * (distanceToMove / distanceToCursor);
            }

            // move the enemy but avoid vibrating
            if (Math.abs(distanceX) > Math.abs(speedX)) {
                this.pos.x += speedX;
                this.div.style.left = this.pos.x + 'px';
            }
            if (Math.abs(distanceY) > Math.abs(speedY)) {
                this.pos.y += speedY;
                this.div.style.top = this.pos.y + 'px';
            }

            // Check if the enemy is close to the cursor, and attack if within range
            if (distanceToCursor < game.config.attackRadius && distanceToCursor > game.config.minAttackRadius) {
                this.speed = 0;
                this.attack();

            }

            // flip the enemy if it is on the left side of the cursor
            this.div.style.transform = distanceX < 0 ? 'scaleX(-1)' : 'scaleX(1)';

            // rotate the enemy slightly up if it is below the cursor
            if (distanceY > 50) {

                this.div.style.transform += ' rotate(20deg)';
            } else if (distanceY < -50) {
                this.div.style.transform += ' rotate(-20deg)';
            } else {
                this.div.style.transform += ' rotate(0deg)';
            }

        }, this.intervalTime);

    }

    /**
     * Attack the health bar
     */
    attack() {
        // just attack every second
        if (Date.now() - this.lastAttack < this.attackSpeed) {
            return;
        }
        this.lastAttack = Date.now();

        // shoot a projectile

        // Vector from enemy to cursor, should be normalized between 0 and 1
        const dir = {
            x: game.cursor.x - this.pos.x - this.config.width / 2,
            y: game.cursor.y - this.pos.y - this.config.height / 2,
        }

        // Normalize the direction vector
        const magnitude = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
        dir.x /= magnitude;
        dir.y /= magnitude;


        new Projectile(dir, {...this.pos}, this.damage);
    }
}

/**
 * A projectile that is shot from an enemy
 */
class Projectile {
    speed = 1;
    damage = 10;
    accuracy = 0.8;
    config = {
        width: 10,
        height: 3,
    }
    pos = {
        x: 0,
        y: 0,
    }
    dir = {
        x: 0,
        y: 0,
    }

    constructor(dir, pos, damage) {
        this.damage = damage;
        this.pos = pos;
        this.dir = dir;

        this.div = document.createElement('div');
        this.div.dataset.type = 'projectile';
        this.div.style.borderRadius = '50%';
        this.div.style.width = this.config.width + 'px';
        this.div.style.height = this.config.height + 'px';
        this.div.style.backgroundColor = 'black';
        this.div.style.position = 'absolute';
        this.div.style.top = this.pos.y + 'px';
        this.div.style.left = this.pos.x + 'px';
        this.div.style.zIndex = '100';

        //rotate the projectile
        const angle = Math.atan2(this.dir.y, this.dir.x);
        this.div.style.transform = `rotate(${angle}rad)`;

        Game.container.appendChild(this.div);
        this.move();
    }

    /**
     * Move the projectile
     */
    move() {
        this.timer = setInterval(() => {
            // increase the speed over time
            this.speed += 0.03;

            // move the projectile
            this.pos.x += this.dir.x * this.speed;
            this.pos.y += this.dir.y * this.speed;

            // update the position
            this.div.style.top = this.pos.y + 'px';
            this.div.style.left = this.pos.x + 'px';

            // check if the projectile hit the cursor
            const distanceX = this.pos.x - game.cursor.x;
            const distanceY = this.pos.y - game.cursor.y;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < 10) {
                game.healthBar.reduceHealth(this.damage);
                this.remove();
                console.log('hit');
            }

            // remove the projectile if it is out of bounds
            if (this.pos.x < 0 || this.pos.x > window.innerWidth || this.pos.y < 0 || this.pos.y > window.innerHeight) {
                this.remove();
            }

        }, 10);
    }

    /**
     * Remove the projectile
     */
    remove() {
        clearInterval(this.timer);
        this.div.remove();
    }
}


class HealthBar {
    maxHealth = 100;
    health = 100;
    healthRegen = 1;
    div = null;
    XOFFSET = 10;
    YOFFSET = 20;

    constructor() {
        this.div = document.createElement('div');
        this.div.dataset.type = 'healthbar';
        this.div.style.width = this.health + 'px';
        this.div.style.height = '10px';
        this.div.style.backgroundColor = 'green';
        this.div.style.position = 'absolute';
        this.div.style.top = '0px';
        this.div.style.left = '0px';
        this.div.style.zIndex = '1000';

        Game.container.appendChild(this.div);

        //follow cursor
        document.addEventListener('mousemove', (event) => {
            this.div.style.top = event.clientY - this.YOFFSET + 'px';
            this.div.style.left = event.clientX - this.XOFFSET + 'px';
        });

        //regenerate health
        this.timer = setInterval(() => {
            this.setHealth(this.getHealth() + this.healthRegen);
        }, 1000);

    }

    /**
     * Set the health of the health bar
     * @param health {number} the health of the health bar
     */
    setHealth(health) {
        if (health > this.maxHealth) health = this.maxHealth;
        this.health = health;
        this.div.style.width = this.health + 'px';
    }

    /**
     * Reduce the health of the health bar
     * @param amount {number} the amount to reduce the health
     */
    reduceHealth(amount) {
        if (this.health <= 0) {
            game.death();
        }

        this.health -= amount;
        this.div.style.width = this.health + 'px';
    }

    /**
     * Get the health of the health bar
     * @returns {number}
     */
    getHealth() {
        return this.health;
    }

    show() {
        this.div.style.display = 'block';
    }

    hide() {
        this.div.style.display = 'none';
    }
}