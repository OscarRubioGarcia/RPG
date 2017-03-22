var Caballero_Batalla = cc.Class.extend({
    sprite:null,
    layer:null,
    myPosicion:null,

    animacionQuieto:null,
    animacionQuietoFalsa:null,
    animacionAtaque:null,
    animacionMagia:null,
    animacionUltima:null,
    animacionFire:null,
    animacionMuerte:null,
    animacion:null, // Actual

    caballero:null,

ctor:function (caballero, posicion, layer) {

    this.caballero = caballero;

    this.layer = layer;
    this.myPosicion = posicion;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.Sprite("#sara_ataque_0.png");

     // Crear animación - ataque 71
    var framesAnimacion = [];
    for (var i = 1; i <= 5; i++) {
        var str = "fire_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.17);
    this.animacionFire =  new cc.Animate(animacion);

     // Crear animación - ataque 71
    var framesAnimacion = [];
    for (var i = 1; i <= 6; i++) {
        var str = "sara_death_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionMuerte =  new cc.Animate(animacion);

    // Crear animación - ataque
    var framesAnimacion = [];
    for (var i = 0; i <= 1; i++) {
        var str = "sara_magia_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.3);
    this.animacionQuieto =  new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - ataque
    var framesAnimacion = [];
    for (var i = 0; i <= 0; i++) {
        var str = "sara_ataque_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionQuietoFalsa =  new cc.Animate(animacion);

    // Crear animación - ataque
    var framesAnimacion = [];
    for (var i = 0; i <= 7; i++) {
        var str = "sara_ataque_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionAtaque = new cc.Animate(animacion);

    // Crear animación - magia y objeto
    var framesAnimacion = [];
    for (var i = 0; i <= 6; i++) {
        var str = "sara_magia_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionMagia = new cc.Animate(animacion);

    // ejecutar la animación
    this.sprite.runAction(this.animacionQuieto);
    this.animacion = this.animacionQuieto;
    this.sprite.setPosition(posicion);
    layer.addChild(this.sprite,10);

    }, atacar : function(posicionEnemigo) {

        console.log("Atacando");
        var size = cc.winSize;

        //animacion
        this.sprite.stopAllActions();
        this.animacion = this.animacionAtaque;

        var seq = new cc.Sequence(this.animacion, new cc.CallFunc.create(this.detener, this));
        this.sprite.runAction(seq);

        // 3 Dagger
        for (var i = 0; i <= 2; i++) {
              var Randy = (Math.random() * ((this.myPosicion.y-30) - (this.myPosicion.y+30)) + (this.myPosicion.y+30)).toFixed(3);
              var rand = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

              if(rand > 5) {
                var dagger = new cc.Sprite("#daggers_01.png");
                dagger.setScale(1);
                cc.audioEngine.playEffect(res.dagger_1_sound,false);
              } else {
                var dagger = new cc.Sprite("#daggers_02.png");
                dagger.setScale(1.3);
                cc.audioEngine.playEffect(res.dagger_2_sound,false);
              }

              //animacion espada
              dagger.setPosition(cc.p(this.myPosicion.x+35, this.myPosicion.y-5));
              this.layer.addChild(dagger, 50);

              var actBy = cc.MoveTo.create(0.75, cc.p(size.width  , Randy));
              var pause = cc.RotateBy.create(0.3+(i/10), 0);
              dagger.runAction(new cc.Sequence(pause, actBy, new cc.RemoveSelf(false)));
        }

    }, magia : function(posicionEnemigo) {

        console.log("Ataque Magico");
        var size = cc.winSize;

        this.sprite.stopAllActions();
        this.animacion = this.animacionMagia;

        var seq = new cc.Sequence(this.animacion, new cc.CallFunc.create(this.detener, this));
        this.sprite.runAction(seq);

        // size.width / ultima.getContentSize().width, size.height / ultima.getContentSize().height

        var fire = new cc.Sprite("#fire_01.png");
        fire.setPosition(cc.p(this.myPosicion.x+50, this.myPosicion.y));
        fire.setScale(3);
        this.layer.addChild(fire, 50);

        fire.runAction(this.animacionFire);

        var emitter = new cc.ParticleFire.create();
        //emitter.texture = cc.textureCache.addImage("#fire_01.png");
        emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
        emitter.setEmissionRate(10);
        emitter.setScale(3);
        fire.addChild(emitter, 20);

        var actionBy = cc.MoveTo.create(1.2, cc.p(size.width * 0.8 , size.height *0.65 ));
        fire.runAction(new cc.Sequence(actionBy,  new cc.RemoveSelf(false)));

        cc.audioEngine.playEffect(res.magic_sound,false);

    }, potion : function() {

        console.log("Pocion");
        this.sprite.stopAllActions();
        this.animacion = this.animacionMagia;

        var seq = new cc.Sequence(this.animacion, new cc.CallFunc.create(this.detener, this));
        this.sprite.runAction(seq);

        //Animacion cura
        var emitter = new cc.ParticleFire.create();
        emitter.texture = cc.textureCache.addImage("#green_smoke_06.png");
        emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
        emitter.setStartColor(new cc.Color(104, 255, 81));
        emitter.setEndColor(new cc.Color(0, 188, 40));
        emitter.setPosition(this.myPosicion);
        emitter.setEmissionRate(10);
        emitter.setScale(1);
        this.layer.addChild(emitter, 20);

        cc.audioEngine.playEffect(res.potion_sound,false);

        var actionBy = cc.RotateBy.create(2, 0);
        emitter.runAction(new cc.Sequence(actionBy,  new cc.RemoveSelf(false)));


    }, detener : function() {

        this.sprite.stopAllActions();
        this.animacion = this.animacionQuieto;
        this.sprite.runAction(this.animacion);

    }, death : function() {

        this.sprite.stopAllActions();
        this.animacion = this.animacionMuerte;
        this.sprite.runAction(this.animacion);

    }
});