var player = document.getElementById("player");
var paracaidista = document.getElementById("paracaidista");
var izquierda = document.getElementById("izquierda");
var derecha = document.getElementById("derecha");
var metros = document.getElementById("metros");
var anuncio = document.getElementById("cartel");
var autores = document.getElementById("autores");
var leyenda = document.getElementById("leyenda");
var canal = 3;
var velocidad = 4000;
var timeA;
var timeB;
var timeC;
var obstA;
var obstB;
var obstC;
var intervalo;
var yaPerdi;
var yaGane;
var numero;
var racha = 250; 
var tirada = 1;
var escenario = 1;
// Escenario 1 = Día       #################################
// Escenario 2 = Noche     #################################
// Escenario 3 = Espacio   #################################
var btnMute = document.getElementById("enmudecer");
var audio = document.getElementById("audio");
var audioFail = new Audio('./sonidos/lose.mp3');
var audioWinning = new Audio('./sonidos/winning.mp3');
var audioEstrellarse = new Audio('./sonidos/estrellarse.mp3');
var load = document.getElementById("load");
var timeout;
var descenso;
var momento;

//Service Worker    #################################
//###################################################
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Registro de SW exitoso', reg))
      .catch(err => console.warn('Error al tratar de registrar el sw', err))
}


eventListeners(); 
function eventListeners(){
    izquierda.addEventListener("click", goIzquierda);
    derecha.addEventListener("click", goDerecha);
    btnMute.addEventListener("click", mutear);
    play.addEventListener("click", start);
}

//deteccion de colisiones
// https://jairogarciarincon.com/clase/videojuego-sencillo-con-html5/la-deteccion-de-colisiones
// Gracisa' por la data
cargar();
function cargar(){
    load.remove();
}


// Cargar imágenes al inicio
// https://www.delftstack.com/howto/javascript/javascript-preload-image/ 
// Gracisa' por la data
var preloaded = 0;
var imageArray = new Array(
    "./parlante muteado.svg", 
    "./player.svg",
    "./playerc.svg", 
    "./playerd.svg", 
    "./playeri.svg",
    "./paracaidas.svg",
    "./obstaculos1/0.svg",
    "./obstaculos1/1.svg",
    "./obstaculos1/2.svg",
    "./obstaculos1/3.svg",
    "./obstaculos1/4.svg",
    "./obstaculos1/5.svg",
    "./obstaculos1/6.svg",
    "./obstaculos1/7.svg",
    "./obstaculos1/8.svg",
    "./obstaculos2/0.svg",
    "./obstaculos2/1.svg",
    "./obstaculos2/2.svg",
    "./obstaculos2/3.svg",
    "./obstaculos2/4.svg",
    "./obstaculos2/5.svg",
    "./obstaculos2/6.svg",
    "./obstaculos2/7.svg",
    "./obstaculos2/8.svg",
    "./obstaculos3/0.svg",
    "./obstaculos3/1.svg",
    "./obstaculos3/2.svg",
    "./obstaculos3/3.svg",
    "./obstaculos3/4.svg",
    "./obstaculos3/5.svg",
    "./obstaculos3/6.svg",
    "./obstaculos3/7.svg",
    "./obstaculos3/8.svg"
);
preLoader();
function preLoader(e) {
    for (var i = 0; i < imageArray.length; i++) {
        var tempImage = new Image();
        tempImage.addEventListener("load", progress, true);
        tempImage.src = imageArray[i];
    }
}
function progress() {
    preloaded++;
    if (preloaded == imageArray.length) {
      mostrar();
    }
}
this.addEventListener("DOMContentLoaded", preLoader, true);

// ####################################################
function mutear() {
    if(audio.muted === false){
        audio.muted = true;
        btnMute.classList.remove("noSilenciado");
        btnMute.classList.add("silenciado");
    } else {
        audio.muted = false;
        btnMute.classList.remove("silenciado");
        btnMute.classList.add("noSilenciado");   
    } 
}


// Comenzar el juego ####################################
function start() {
    if (tirada == 1) {
        descender();
    }
    paracaidista.src="./playerc.svg";
    // Settear si va a ser de día o de noche
    momento = tirada%2;
    switch (momento) {
        case 1:
            escenario = 1;
            document.getElementById("body").classList.remove("noche");
            audio.src = "./sonidos/caida libre dia2.mp3";
            break;
        case 0:
            escenario = 2;
            document.getElementById("body").classList.add("noche");
            audio.src = "./sonidos/caida libre noche.mp3";
            break;
        default:
            break;
    }
                
    // Settear si vas a caer desde el espacio
    timeout = (racha-1000)*100;
    if (racha>1000) {
        document.getElementById("body").classList.add("espacio");
        escenario = 3;

        audio.src = "./sonidos/caida libre space.mp3";
        audio.loop = true;
        descenso = setTimeout(() => {
            if (numero<1050) {
                descender(); 
            }
        }, timeout);
    }


    document.getElementById("h3").classList.remove("invisible");
    numero = racha;
    yaPerdi = false;
    yaGane = false;
    player.classList.remove("fall");
    paracaidista.classList.add("falling");
    document.getElementById("botonera").classList.remove("none");
    document.getElementById("botonera").classList.remove("invisible");
    noMostrar();
    canal = 3;
    player.className = 'canal'+canal;
    document.addEventListener('keyup', teclas);
    paracaidista.src="./playerc.svg";
    obstA = setInterval(() => {
        if ( numero > 125 && yaPerdi == false && yaGane == false ) {
            obstaculo1();
        }
        
    }, velocidad);


    setTimeout(() => {
        obstB = setInterval(() => {
            if (numero > 125 && yaPerdi == false && yaGane == false ) {
                obstaculo2()
            }
        }, velocidad);
    }, 1500);

    setTimeout(() => {
        obstC = setInterval(() => {
            if (numero > 125 && yaPerdi == false && yaGane == false && tirada > 2) {
                obstaculo3()
            }
        }, velocidad);
    }, 3000);

    contador();
}


// Quitar los elementos espaciales 
function descender() {
    document.getElementById("body").classList.remove("espacio");
    if (momento == 1) {
        escenario = 1;        
        audio.src = "./sonidos/caida libre space dia.mp3"
    } else {
        escenario = 2;
        audio.src = "./sonidos/caida libre space noche.mp3"
    }
}


function teclas (evento) {
    switch (evento.keyCode) {
        case 37:
            evento.preventDefault();
            goIzquierda();
            break;
        case 39:
            evento.preventDefault();
            goDerecha();
            break;
        default:
            break;
    
    }
}

// Mostrar el cartel y el footer #############################################
function mostrar() {
    listos = false;
    anuncio.classList.remove('none'); 
    autores.classList.remove('none'); 
    setTimeout(() => {
        anuncio.classList.remove('invisible'); 
        autores.classList.remove('invisible'); 
    }, 200);
}

// ocultar el cartel y el footer #############################################
function noMostrar() {
    anuncio.classList.add('invisible'); 
    autores.classList.add('invisible'); 
    setTimeout(() => {
        anuncio.classList.add('none');  
        autores.classList.add('none');  
    }, 500);
}

// Metros y paracaidas ############################################################
function contador() {
    intervalo = setInterval(() => {
        if (numero > 0) {
            numero--
            metros.innerHTML=numero;


            //Aparece el paracaidas ##############################################
            if (numero == 110) {
                var img = document.createElement('img');
                img.src = "./paracaidas.svg";
                document.getElementById('cielo4').appendChild(img);
                img.classList.add("paracaidas");
                var cAleatorio = Math.ceil(Math.random() * 5)
                while (cAleatorio == canal) {
                    cAleatorio = Math.ceil(Math.random() * 5)
                }
                img.classList.add('canal'+ cAleatorio);
                setTimeout(() => {
                    img.classList.add("none");
                    img.remove();
                }, velocidad);
                var check = setInterval(() => {
                    if (
                        //la cabeza del player toca el piso del paracaidas
                        (player.getBoundingClientRect().bottom - (player.getBoundingClientRect().bottom * 0.2)) < img.getBoundingClientRect().bottom && 
                        //los pies del player con el techo del paracaidas
                        (player.getBoundingClientRect().bottom + img.height) > img.getBoundingClientRect().bottom && 
                        canal == cAleatorio && 
                        yaPerdi == false


                        ) {
                        ganaste();
                        audio.src = " ";
                        audioWinning.play();

                        clearInterval(check);
                        img.classList.add("none");
                        img.remove();
                    }
                }, 5);

            }
            // si se te pasa el paracaidas ####################################################
            if (numero < 80 && yaGane == false && yaPerdi == false ) {
                yaPerdi=true;
                player.classList.add("fuiste");
                audio.src = " ";
                audioEstrellarse.play();
                leyenda.innerHTML="Te hiciste puré. <br> Agarrar el paracaídas te hubiese venido bien."
                clearInterval(intervalo);
                clearInterval(obstA);
                clearInterval(obstB);
                clearInterval(obstC);
                tirada = 1;
                escenario = 1;
                racha = 250;
                document.getElementById("botonera").classList.add("none");
                document.getElementById("botonera").classList.add("invisible");
                document.removeEventListener("keyup", teclas);
                
                metros.innerHTML="---";
                setTimeout(() => {
                    if (yaPerdi==true) {
                        
                        mostrar();  
                    }
                }, 2000);
            }
        }
        }, 100);
}

// https://ed.team/blog/obtener-la-posicion-de-un-elemento-html-con-javascript
// Gracisa' por la data   ####################################################

function obstaculo1() {
    var img = document.createElement('img');
    img.src = "./obstaculos"+ escenario +"/"+ Math.floor(Math.random() * 9)+".svg";
    document.getElementById('cielo1').appendChild(img);
    img.classList.add("obstaculo");
    img.classList.add(player.className);

    //chequeo de colición ####################################################
    var oCanal = canal;

    setTimeout(() => {
        var check = setInterval(() => {

            if (    //la cabeza del player toca el piso del objeto ###########
                    (player.getBoundingClientRect().bottom - (player.getBoundingClientRect().bottom * 0.2)) < img.getBoundingClientRect().bottom && 
                    (player.getBoundingClientRect().bottom + img.height) > img.getBoundingClientRect().bottom && 
                    canal == oCanal && 
                    yaGane == false &&
                    yaPerdi == false){

                perdiste();
                audio.src = " ";
                audioFail.play();  
                clearInterval(check);
            }
        }, 100);
    }, 1200);

    //Esto desaparece el obstaculo ##########################################
    setTimeout(() => {
        img.classList.add("none");
        img.remove();
    }, velocidad);
} 


function obstaculo2() {
    var img = document.createElement('img');
    img.src = "./obstaculos"+ escenario +"/"+ Math.floor(Math.random() * 9)+".svg";
    document.getElementById('cielo2').appendChild(img);
    img.classList.add("obstaculo");
    var cAleatorio = Math.ceil(Math.random() * 5)
        while (cAleatorio == canal) {
        cAleatorio = Math.ceil(Math.random() * 5)
    }
    img.classList.add('canal'+ cAleatorio);


    //chequeo de colición  #################################################
    setTimeout(() => {
        var check = setInterval(() => {
            if (    //la cabeza del player toca el piso del objeto
                (player.getBoundingClientRect().bottom - (player.getBoundingClientRect().bottom * 0.2)) < img.getBoundingClientRect().bottom && 
                (player.getBoundingClientRect().bottom + img.height) > img.getBoundingClientRect().bottom && 
                canal == cAleatorio && 
                yaGane == false &&
                yaPerdi == false){

                    perdiste();
                    audio.src = " ";
                    audioFail.play();
                    clearInterval(check);
            }
        }, 5);
    }, 1200);

    //Esto desaparece el obstaculo ##########################################
    setTimeout(() => {
        img.classList.add("none");
        img.remove();
    }, velocidad);
} 


function obstaculo3() {
    var img = document.createElement('img');
    img.src = "./obstaculos"+ escenario +"/"+ Math.floor(Math.random() * 9)+".svg";
    document.getElementById('cielo3').appendChild(img);
    img.classList.add("obstaculo");
    var cAleatorio = Math.ceil(Math.random() * 5)
    img.classList.add('canal'+ cAleatorio);


    //chequeo de colición  ################################################
    setTimeout(() => {
        var check = setInterval(() => {
            if (    //la cabeza del player toca el piso del objeto
                (player.getBoundingClientRect().bottom - (player.getBoundingClientRect().bottom * 0.2)) < img.getBoundingClientRect().bottom && 
                (player.getBoundingClientRect().bottom + img.height) > img.getBoundingClientRect().bottom && 
                canal == cAleatorio && 
                yaGane == false &&
                yaPerdi == false){
                        
                    perdiste();
                    audio.src = " ";
                    audioFail.play();
                    clearInterval(check);
            }
        }, 5);
    }, 1200);

    //Esto desaparece el obstaculo ########################################
    setTimeout(() => {
        img.classList.add("none");
        img.remove();

    }, velocidad);
} 

// Ir a la izquierda   ####################################################
function goIzquierda() {
    if (canal > 1) {
        canal--;
        player.className = 'canal'+canal
        paracaidista.src="./playeri.svg"
    }    
}

// Ir a la derecha     ####################################################
function goDerecha() {
    if (canal < 5) {
        canal++;
        player.className = 'canal'+canal
        paracaidista.src="./playerd.svg"
    }
}

// ###########################################################################
function perdiste() {
    yaPerdi = true;
    clearTimeout(descenso);
    clearInterval(intervalo);
    clearInterval(obstA);
    clearInterval(obstB);
    clearInterval(obstC);
    document.getElementById("botonera").classList.add("none");
    document.getElementById("botonera").classList.add("invisible");
    document.removeEventListener("keyup", teclas);
    leyenda.innerHTML="☠ Perdiste ☠ <br> en el nivel N° " + tirada;
    metros.innerHTML="---";
    player.classList.add("rotating");
    mostrar();
    escenario = 1;
    tirada = 1;
    racha = 250;
}

// ###########################################################################
function ganaste(){
    yaGane = true;
    paracaidista.src="./player.svg"
    paracaidista.classList.remove("falling");
    player.classList.add("fall");
    clearInterval(intervalo);
    clearInterval(obstA);
    clearInterval(obstB);
    clearInterval(obstC);
    document.getElementById("botonera").classList.add("none");
    document.getElementById("botonera").classList.add("invisible");
    document.removeEventListener("keyup", teclas);
    leyenda.innerHTML="Lo conseguiste! <br> Atrapaste el paracaidas a tiempo!";
    metros.innerHTML="---";
    mostrar();
    tirada++;
    racha = racha + 250;
}

