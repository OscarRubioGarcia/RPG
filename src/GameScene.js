


var GameLayer = cc.Layer.extend({
    caballero:null,
    space:null,
    caminando:0,
    tecla:0,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,

    initTerminado:false,
    triggerGameOver:false,
    ctor:function () {
       this._super();
       var size = cc.winSize;
       console.log("Setup Over");

       cc.audioEngine.playMusic(res.numberone_music, true);
       //0.4
       cc.audioEngine.setMusicVolume(0.4);
       this.triggerGameOver = false;
       this.initTerminado = false;
       disableControls = false;
       spawnTimer = 240;

       this.loadAllCacheSprites();

       // Inicializar Space (sin gravedad)
       this.space = new cp.Space();
       /**
       this.depuracion = new cc.PhysicsDebugNode(this.space);
       this.addChild(this.depuracion, 10);
       **/

       this.cargarMapa();
       this.scheduleUpdate();

       this.caballero = new Caballero(this.space,
              cc.p(134,150), this);

       cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
       }, this);

       //Invocamos el método antes de resolver la colisión (realmente no habrá colisión por
       //la propiedad SENSOR).
       this.space.addCollisionHandler(colisionJugador, colisionBosque,
             null, this.colisionConBosque.bind(this), null, null);

       this.initTerminado = true;

       return true;

    },update:function (dt) {
       this.space.step(dt);

       var posicionXCamara = this.caballero.body.p.x - this.getContentSize().width/2;
       var posicionYCamara = this.caballero.body.p.y - this.getContentSize().height/2;

       if ( posicionXCamara < 0 ){
          posicionXCamara = 0;
       }
       if ( posicionXCamara > this.mapaAncho - this.getContentSize().width ){
          posicionXCamara = this.mapaAncho - this.getContentSize().width;
       }

       if ( posicionYCamara < 0 ){
           posicionYCamara = 0;
       }
       if ( posicionYCamara > this.mapaAlto - this.getContentSize().height ){
           posicionYCamara = this.mapaAlto - this.getContentSize().height ;
       }

       this.setPosition(cc.p( - posicionXCamara , - posicionYCamara));

       // izquierda
       if (this.tecla == 37 ){
        if(!disableControls) {
            if( this.caballero.body.p.x > 0){
                this.caballero.moverIzquierda();
                this.caminando = 1;

                console.log("i :"+spawnTimer);
            } else {
                this.caballero.detener();
            }
           }
       }
       // derecha
       if (this.tecla == 39 ){
        if(!disableControls) {
            if( this.caballero.body.p.x < this.mapaAncho){
                this.caballero.moverDerecha();
                this.caminando = 1;

                console.log("i :"+spawnTimer);
            } else {
                this.caballero.detener();
            }
           }
       }
        // arriba
       if (this.tecla == 38 ){
        if(!disableControls) {
            if( this.caballero.body.p.y < this.mapaAlto){
                this.caballero.moverArriba();
                this.caminando = 1;

                console.log("i :"+spawnTimer);
            } else {
                this.caballero.detener();
            }
           }
       }

       // abajo
       if (this.tecla == 40 ){
        if(!disableControls) {
            if( this.caballero.body.p.y > 0){
                this.caballero.moverAbajo();
                this.caminando = 1;

                console.log("i :"+spawnTimer);
            } else {
                this.caballero.detener();
            }
           }
       }


       // ninguna pulsada
       if( this.tecla == 0 ){
        if(!disableControls) {
            this.caballero.detener();
            this.caminando = 0;
           }
       }

       if(this.initTerminado) {

           this.getParent().getChildByTag(idCapaHUD).actualizarVida(this.caballero.vitality);
           this.getParent().getChildByTag(idCapaHUD).actualizarNivel(this.caballero.level);
           this.getParent().getChildByTag(idCapaHUD).updateExperience(this.caballero.experience);

           if(this.caballero.vitality<=0) {
                console.log("Game Over detected" + this.triggerGameOver);
                      if(!this.triggerGameOver) {

                          var parent = this.getParent();
                          console.log("Triggered Over");
                          this.triggerGameOver = true;
                          cc.audioEngine.stopMusic();
                          parent.getChildByTag(idCapaJuego).removeFromParent(true);
                          parent.getChildByTag(idCapaHUD).removeFromParent(true);
                          cc.director.runScene(new cc.TransitionFade.create(8, new MenuScene(), new cc.Color(0, 0, 0)));

                      }

           }
       }

    }, cargarMapa:function () {
       this.mapa = new cc.TMXTiledMap(res.mapa2_tmx);
       this.mapa.zorder = 0;
       // Añadirlo a la Layer
       this.addChild(this.mapa);
       // Ancho del mapa
       this.mapaAncho = this.mapa.getContentSize().width;
       this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objeto dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("Limites");
        var limitesArray = grupoLimites.getObjects();

        // Los objetos de la capa limites
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < limitesArray.length; i++) {
              var limite = limitesArray[i];
              var puntos = limite.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodyLimite = new cp.StaticBody();

                  var shapeLimite = new cp.SegmentShape(bodyLimite,
                      cp.v(parseInt(limite.x) + parseInt(puntos[j].x),
                          parseInt(limite.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(limite.x) + parseInt(puntos[j + 1].x),
                          parseInt(limite.y) - parseInt(puntos[j + 1].y)),
                      1);

                  shapeLimite.setFriction(1);
                  shapeLimite.setElasticity(0);
                  shapeLimite.setCollisionType(colisionPared);
                  this.space.addStaticShape(shapeLimite);
              }
        }

        // Solicitar los objeto dentro de la capa Spawners
        var grupoSpawn = this.mapa.getObjectGroup("SpawnersBosque");
        var spawnersArray = grupoSpawn.getObjects();

        // Los objetos de la capa SpwanersBosque
        // formas estáticas de Chipmunk ( SegmentShape ).
        // El sensor les combierte en fantasmas
        for (var i = 0; i < spawnersArray.length; i++) {

              var body = new cp.StaticBody();
              body.p = cc.p(parseInt(spawnersArray[i].x) + 130,  parseInt(spawnersArray[i].y) + 145);

              shape = new cp.BoxShape(body, spawnersArray[i].width, spawnersArray[i].height);

              shape.setCollisionType(colisionBosque);
              shape.setSensor(true);
              this.space.addStaticShape(shape);
        }
    }, colisionConBosque: function(arbiter, space){

         if(this.caminando == 1) {
            spawnTimer++;
            cc.audioEngine.resumeMusic();
         }

         if(spawnTimer >= 250)
         {
            console.log("Combate en Bosque.");
            spawnTimer = 0;

            cc.audioEngine.setEffectsVolume(0.1);
            cc.audioEngine.playEffect(res.effectfight_sound,false);

            //Pause no funciona pero stop si.
            cc.audioEngine.pauseMusic();

            //Freeze This layer
            //Disable all controls
            disableControls = true;
            this.caballero.detener();
            this.caminando = 0;

            //Change to battleLayer
            var battlelayer = new BattleLayer(this.caballero);
            this.getParent().addChild(battlelayer, 2, idCapaBatalla);

            var battlelayerHUD = new BattleLayerHUD(this.caballero, "Bosque");
            this.getParent().addChild(battlelayerHUD, 2, idCapaBatallaControles);
            //wait till battlelayer is finished to reenable controls

         }

    },teclaPulsada: function(keyCode, event){
         var instancia = event.getCurrentTarget();

         instancia.tecla = keyCode;

    },teclaLevantada: function(keyCode, event){
         var instancia = event.getCurrentTarget();

         if ( instancia.tecla  == keyCode){
            instancia.tecla = 0;
         }
    },loadAllCacheSprites : function() {

        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.hud_plist);
        cc.spriteFrameCache.addSpriteFrames(res.heart_bar_plist);
        cc.spriteFrameCache.addSpriteFrames(res.robbie_plist);
        cc.spriteFrameCache.addSpriteFrames(res.sara_batalla_plist);
        cc.spriteFrameCache.addSpriteFrames(res.fire_plist);
        cc.spriteFrameCache.addSpriteFrames(res.ultima_plist);
        cc.spriteFrameCache.addSpriteFrames(res.green_smoke_plist);
        cc.spriteFrameCache.addSpriteFrames(res.daggers_plist);
        cc.spriteFrameCache.addSpriteFrames(res.sara_death_plist);
        cc.spriteFrameCache.addSpriteFrames(res.malboro_green_plist);

    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var hudlayer = new HUDLayer();
        this.addChild(hudlayer, 1, idCapaHUD);
    }
});
