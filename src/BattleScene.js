var BattleLayer = cc.Layer.extend({
    etiquetaNivel:null,
    fondoBatalla:null,
    caballero:null,
    ctor:function (caballero) {
        this._super();
        var size = cc.winSize;
        this.caballero = caballero;

        // Fondo Batalla
        this.fondoBatalla = new cc.Sprite.create(res.fondo_batalla_png);
        this.fondoBatalla.setScale(0.75);
        this.fondoBatalla.setAnchorPoint(cc.p(0.5,0.5));
        this.fondoBatalla.setPosition(cc.p(size.width / 2 , size.height / 2 ));
        this.fondoBatalla.setOpacity(255);
        this.addChild(this.fondoBatalla, 0);

        this.scheduleUpdate();
        return true;
    },update:function (dt) {
    }
});

var healthBarTag = 10;

var BattleLayerHUD = cc.Layer.extend({
    etiquetaAtacar:null,
    etiquetaMagia:null,
    etiquetaItem:null,

    caballero:null,
    caballero_falso:null,
    enemigo:null,
    turnoEnemigo:null,
    fightover:false,

    fondoBatallaHUD:null,

    spriteBotonAtacar:null,
    spriteBotonMagia:null,
    spriteBotonItem:null,
    spriteBotonEsperar:null,
    spriteBotonRun:null,

    animacionheart:null,
    animacionheartBreak:null,
    spriteBarraTurno:null,
    etiquetaTurno:null,
    etiquetaVida:null,
    etiquetaRun:null,

    healthBar:null,
    timerActivated:false,
    doOnce:false,
    checkAttacked:false,
    turnTimer:false,
    turnoDecidido:0,
    noMore:false,
    escaped:false,
    ctor:function (caballero, area) {
        this._super();
        var size = cc.winSize;

        var fightSong = Math.floor(Math.random() * (10 + 1 - 1 + 1)) + 1;

        if(fightSong > 5) {
            cc.audioEngine.playEffect(res.fight_music_1, true);
        }
        else {
            cc.audioEngine.playEffect(res.fight_music_2, true);
        }

        this.caballero = caballero;
        this.caballero_falso = new Caballero_Batalla(this.caballero, cc.p(size.width * 0.2 , size.height *0.45 ), this);

        if(area=="Bosque") {
            this.enemigo = new EnemigoBosque(this.caballero.level, cc.p(size.width * 0.8 , size.height *0.65 ), this);
        } else if(area=="Puente") {
            //Nada
        }  else if(area=="Desierto") {
            //Nada
        } else {
            //Nada
        }

        if(this.caballero.speed > this.enemigo.speed) {
            this.turnoEnemigo = false;
            this.turnoDecidido = 1;
        }
        else {
            this.turnoEnemigo = true;
            this.turnoDecidido = 1;
        }

        // Fondo Comandos Pelea
        this.fondoBatallaHUD = new cc.Sprite.create(res.fondo_batalla_hud_png);
        this.fondoBatallaHUD.setScale(2);
        this.fondoBatallaHUD.setAnchorPoint(cc.p(0.5,0.5));
        this.fondoBatallaHUD.setPosition(cc.p(size.width / 2 , size.height - 370 ));
        this.addChild(this.fondoBatallaHUD, 1);

        //Botones
        //Boton atacar
        this.spriteBotonAtacar = cc.Sprite.create("#player_attack.png");
        this.spriteBotonAtacar.setPosition(cc.p(size.width*0.2, size.height*0.25));
        this.spriteBotonAtacar.setScale(2);
        this.addChild(this.spriteBotonAtacar, 2);

        this.etiquetaAtacar = new cc.LabelTTF("Attack", _b_getFontName(res.mana_font_tff), 20);
        this.etiquetaAtacar.setPosition(cc.p(size.width *0.2, size.height *0.20));
        this.etiquetaAtacar.fillStyle = new cc.Color(255, 0, 100);
        this.addChild(this.etiquetaAtacar, 2);

         //Boton magia
         this.spriteBotonMagia = cc.Sprite.create("#player_magic.png");
         this.spriteBotonMagia.setPosition(cc.p(size.width*0.31, size.height*0.25));
         this.spriteBotonMagia.setScale(2);
         this.addChild(this.spriteBotonMagia, 2);

         this.etiquetaMagia = new cc.LabelTTF("Magic", _b_getFontName(res.mana_font_tff), 20);
         this.etiquetaMagia.setPosition(cc.p(size.width *0.31, size.height *0.20));
         this.etiquetaMagia.fillStyle = new cc.Color(0, 200, 255);
         this.addChild(this.etiquetaMagia, 2);

         //Boton item
         this.spriteBotonItem = cc.Sprite.create("#player_item.png");
         this.spriteBotonItem.setPosition(cc.p(size.width*0.42, size.height*0.25));
         this.spriteBotonItem.setScale(2);
         this.addChild(this.spriteBotonItem, 2);

         this.etiquetaItem = new cc.LabelTTF("Potion", _b_getFontName(res.mana_font_tff), 20);
         this.etiquetaItem.setPosition(cc.p(size.width *0.42, size.height *0.20));
         this.etiquetaItem.fillStyle = new cc.Color(255, 255, 255);
         this.addChild(this.etiquetaItem, 2);

         //Boton item
         this.spriteBotonRun = cc.Sprite.create(res.run_away_png);
         this.spriteBotonRun.setPosition(cc.p(size.width*0.53, size.height*0.25));
         this.spriteBotonRun.setScale(2);
         this.addChild(this.spriteBotonRun, 2);

         this.etiquetaRun = new cc.LabelTTF("Run", _b_getFontName(res.mana_font_tff), 20);
         this.etiquetaRun.setPosition(cc.p(size.width *0.53, size.height *0.20));
         this.etiquetaRun.fillStyle = new cc.Color(255, 255, 255);
         this.addChild(this.etiquetaRun, 2);

         this.healthBar = cc.ProgressTimer.create(cc.Sprite.create(res.health_bar_1_png));
         this.healthBar.setType(cc.ProgressTimer.TYPE_BAR);
         this.healthBar.setBarChangeRate(cc.p(1,0));
         this.healthBar.setMidpoint(cc.p(0,0));
         this.healthBar.setPosition(cc.p(size.width*0.8, size.height*0.95));
         this.healthBar.setScale(4);
         this.addChild(this.healthBar, 3, healthBarTag);

         var overlay = cc.Sprite.create(res.health_bar_1_overlay_png);
         overlay.setPosition(cc.p(size.width*0.8, size.height*0.95));
         overlay.setScale(4);
         this.addChild(overlay, 2);

         //Set the health
         var to1 = cc.progressTo(1, 100);
         this.healthBar.runAction(to1);

        // Crear animación -  heart latiendo
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "heart_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionheart =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación -  heart break
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "heartBroken_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionheartBreak = new cc.Animate(animacion);

        this.heart = cc.Sprite.create("#heart_01.png");
        this.heart.setPosition(cc.p(size.width*0.65, size.height*0.95));
        this.heart.setScale(2.75);
        this.heart.runAction(this.animacionheart);
        this.addChild(this.heart, 3);

        this.spriteBarraTurno = cc.ProgressTimer.create(cc.Sprite.create(res.bar_turns_png));
        this.spriteBarraTurno.setType(cc.ProgressTimer.TYPE_BAR);
        this.spriteBarraTurno.setBarChangeRate(cc.p(1,0));
        this.spriteBarraTurno.setMidpoint(cc.p(0,0));
        this.spriteBarraTurno.setPosition(cc.p(size.width/2, size.height*0.8));
        this.heart.setScale(4);
        this.addChild(this.spriteBarraTurno, 3);

        this.etiquetaTurno = new cc.LabelTTF("Enemy Turn!", _b_getFontName(res.mana_font_tff), 20);
        this.etiquetaTurno.setPosition(cc.p(size.width*0.48, size.height *0.95));
        this.etiquetaTurno.fillStyle = new cc.Color(255, 255, 255);
        this.addChild(this.etiquetaTurno, 3);

        this.etiquetaVida = new cc.LabelTTF("", _b_getFontName(res.mana_font_tff), 30);
        this.etiquetaVida.setPosition(cc.p(size.width*0.1, size.height *0.90));
        this.etiquetaVida.fillStyle = new cc.Color(255, 255, 255);
        this.addChild(this.etiquetaVida, 3);

         // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this)

        this.scheduleUpdate();
        return true;
    },update:function (dt) {
        this.updateHealth();

        if(this.turnoDecidido != 0)
            if(!this.fightover)
                if(this.turnoEnemigo) {
                        this.doOnce = true;
                        //if(!this.doOnce)
                        //    this.cambioTurno(this.spriteBarraTurno, this.etiquetaTurno, "Enemy Turn!");

                        //se checkea si el jugador gano
                        this.checkFightOver(this.enemigo, this.animacionheartBreak, this.heart);
                        //enemigo ataca
                        if(!this.checkAttacked)
                            this.atacaEnemigo(this.enemigo, this.caballero);
                        //se checkea si el jugador perdio
                        this.checkGameOver(this.caballero);

                        if(this.checkAttacked && this.doOnce) {
                            if(!this.turnTimer) {

                                this.turnTimer = true;

                                //Find way to delay time without using this since it goes into oblivion
                                setTimeout( this.setVariables() ,4000);

                            }
                        }
                } else {
                        if(!this.doOnce) {
                            this.cambioTurno(this.spriteBarraTurno, this.etiquetaTurno, "Player Turn!");
                            cc.eventManager.setEnabled(true);
                            }

                        this.turnTimer = false;
                        this.checkAttacked = false;
                        //se checkea si el jugador gano
                        this.checkFightOver(this.enemigo, this.animacionheartBreak, this.heart);
                        //player ataca
                        //se checkea si el jugador perdio
                        this.checkGameOver(this.caballero);
                }
            else {

                var parent = this.getParent();

                if(this.enemigo.vitality<=0) {
                    this.etiquetaTurno.setString("Victory!");
                    var sound = res.victory_sound;

                    if(!this.noMore) {
                        this.noMore = true;
                        parent.getChildByTag(idCapaHUD).checkLevelUp(this.enemigo.experience);
                    }
                 } else {
                    var sound = res.tragedy_music;
                 }

                 if(this.escaped) {
                     this.etiquetaTurno.setString("You Escaped!");
                     var sound = res.victory_sound;
                 }

                if(!this.timerActivated) {
                    this.timerActivated = true;
                    cc.audioEngine.stopAllEffects();
                    cc.audioEngine.playEffect(sound, false);
                    setTimeout( function(){
                           disableControls = false;
                           cc.eventManager.setEnabled(true);
                           cc.audioEngine.resumeMusic();
                           cc.audioEngine.stopAllEffects();
                           parent.getChildByTag(idCapaBatalla).removeFromParent(true);
                           parent.getChildByTag(idCapaBatallaControles).removeFromParent(false);
                        },6000);
                }
            }

    }, subirNivel:function(){
         this.caballero.level++;
    },procesarMouseDown:function(event) {
         var instancia = event.getCurrentTarget();

         var areaBotonAtacar = instancia.spriteBotonAtacar.getBoundingBox();
         var areaBotonMagia = instancia.spriteBotonMagia.getBoundingBox();
         var areaBotonItem = instancia.spriteBotonItem.getBoundingBox();
         var areaBotonRun = instancia.spriteBotonRun.getBoundingBox();

         // La pulsación cae dentro del botón atacar
         if (cc.rectContainsPoint(areaBotonAtacar, cc.p(event.getLocationX(), event.getLocationY()) )){

             cc.eventManager.setEnabled(false);

             // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
             var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

             //Atacar
             var daño = gameLayer.caballero.atacar();
             console.log("Daño " + daño);

             //Set damage
             var vida_enemigo = instancia.enemigo.vitality;
             var vidaTotal_enemigo = instancia.enemigo.maxvitality;
             var damagedone = ((vida_enemigo  - daño) / vidaTotal_enemigo) * 100;

             instancia.enemigo.vitality -= daño;
             var to1 = cc.progressTo(1, ((instancia.enemigo.vitality/instancia.enemigo.maxvitality)*100));
             this._node.getChildByTag(healthBarTag).runAction(to1);

             //Pausar Turno y hacer animacion
             instancia.caballero_falso.atacar();
             instancia.enemigo.recibirDaño();
             instancia.cambioTurno(instancia.spriteBarraTurno, instancia.etiquetaTurno, "Enemy Turn!");
             instancia.showDamage(daño, "daño");

             setTimeout( function(){
                instancia.turnoEnemigo = true;
                instancia.doOnce = false;
             },4000);
         }

         // La pulsación cae dentro del botón atacar con Magia
         if (cc.rectContainsPoint(areaBotonMagia, cc.p(event.getLocationX(), event.getLocationY()) )){

             cc.eventManager.setEnabled(false);

             // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
             var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

             //Magia
             var daño_magico = gameLayer.caballero.magia();
             console.log("Daño Magico " + daño_magico);

             //Set damage
              var vida_enemigo = instancia.enemigo.vitality;
              var vidaTotal_enemigo = instancia.enemigo.maxvitality;
              var damagedone = ((vida_enemigo  - daño_magico) / vidaTotal_enemigo) * 100;

              instancia.enemigo.vitality -= daño_magico;
              var to1 = cc.progressTo(1, ((instancia.enemigo.vitality/instancia.enemigo.maxvitality)*100));
              this._node.getChildByTag(healthBarTag).runAction(to1);

              //Pausar Turno y hacer animacion
              instancia.caballero_falso.magia();
              instancia.enemigo.recibirDaño();
              instancia.cambioTurno(instancia.spriteBarraTurno, instancia.etiquetaTurno, "Enemy Turn!");
              instancia.showDamage(daño_magico, "daño");

              setTimeout( function(){
                 instancia.turnoEnemigo = true;
                 instancia.doOnce = false;
              },4000);


         }

         // La pulsación cae dentro del botón Objetos
         if (cc.rectContainsPoint(areaBotonItem, cc.p(event.getLocationX(), event.getLocationY()) )){

             cc.eventManager.setEnabled(false);

             // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
             var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

             //Magia
             var cura = gameLayer.caballero.potion();
             console.log("Curacion " + cura);

             //Pausar Turno y hacer animacion
             instancia.caballero_falso.potion();
             instancia.etiquetaTurno.setString("Enemy Turn!");
             instancia.showDamagePlayer(cura, "cura");

             setTimeout( function(){
                instancia.turnoEnemigo = true;
                instancia.doOnce = false;
             },4000);

         }

         if (cc.rectContainsPoint(areaBotonRun, cc.p(event.getLocationX(), event.getLocationY()) )){

              cc.eventManager.setEnabled(false);

              // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
              var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);

              //Escape
              var run = gameLayer.caballero.escape(instancia.enemigo.level);

              var chance = Math.floor(Math.random() * 9) + 0;

              if( chance < (run*10)) {

                instancia.escapeFight();
                instancia.showDamagePlayer(0, "exito");

              } else {
                instancia.etiquetaTurno.setString("Enemy Turn!");
                instancia.showDamagePlayer(0, "cura");
              }

              setTimeout( function(){
                 instancia.turnoEnemigo = true;
                 instancia.doOnce = false;
              },4000);

         }
    },checkFightOver:function (enemigo, animacion, heart) {
            if(enemigo.vitality <= 0)
            {
                var sequence = new cc.Sequence(animacion, new cc.RemoveSelf(false));
                heart.runAction(sequence);
                this.fightover = true;
            }
    },cambioTurno:function ( barraTurno, etiqueta, string) {

        //Set the turn
        /* To be implemented in the future if time
        var to1 = cc.progressTo(0.5, 100);
        var to2 = cc.progressTo(0.5, 0);
        var pause = new cc.DelayTime(1);
        barraTurno.runAction(new cc.Sequence(to1, pause, to2));
        */

        this.doOnce = true;

        etiqueta.setString(string);

    },atacaEnemigo(enemigo, caballero) {

        var size = cc.winSize;
        this.checkAttacked = true;

        var daño = enemigo.atacar(cc.p(size.width * 0.8 , size.height *0.65 ), this, cc.p(size.width * 0.2 , size.height *0.45 ));
        console.log("Daño Enemigo " + daño);

        var vida_jugador = caballero.vitality;
        var vidaTotal_jugador = caballero.maxvitality;

        if(daño >= vida_jugador){
            caballero.vitality = 0;
        }
        else
        {
            caballero.vitality = (vida_jugador - daño);
        }

        if(daño == 0)
        {
            this.showDamagePlayer("Miss!", "cura");
        } else {
            this.showDamagePlayer(daño, "daño");
        }

    },checkGameOver(caballero) {

        if(caballero.vitality<=0)
        {
            caballero.vitality = 0;
            this.etiquetaTurno.setString("Game Over");
            this.fightover = true;
            this.caballero_falso.death();
        }

    },updateHealth() {

        this.etiquetaVida.setString(this.caballero.vitality+"/"+this.caballero.maxvitality);

    }, setVariables() {

        this.turnoEnemigo = false;
        this.doOnce = false;
    }, checkSpeed() {

        if(this.caballero.speed > this.enemigo.speed)
            this.turnoEnemigo = false;
        else
            this.turnoEnemigo = true;

    },showDamage(daño, tipo) {

        var size = cc.winSize;

        if(daño==0) {
            var dañoEnemigo = new cc.LabelTTF("Miss!" , _b_getFontName(res.mana_font_tff), 24);
        } else {
            var dañoEnemigo = new cc.LabelTTF("" + daño, _b_getFontName(res.mana_font_tff), 24);
        }

        var Randx = (Math.random() * (0.700 - 0.900) + 0.900).toFixed(3);
        var Randy = (Math.random() * (0.550 - 0.750) + 0.750).toFixed(3);
        //cc.p(size.width * 0.8 , size.height *0.65 )

        if(tipo == "daño") {
            dañoEnemigo.setPosition(cc.p(size.width * Randx, size.height * Randy));
            dañoEnemigo.fillStyle = new cc.Color(243, 192, 65);
            this.addChild(dañoEnemigo, 99);

            var pause = cc.RotateBy.create(2, 0);
            dañoEnemigo.runAction(new cc.Sequence(pause,  new cc.RemoveSelf(false)));
        } else {

            dañoEnemigo.setPosition(cc.p(size.width * Randx, size.height * Randy));
            dañoEnemigo.fillStyle = new cc.Color(104, 255, 81);
            this.addChild(dañoEnemigo, 99);

            var pause = cc.RotateBy.create(2, 0);
            dañoEnemigo.runAction(new cc.Sequence(pause,  new cc.RemoveSelf(false)));
        }

    },showDamagePlayer(daño, tipo) {

         var size = cc.winSize;

         if(daño==0) {
             var dañoEnemigo = new cc.LabelTTF("Miss!" , _b_getFontName(res.mana_font_tff), 24);
         } else {
             var dañoEnemigo = new cc.LabelTTF("" + daño, _b_getFontName(res.mana_font_tff), 24);
         }

         var Randx = (Math.random() * (0.150 - 0.250) + 0.250).toFixed(3);
         var Randy = (Math.random() * (0.400 - 0.500) + 0.500).toFixed(3);
         //cc.p(size.width * 0.2 , size.height *0.45 )

         if(tipo=="daño") {
             dañoEnemigo.setPosition(cc.p(size.width * Randx, size.height * Randy));
             dañoEnemigo.fillStyle = new cc.Color(240, 73, 3);
             this.addChild(dañoEnemigo, 99);

             var pause = cc.RotateBy.create(2, 0);
             dañoEnemigo.runAction(new cc.Sequence(pause,  new cc.RemoveSelf(false)));
         } else if(tipo=="exito") {
             var dañoEnemigo = new cc.LabelTTF("Success!", _b_getFontName(res.mana_font_tff), 24);

             dañoEnemigo.setPosition(cc.p(size.width * Randx, size.height * Randy));
             dañoEnemigo.fillStyle = new cc.Color(0, 124, 174);
             this.addChild(dañoEnemigo, 99);

             var pause = cc.RotateBy.create(2, 0);
             dañoEnemigo.runAction(new cc.Sequence(pause,  new cc.RemoveSelf(false)));
         } else {
             dañoEnemigo.setPosition(cc.p(size.width * Randx, size.height * Randy));
             dañoEnemigo.fillStyle = new cc.Color(104, 255, 81);
             this.addChild(dañoEnemigo, 99);

             var pause = cc.RotateBy.create(2, 0);
             dañoEnemigo.runAction(new cc.Sequence(pause,  new cc.RemoveSelf(false)));
         }
    }, escapeFight : function() {

        this.fightover = true;
        this.escaped = true;

    }
});


