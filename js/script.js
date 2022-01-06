let rocket = document.getElementsByClassName("rocket")[0];
let unsafeArea = document.getElementsByClassName("unsafe-area")[0];
let bulletsOnScreen = 0;
let score = 0;
let lives = 3;

let keysPressed = {};
let asteroids = [];
let randomFall;
let levels =
{
    "easy" : 3000,
    "medium" : 2000,
    "hard" : 1000,
};

let difficulty;

document.getElementsByClassName("again")[0].addEventListener("click", function () {
    window.location.reload();
});

document.addEventListener("keydown", (event) => {
    keysPressed[event.code] = true;

    let coord = rocket.getBoundingClientRect();
    if (keysPressed["KeyA"])
    {
        let left = coord.left - 25;
        if (coord.left <= 0)
            left = 0;

        rocket.style.left = left + "px";
    }
    else if (keysPressed["KeyD"])
    {
        let left = coord.left + 25;
        if (coord.left >= window.innerWidth - 50)
            left = window.innerWidth - 50;

        rocket.style.left = left + "px";
    }
    if (keysPressed["Space"])
    {
        if (bulletsOnScreen > 10)
            return;

        bulletsOnScreen++;
        let bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.style.top = (coord.top - 25) + "px";
        bullet.style.left = (coord.left + 25) + "px";
        unsafeArea.appendChild(bullet);

        let bulletTop = bullet.getBoundingClientRect().top;

        let shoot = setInterval(async function () {
            let bulletBottom = bullet.getBoundingClientRect().bottom;

            if (bulletBottom <= 0)
            {
                unsafeArea.removeChild(bullet);
                bulletsOnScreen--;
                clearInterval(shoot);
                return;
            }
            for (let i=0;i<asteroids.length;i++)
            {
                let curr_top = bullet.getBoundingClientRect().top;
                let curr_left = bullet.getBoundingClientRect().left;

                if (curr_top <= asteroids[i].getBoundingClientRect().bottom &&
                    curr_left >= asteroids[i].getBoundingClientRect().left &&
                    curr_left <= asteroids[i].getBoundingClientRect().right)
                {
                    new Audio("sounds/explosion.wav").play();
                    
                    score += 50;
                    document.getElementsByClassName("score-number")[0].textContent = score;
                    unsafeArea.removeChild(bullet);
                    
                    let asteroidImage = document.createElement("img");
                    asteroidImage.className = "asteroid-image";
                    asteroidImage.src = "images/exploded.png";
                    asteroidImage.alt = "Image Not Found!";
                    asteroids[i].innerHTML = "";
                    asteroids[i].appendChild(asteroidImage);
                    await sleep(150);
                    
                    unsafeArea.removeChild(asteroids[i]);
                    asteroids.splice(i, 1);
                    bulletsOnScreen--;
                    clearInterval(shoot);
                    return;
                }
            }

            bullet.style.top = bulletTop + "px";
            bulletTop -= 5;
        }, 10);
    }
});

document.addEventListener("keyup", (event) => {
    delete keysPressed[event.code];
});

function asteroidFall()
{
    let top = Math.random() * (-10 + 30 + 1) - 30;
    let left = Math.random() * 98;

    let asteroid = document.createElement("div");
    let asteroidImage = document.createElement("img");
    asteroidImage.className = "asteroid-image";
    asteroidImage.src = "images/asteroid-game.png";
    asteroidImage.alt = "Image Not Found!";

    asteroid.className = "asteroid";
    asteroid.style.top = top + "%";
    asteroid.style.left = left + "%";

    asteroids.push(asteroid);
    asteroid.appendChild(asteroidImage);
    unsafeArea.appendChild(asteroid);

    let asteroidTop = asteroid.getBoundingClientRect().top;

    let fall = setInterval(async function () {
        let asteroidBottom = asteroid.getBoundingClientRect().bottom;
        let asteroidLeft = asteroid.getBoundingClientRect().left;
        let asteroidRight = asteroid.getBoundingClientRect().right;

        if (asteroidBottom >= document.getElementsByClassName("safe-area")[0].getBoundingClientRect().top ||
            (
                asteroidBottom >= document.getElementsByClassName("rocket")[0].getBoundingClientRect().top &&
                document.getElementsByClassName("rocket")[0].getBoundingClientRect().left >= asteroidLeft &&
                document.getElementsByClassName("rocket")[0].getBoundingClientRect().left <= asteroidRight
            ) ||
            (
                asteroidBottom >= document.getElementsByClassName("rocket")[0].getBoundingClientRect().top &&
                document.getElementsByClassName("rocket")[0].getBoundingClientRect().right >= asteroidLeft &&
                document.getElementsByClassName("rocket")[0].getBoundingClientRect().right <= asteroidRight
            )
        )
        {
            new Audio("sounds/explosion.wav").play();
            
            if (lives === 1)
            {
                music.pause();
                new Audio("../sounds/game-over.wav").play();
                for (let i=0;i<asteroids.length;i++)
                    unsafeArea.removeChild(asteroids[i]);
                clearInterval(randomFall);
                document.getElementsByClassName("game-over")[0].style.display = "block";
                document.getElementsByClassName("lives")[0].textContent = "LIVES: " + 0;
                return;
            }

            lives--;
            document.getElementsByClassName("lives")[0].textContent = "LIVES: " + lives;

            asteroidImage = document.createElement("img");
            asteroidImage.className = "asteroid-image";
            asteroidImage.src = "images/exploded.png";
            asteroidImage.alt = "Image Not Found!";
            asteroid.innerHTML = "";
            asteroid.appendChild(asteroidImage);
            await sleep(150);
            
            unsafeArea.removeChild(asteroid);
            for (let i=0;i<asteroids.length;i++)
            {
                if (asteroids[i] === asteroid)
                {
                    asteroids.splice(i, 1);
                    break;
                }
            }
            clearInterval(fall);
            return;
        }

        asteroid.style.top = asteroidTop + "px";
        asteroidTop += 5;
    }, 100)
}

document.getElementsByClassName("easy")[0].addEventListener("click", function ()
{
    document.getElementsByClassName("levels")[0].style.display = "none";
    difficulty = "easy";
    startGame(levels["easy"]);
});

document.getElementsByClassName("medium")[0].addEventListener("click", function ()
{
    document.getElementsByClassName("levels")[0].style.display = "none";
    difficulty = "medium";
    startGame(levels["medium"]);
});

document.getElementsByClassName("hard")[0].addEventListener("click", function ()
{
    document.getElementsByClassName("levels")[0].style.display = "none";
    difficulty = "hard";
    startGame(levels["hard"]);
});

function startGame(speed)
{
    let music = new Audio("sounds/background-music.mp3");
    music.loop = true;
    music.play();
    randomFall = setInterval(asteroidFall, speed);
}

