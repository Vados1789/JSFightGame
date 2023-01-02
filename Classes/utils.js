function rectangularCollision({rect1, rect2}) {
    return (
        rect1.attackBox.position.x + 
        rect1.attackBox.width >= 
        rect2.position.x && 
        rect1.attackBox.position.x <= 
        rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= 
        rect2.position.y &&
        rect1.attackBox.position.y <= 
        rect2.position.y + rect2.height
    )
}



let timer = 60
let timerId

const displayText = document.querySelector('#displayText')
const displayTextStyle = document.querySelector('#displayText').style
const displayTimer = document.querySelector('#timer')


function pickAWinner({ player, enemy, timerId }){
    clearTimeout(timerId)
    displayTextStyle.display = "flex"
    if(player.health === enemy.health){
        displayTimer.innerHTML = 'Draw'
        displayText.innerHTML = 'REMATCH !!!'
    } else if (player.health > enemy.health){
        displayText.innerHTML = 'Player Won!'
    } else if (enemy.health > player.health){
        displayText.innerHTML = 'Enemy Won!'
    }
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        displayTimer.innerHTML = timer
    }

    // 1 = set a value 
    // 2 == checks of the value is equal 
    // 3 === checks if the value and the type is equal

    if(timer === 0)
    {
        pickAWinner({player, enemy, timerId})
    }

}