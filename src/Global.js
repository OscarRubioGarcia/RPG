var spawnTimer = 0;
var disableControls = false;

var idCapaJuego = 1;
var idCapaHUD = 2;
var idCapaBatalla = 3;
var idCapaBatallaControles = 4;

var colisionPared = 0;
var colisionBosque = 1;
var colisionDesierto = 2;
var colisionPuente = 3;
var colisionJugador = 4;

var _b_getFontName = function(resource) {
    if (cc.sys.isNative) {
        return resource.srcs[0];
    } else {
        return resource.name;
    }
}