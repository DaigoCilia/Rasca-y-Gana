// ------------------- ESCENA INICIO -------------------
class Inicio extends Phaser.Scene {

constructor(){
super("Inicio");
}

preload(){

this.load.image("fondoInicio","Fondo_2.png");
this.load.image("boton","boton.png");

}

create(){


let fondo=this.add.image(450,300,"fondoInicio");
fondo.setDisplaySize(900,600);

let boton=this.add.image(450,450,"boton")
.setScale(0.5)
.setInteractive();




this.add.text(400,440,"PLAY",{
fontSize:"28px",
fontFamily: "New Rocker",
color:"#ff0202"
});

boton.on("pointerdown",()=>{

this.scene.start("Juego");

});

}

}



// ------------------- ESCENA JUEGO -------------------
class Juego extends Phaser.Scene {

constructor(){
super("Juego");
}

preload(){

this.load.image("raspado","raspado.png");
this.load.image("brush","Brush.png");

this.load.image("sonrisa","Premio_1.png");
this.load.image("disfraz","Premio_2.png");
this.load.image("sopresa","Premio_3.png");
this.load.image("mueca","Premio_4.png");

this.load.image("fondoBoleto","FondoBoleto.png");//IMAGEN DE FONDO tipo boleto de loteria

}

create(){
// Fondo adaptado a cualquier pantalla
        this.add.image(0,0,"fondoBoleto")
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height);

this.premios=["sonrisa","disfraz","sopresa","mueca"];

this.resultados=[];
this.tarjetas=[];
this.descubiertas=0;


// contador circular
this.grafica=this.add.graphics();

this.textoPorcentaje=this.add.text(430,70,"0%",{
fontSize:"28px",
fontFamily: "New Rocker",
color:"#ffffff"
});


let posiciones=[200,450,700];

for(let i=0; i<3; i++){
    let premio = Phaser.Utils.Array.GetRandom(this.premios);
    this.resultados.push(premio);

    this.add.image(posiciones[i], 350, premio).setScale(0.5);

    let rt = this.add.renderTexture(posiciones[i], 350, 200, 200);
    //no es necesario crear un add image eso es lo que confunde a phaser por eso el error del cuadro verde
    // la rt se añade por sis ola al proyecto
    rt.setOrigin(0.5); //se alinea con las imagenes

    rt.draw("raspado", 0, 0); //llama a la imagen

    this.tarjetas.push({
        rt: rt,
        porcentaje: 0,
        descubierta: false
    });
}

// raspar
this.input.on("pointermove", (pointer) => {
    if (pointer.isDown) {
        this.tarjetas.forEach(t => {
            if (t.descubierta) return;

            let localX = pointer.x - (t.rt.x - 100);
            let localY = pointer.y - (t.rt.y - 100);

            if (localX > 0 && localX < 200 && localY > 0 && localY < 200) {

                t.rt.erase("brush", localX, localY);
                
                t.porcentaje += 0.5; 
                this.actualizarCirculo(t.porcentaje);

                if (t.porcentaje > 70) {
                    t.descubierta = true;
                    t.rt.destroy(); 
                    this.descubiertas++;
                    if (this.descubiertas === 3) this.verificarPremio();
                }
            }
        });
    }
});

}



// contador circular
actualizarCirculo(p){

this.grafica.clear();

this.grafica.lineStyle(10,0x00ff00);

this.grafica.beginPath();

this.grafica.arc(
450,
80,
40,
Phaser.Math.DegToRad(270),
Phaser.Math.DegToRad(270 + p*3.6),
false
);

this.grafica.strokePath();

this.textoPorcentaje.setText(Math.floor(p)+"%");

}



// verificar premios
verificarPremio(){

let mensaje="";

if(
this.resultados[0]===this.resultados[1] &&
this.resultados[1]===this.resultados[2]
){

mensaje="🎉YOU WON🎉";

}else{

mensaje="😢 Try Again";

}

this.add.text(360,200,mensaje,{
fontSize:"40px",
fontFamily: "New Rocker",
color:"#ffd000"
}).setOrigin(0.2);

this.botonReiniciar();

}



// boton reiniciar
botonReiniciar(){

let boton=this.add.text(380,520,"RESTART",{
fontSize:"32px",
fontFamily: "New Rocker",
color:"#9e0000",
backgroundColor:"#ffffff",
padding:10
})
.setInteractive();

boton.on("pointerdown",()=>{

this.scene.restart();

}).setOrigin(0.2);

}

}



// ------------------- CONFIGURACION -------------------
const config={

type:Phaser.AUTO,

width:900,
height:600,

scale:{
mode:Phaser.Scale.FIT,
autoCenter:Phaser.Scale.CENTER_BOTH
},

parent:"game",

scene:[Inicio,Juego]

};


const game = new Phaser.Game(config);


