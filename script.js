// --- INITIAL STATE DATA LOOPS ---
let start_x = 0;
let start_y = 0;
let swipe_direction = 0;
let value_list = Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0);
let spot_click = 0;
let isTypingGameActive = false; // Add this with your other globals
const position_list = [
    {x: 10, y: 10},  {x: 10, y: 120},  {x: 10, y: 230},  {x: 10, y: 340},
    {x: 120, y: 10}, {x: 120, y: 120}, {x: 120, y: 230}, {x: 120, y: 340},
    {x: 230, y: 10}, {x: 230, y: 120}, {x: 230, y: 230}, {x: 230, y: 340},
    {x: 340, y: 10}, {x: 340, y: 120}, {x: 340, y: 230}, {x: 340, y: 340}
];



const numbers = Array(2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048);
const colors = [
    ["#F6DADB", "#F1BFBE", "#EBA1A1", "#E68281", "#D96463", "#BA5655", "#9B4847", "#7D3A39", "#612D2D", "#462020"],
    ["#FADF8F", "#F7CE5D", "#DCAF40", "#C29B38", "#A88730", "#907329", "#775F21", "#614D1A", "#443D26", "#302B1A"],
    ["#C6EBC9", "#9EDCA0", "#74CB72", "#55B648", "#4A9F3E", "#3F8835", "#33712C", "#295C23", "#1F471B", "#143313"],
    ["#B8EBEF", "#82DBE0", "#64C5CC", "#58AEB3", "#4C979D", "#418286", "#356B70", "#2B5760", "#214445", "#173032"],
    ["#D9E3F2", "#BDCCE9", "#A1B7DF", "#84A1D6", "#678BCE", "#4C75C4", "#355FB6", "#2A4D94", "#213C72", "#172A52"],
    ["#E7DDF2", "#D5C4E9", "#C3ABE0", "#B291D7", "#9F77CD", "#8E5FC5", "#7B44BB", "#6826B1", "#511793", "#3A106B"],
    ["#EEDBED", "#E3C1E0", "#D7A5D1", "#CB89C3", "#BE6BB4", "#B24EA5", "#A03290", "#812876", "#651F5B", "#481642"],
    ["#F2F4F7", "#D0D5DD", "#98A2B3", "#667085", "#475467", "#344054", "#1D2939", "#101828", "#0B0F19", "#030406"]
];

// --- SCREEN SWITCHING UTILITY ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

// --- INITIALIZER ---
document.getElementById('play-button').addEventListener('click', start_game);

function start_game() {
    showScreen('color-screen');
    choose_color();
}

function get_win(){
    if (isTypingGameActive) return; 
    isTypingGameActive = true; 

    const square = document.getElementById('hidden_square');
    
    // 1. Reset color to hidden immediately when a fresh attempt starts
    square.style.backgroundColor = '#FFFDF0'; 

    const hidden_square_code = "i-love-my-daddy";
    let hidden_square_input = '';

    const handleKeyDown = (event) => {
        hidden_square_input += event.key.toLowerCase();

        if (hidden_square_input === hidden_square_code) {
            value_list[0] = 1024;
            document.removeEventListener('keydown', handleKeyDown);
            
            // 2. Turn green and unlock the game flag for future clicks
            isTypingGameActive = false; 
            square.style.backgroundColor = 'orange';
            put_blocks(); 
        }
    }

    setTimeout(() => {
        document.removeEventListener('keydown', handleKeyDown);
        
        // 3. Unlock the game flag on timeout, but DO NOT touch the color here
        if (hidden_square_input !== hidden_square_code) {
            isTypingGameActive = false; 
        }
    }, 10000); 

    document.addEventListener('keydown', handleKeyDown);
}



// --- VIEW 2: CHOOSE COLOR ---
function choose_color() {
    const grid = document.getElementById('color-grid');
    grid.innerHTML = "";
    
    for (let d = 0; d < colors.length; d++) {
        const box = document.createElement('div');
        box.classList.add('color-box');
        box.style.backgroundColor = colors[d][4]; // Mapped to fill = colors[d][4] from your loop
        
        if (d <= 3) {
            box.style.left = (10 + 110 * d) + 'px';
            box.style.top = '100px';
        } else {
            box.style.left = (10 + 110 * (d - 4)) + 'px';
            box.style.top = '260px';
        }
        
        box.addEventListener('click', () => {
            spot_click = d;
            setup_game_board();
        });
        
        grid.appendChild(box);
    }
}

function setup_game_board() {
    document.getElementById('hidden_square').addEventListener('click', get_win)
    showScreen('game-screen');
    const board = document.getElementById('game-board');
    board.innerHTML = "";
    
    position_list.forEach(pos => {
        const bgSquare = document.createElement('div');
        bgSquare.classList.add('grid-bg-square');
        bgSquare.style.left = pos.x + 'px';
        bgSquare.style.top = pos.y + 'px';
        board.appendChild(bgSquare);
    });
    
    put_blocks();
    
    // Your existing keyboard listener:
    window.addEventListener('keydown', handle_keydown);
    
    // --- ADD THESE NEW MOBILE TOUCH LISTENERS HERE ---
    const boardElement = document.getElementById('game-screen');
    
    // Replaces root.bind("<Button-1>", start_swipe)
    boardElement.addEventListener('touchstart', function(e) {
        start_swipe(e.touches[0].clientX, e.touches[0].clientY);
    });
    
    // Replaces root.bind("<ButtonRelease-1>", end_swipe)
    boardElement.addEventListener('touchend', function(e) {
        end_swipe(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    });
}


// --- BLOCK GENERATION LAYER ---
function put_blocks() {
    document.querySelectorAll('.tile').forEach(t => t.remove());
    const board = document.getElementById('game-board');
    
    for (let i = 0; i < value_list.length; i++) {
        if (value_list[i] !== 0) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.left = (position_list[i].x + 5) + 'px';
            tile.style.top = (position_list[i].y + 5) + 'px';
            
            let dark_or_light = (value_list[i] < 64) ? "#56534A" : "#F4EFEA";
            tile.style.color = dark_or_light;
            
            let current_value = numbers.indexOf(value_list[i]);
            tile.style.backgroundColor = colors[spot_click][current_value];
            tile.innerText = value_list[i];
            
            board.appendChild(tile);
        }
    }
}
// --- RANDOMIZER & MATRIX CHECKS ---
function adding_new_square() {
    if (value_list.includes(0)) {
        let new_square_position = Math.floor(Math.random() * 16);
        while (value_list[new_square_position] !== 0) {
            new_square_position = Math.floor(Math.random() * 16);
        }
        
        let new_square_value = Math.floor(Math.random() * 10);
        if (new_square_value === 6) {
            value_list[new_square_position] = 4;
        } else {
            value_list[new_square_position] = 2;
        }
        put_blocks();
    }
    
    let snowball = false;
    for (let i = 0; i < position_list.length; i++) {
        if (position_list[i].y !== 10 && value_list[i] === value_list[i - 1]) { snowball = true; break; }
        if (position_list[i].y !== 340 && value_list[i] === value_list[i + 1]) { snowball = true; break; }
        if (position_list[i].x !== 10 && value_list[i] === value_list[i - 4]) { snowball = true; break; }
        if (position_list[i].x !== 340 && value_list[i] === value_list[i + 4]) { snowball = true; break; }
    }
    
    if (!value_list.includes(0) && snowball === false) {
        window.removeEventListener('keydown', handle_keydown);
        showScreen('lose-screen');
        draw_menu();
    }
}

function check_highest_number() {
    let highest = value_list[0];
    for (let q = 0; q < value_list.length; q++) {
        if (value_list[q] > highest) {
            highest = value_list[q];
        }
    }
    return highest;
}

function you_win() {
    window.removeEventListener('keydown', handle_keydown);
    showScreen('win-screen');
    draw_menu();
}

// --- WIN/LOSE OPTION MENUS ---
function draw_menu() {
    // 1. Connects the choices on the WIN screen
    document.getElementById('btn-view').onclick = () => { showScreen('game-screen'); put_blocks(); window.addEventListener('keydown', handle_keydown); };
    document.getElementById('btn-again').onclick = () => reset_to_color_selection();
    document.getElementById('btn-quit').onclick = () => trigger_quit_shutdown();
    
    // 2. Connects the choices on the LOSE screen
    document.getElementById('btn-lose-view').onclick = () => { showScreen('game-screen'); put_blocks(); };
    document.getElementById('btn-lose-again').onclick = () => reset_to_color_selection();
    document.getElementById('btn-lose-quit').onclick = () => trigger_quit_shutdown();
}



function reset_to_color_selection() {
    value_list = Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0);
    showScreen('color-screen');
    choose_color();
}

// --- KEY DOWN EVENT SWITCHBOARD ---
function handle_keydown(event) {
    let arrow_key_name = "";
    if (event.key === "ArrowUp") arrow_key_name = "Up";
    if (event.key === "ArrowDown") arrow_key_name = "Down";
    if (event.key === "ArrowLeft") arrow_key_name = "Left";
    if (event.key === "ArrowRight") arrow_key_name = "Right";
    
    if (arrow_key_name !== "") {
        event.preventDefault(); // Prevents web browser window from scrolling
        move_squares(arrow_key_name);
    }
}

// --- CORE TILE SLIDING ARITHMETIC LOOPS ---
function move_squares(keysym) {
    let merged_squares = new Array(16).fill(false);
    let randomnesss = false;
    
    if (keysym === "Up" || swipe_direction === 1) {
        for (let i = 1; i < value_list.length; i++) {
            if (value_list[i] !== 0 && position_list[i].y !== 10) {
                let moving_number = 1;
                while (i - moving_number >= 0 && (value_list[i - moving_number] === 0 || value_list[i - moving_number] === value_list[i])) {
                    if (position_list[(i - moving_number + 1)].y === 10) {
                        break;
                    }
                    moving_number++;
                }
                let destination = i - moving_number + 1;
                if (i - moving_number + 1 < 0) {
                    moving_number--;
                }
                if (value_list[i] !== value_list[destination]) {
                    value_list[destination] = value_list[i];
                    value_list[i] = 0;
                    randomnesss = true;
                } else if (destination !== i && value_list[i] === value_list[destination] && !merged_squares[destination]) {
                    value_list[destination] = value_list[destination] * 2;
                    value_list[i] = 0;
                    merged_squares[destination] = true;
                    randomnesss = true;
                }
            }
        }
    }
    
    if (keysym === "Down" || swipe_direction === 2) {
        for (let i = value_list.length - 1; i >= 0; i--) {
            if (value_list[i] !== 0 && position_list[i].y !== 340) {
                let moving_number = 1;
                while (i + moving_number < value_list.length && (value_list[i + moving_number] === 0 || value_list[i + moving_number] === value_list[i])) {
                    if (position_list[(i + moving_number - 1)].y === 340) {
                        break;
                    }
                    moving_number++;
                }
                let destination = i + moving_number - 1;
                if (i + moving_number - 1 > value_list.length) {
                    moving_number--;
                }
                if (value_list[i] !== value_list[destination]) {
                    value_list[destination] = value_list[i];
                    value_list[i] = 0;
                    randomnesss = true;
                } else if (destination !== i && value_list[destination] === value_list[i] && !merged_squares[destination]) {
                    value_list[destination] = value_list[destination] * 2;
                    value_list[i] = 0;
                    merged_squares[destination] = true;
                    randomnesss = true;
                }
            }
        }
    }
    
    if (keysym === "Right" || swipe_direction === 3) {
        for (let i = value_list.length - 1; i >= 0; i--) {
            if (value_list[i] !== 0 && position_list[i].x !== 340) {
                let shift_number = 4;
                while (i + shift_number < value_list.length && (value_list[i + shift_number] === 0 || value_list[i + shift_number] === value_list[i])) {
                    if (position_list[i + shift_number - 4].x === 340) {
                        break;
                    }
                    shift_number += 4;
                }
                let destination = i + shift_number - 4;
                if (i + shift_number - 4 > value_list.length) {
                    shift_number -= 4;
                }
                if (value_list[i] !== value_list[destination]) {
                    value_list[destination] = value_list[i];
                    value_list[i] = 0;
                    randomnesss = true;
                } else if (destination !== i && value_list[destination] === value_list[i] && !merged_squares[destination]) {
                    value_list[destination] = value_list[destination] * 2;
                    value_list[i] = 0;
                    merged_squares[destination] = true;
                    randomnesss = true;
                }
            }
        }
    }
    
    if (keysym === "Left" || swipe_direction === 4) {
        for (let i = 0; i < value_list.length; i++) {
            if (value_list[i] !== 0 && position_list[i].x !== 10) {
                let shift_number = 4;
                while (i - shift_number >= 0 && (value_list[i - shift_number] === 0 || value_list[i - shift_number] === value_list[i])) {
                    if (position_list[i - shift_number + 4].x === 10) {
                        break;
                    }
                    shift_number += 4;
                }
                let destination = i - shift_number + 4;
                if (i - shift_number + 4 < 0) {
                    shift_number -= 4;
                }
                if (value_list[i] !== value_list[destination]) {
                    value_list[destination] = value_list[i];
                    value_list[i] = 0;
                    randomnesss = true;
                } else if (destination !== i && value_list[i] === value_list[destination] && !merged_squares[destination]) {
                    value_list[destination] = value_list[destination] * 2;
                    value_list[i] = 0;
                    merged_squares[destination] = true;
                    randomnesss = true;
                }
            }
        }
    }
    
        put_blocks();           
    if (randomnesss === true) {
        setTimeout(adding_new_square, 250);
        let current_highest = check_highest_number();
        if (current_highest === 2048) {
            setTimeout(you_win, 251);
        }
    }
    
    // --- ADD THIS LINE AT THE ABSOLUTE END OF MOVE_SQUARES ---
    swipe_direction = 0; 
}

// Replaces your original root.destroy() logic cleanly for the web environment
function trigger_quit_shutdown() {
    window.removeEventListener('keydown', handle_keydown);
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    
    // Create a clean, structural shutdown view container
    const shutdownDiv = document.createElement('div');
    shutdownDiv.style.color = '#FFFDF0';
    shutdownDiv.style.fontSize = '32px';
    shutdownDiv.style.textAlign = 'center';
    shutdownDiv.style.marginTop = '200px';
    shutdownDiv.innerText = "Application Closed.\nThanks for playing!";
    
    document.body.appendChild(shutdownDiv);
}

// --- SWIPE HANDLING CONTROLS ---
function start_swipe(x, y) {
    start_x = x;
    start_y = y;
}

function end_swipe(end_x, end_y) {
    let diff_x = end_x - start_x;
    let diff_y = end_y - start_y;
    swipe_direction = 0; // Reset tracking variable
    
    // Core absolute value check axis logic
    if (Math.abs(diff_x) > Math.abs(diff_y)) {
        if (diff_x > 30) swipe_direction = 3;      // Right
        else if (diff_x < -30) swipe_direction = 4; // Left
    } else if (Math.abs(diff_y) > Math.abs(diff_x)) {
        if (diff_y > 30) swipe_direction = 2;      // Down
        else if (diff_y < -30) swipe_direction = 1; // Up
    }
    
    // Trigger board calculation if a valid movement threshold was crossed
    if (swipe_direction !== 0) {
        move_squares(""); // Pass empty string since it's not a keypress event
    }
}
