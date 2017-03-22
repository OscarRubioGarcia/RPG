

var HUDLayer = cc.Layer.extend({
    etiquetaNivel:null,
    nivel:0,
    etiquetaVida:null,
    vidaActual:null,
    triggerLevelUp:false,

    inteligencia:null,
    fuerza:null,
    velocidad:null,
    etiquetaSubirNivel:null,

    lock:false,
    levelCounter:0,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        console.log("Setup HUD");

        this.inteligencia = new cc.Sprite.create(res.inteligencia_png);
        this.inteligencia.setPosition(cc.p(size.width * 0.35, size.height * 0.65));
        this.inteligencia.setOpacity(0);
        this.addChild(this.inteligencia, 11);

        this.fuerza = new cc.Sprite.create(res.fuerza_png);
        this.fuerza.setPosition(cc.p(size.width * 0.5, size.height * 0.65));
        this.fuerza.setOpacity(0);
        this.addChild(this.fuerza, 11);

        this.velocidad = new cc.Sprite.create(res.velocidad_png);
        this.velocidad.setPosition(cc.p(size.width * 0.65, size.height * 0.65));
        this.velocidad.setOpacity(0);
        this.addChild(this.velocidad, 11);

        this.etiquetaSubirNivel = new cc.LabelTTF("You Leveled Up!", _b_getFontName(res.mana_font_tff), 24);
        this.etiquetaSubirNivel.fillStyle = new cc.Color(255, 255, 255);
        this.etiquetaSubirNivel.setPosition(cc.p(size.width * 0.5, size.height * 0.85));
        this.etiquetaSubirNivel.setOpacity(0);
        this.addChild(this.etiquetaSubirNivel, 11);


        //Bloque 1
        var spritehud = new cc.Sprite.create("#player_hud.png");
        spritehud.setScale(2);
        spritehud.setAnchorPoint(cc.p(0.5,0.5));
        spritehud.setPosition(cc.p(size.width - 730 , size.height - 40 ));
        this.addChild(spritehud, 0);

        //Foto 1
        var spritehud = new cc.Sprite.create(res.sara_portrait_png);
        spritehud.setScale(0.75);
        spritehud.setAnchorPoint(cc.p(0.5,0.5));
        spritehud.setPosition(cc.p(size.width - 760 , size.height - 40 ));
        this.addChild(spritehud, 0);

        // Contador Nivel
        this.etiquetaNivel = new cc.LabelTTF("Lvl1", _b_getFontName(res.mana_font_tff), 16);
        this.etiquetaNivel.setPosition(cc.p(size.width - 700, size.height - 30));
        this.etiquetaNivel.fillStyle = new cc.Color(255, 255, 255);
        this.addChild(this.etiquetaNivel, 1);

        //Vida
        this.etiquetaVida = new cc.LabelTTF("" + this.vidaActual, _b_getFontName(res.mana_font_tff), 16);
        this.etiquetaVida.setPosition(cc.p(size.width - 690, size.height - 52));
        this.etiquetaVida.fillStyle = new cc.Color(255, 255, 255);
        this.addChild(this.etiquetaVida, 1);


        //Innecesario
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMousePresionado
        }, this)

        this.scheduleUpdate();
        return true;
    },update:function (dt) {

        if(this.triggerLevelUp) {
            var size = cc.winSize;

            this.inteligencia.setOpacity(255);
            this.fuerza.setOpacity(255);
            this.velocidad.setOpacity(255);
            this.etiquetaSubirNivel.setOpacity(255);

            disableControls = true;

        } else {

            this.inteligencia.setOpacity(0);
            this.fuerza.setOpacity(0);
            this.velocidad.setOpacity(0);
            this.etiquetaSubirNivel.setOpacity(0);
        }

    }, subirNivel:function(){
         this.nivel++;
         this.etiquetaNivel.setString("Lvl" + this.nivel);
    }, actualizarVida:function(vida){
         //this.vidaActual = this.getParent().getChildByTag(idCapaJuego).caballero.vitality;
         this.etiquetaVida.setString("" + vida);
    }, actualizarNivel:function(nivel){
          //this.nivel = this.getParent().getChildByTag(idCapaJuego).caballero.level;
          this.etiquetaNivel.setString("Lvl" + nivel);
    }, updateExperience : function (experience) {
        //Actualizar barra azul de experiencia
        //innecesario
    }, procesarMousePresionado : function(event) {
        var instancia = event.getCurrentTarget();

        var act = cc.RotateBy.create(1, 360);
        var noact = cc.RotateBy.create(1, 0);

            if(instancia.triggerLevelUp) {

                var areaBotonFuerza = instancia.fuerza.getBoundingBox();
                var areaBotonInteligencia = instancia.inteligencia.getBoundingBox();
                var areaBotonVelocidad = instancia.velocidad.getBoundingBox();

                var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

                // La pulsación cae dentro del botón fuerza
                if (cc.rectContainsPoint(areaBotonFuerza, cc.p(event.getLocationX(), event.getLocationY()) )){

                    cc.eventManager.setEnabled(false);

                    gameLayer.caballero.subirNivel("fuerza");

                    instancia.levelCounter--;

                    if(instancia.levelCounter <= 0) {
                        instancia.deleteSprites();

                        disableControls = false;
                        instancia.triggerLevelUp = false;
                    }

                    cc.eventManager.setEnabled(true);
                }
                if (cc.rectContainsPoint(areaBotonInteligencia, cc.p(event.getLocationX(), event.getLocationY()) )){

                    cc.eventManager.setEnabled(false);

                    gameLayer.caballero.subirNivel("inteligencia");

                    instancia.levelCounter--;

                    if(instancia.levelCounter <= 0) {
                        instancia.deleteSprites();

                        disableControls = false;
                        instancia.triggerLevelUp = false;
                    }

                    cc.eventManager.setEnabled(true);

                }
                if (cc.rectContainsPoint(areaBotonVelocidad, cc.p(event.getLocationX(), event.getLocationY()) )){

                    cc.eventManager.setEnabled(false);

                    gameLayer.caballero.subirNivel("velocidad");

                    instancia.levelCounter--;
                    console.log(instancia.levelCounter);

                    if(instancia.levelCounter <= 0) {
                        instancia.deleteSprites();

                        disableControls = false;
                        instancia.triggerLevelUp = false;
                    }

                    cc.eventManager.setEnabled(true);
                }
            }
    }, deleteSprites : function() {

            this.fuerza.setOpacity(0);
            this.inteligencia.setOpacity(0);
            this.velocidad.setOpacity(0);
            this.etiquetaSubirNivel.setOpacity(0);

    }, checkLevelUp : function( expGained ) {

        var parent = this.getParent();

        var level = parent.getChildByTag(idCapaJuego).caballero.checkSubirNivel(expGained);
        console.log("Niveles subidos "+level);
        if(level >= 1) {
            this.levelCounter = level;
            this.triggerLevelUp = true;
        }

    }
});


