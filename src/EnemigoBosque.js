var EnemigoBosque = cc.Class.extend({
    sprite:null,
    spriteName:null,
    shape:null,
    body:null,
    layer:null,
    animacionQuieto:null,
    animacionThinking:null,
    animacionHurt:null,
    animacionDeath:null,
    animacion:null, // Actual

    strenght:null,
    speed:null,
    vitality:null,
    intelligence:null,
    level:null,
    maxvitality:null,
    defense:null,
    magicdefense:null,
    experience:null,

    myPosicion:null,
    _emitter: null,

ctor:function (level, posicion, layer) {

    var size = cc.winSize;

    //Roll For enemy
    // Random number between 0 and 10
    var enemyChoosen = Math.floor(Math.random() * 9) + 1;
    console.log("Enemy Random Choosen " +enemyChoosen);

    if(enemyChoosen > 7)  {
        this.spriteName = "#robbie_idle.png";
        this.sprite = new cc.Sprite.create(this.spriteName);
    } else {
        this.spriteName = "#malboro_green_01.png";
        this.sprite = new cc.Sprite.create(this.spriteName);
    }

    this.layer = layer;
    console.log("Enemigo Spawned");

    this.loadStats(this.spriteName);
    this.loadAnimations(this.spriteName);

    this.sprite.runAction(this.animacionQuieto);
    this.animacion = this.animacionQuieto;

    if(enemyChoosen > 7)  {
         this.myPosicion = posicion;
         this.sprite.setPosition(posicion);
         this.sprite.setScale(0.35);
    } else {
         this.myPosicion = cc.p(posicion.x, size.height * 0.5);
         this.sprite.setPosition(cc.p(posicion.x, size.height * 0.5));
         this.sprite.setScale(1.5);
    }

    layer.addChild(this.sprite, 3);

    }, atacar : function(posicion, layer, posicionJugador) {

        console.log("Ataca Enemigo");

        // Random number between 0 and 10
        var attacknumber = Math.floor(Math.random() * 9) + 0;

        console.log("Attack Choosen "+attacknumber);

        if(attacknumber >= 5){

            return this.attack1(posicion, layer, posicionJugador);

        } else {

            return this.attack2(posicion, layer, posicionJugador);

        }


    }, magia : function() {

        console.log("Ataque Magico Enemigo");

        return Math.floor(Math.random() * (this.intelligence + this.level - this.level + 1)) + this.level;
    }, detener : function() {

             this.sprite.stopAllActions();
             this.animacion = this.animacionQuieto;
             this.sprite.runAction(this.animacion);

    }, recibirDaño : function() {

        this.sprite.stopAllActions();
        this.animacion = this.animacionHurt;

        var seq = new cc.Sequence(this.animacion,new cc.DelayTime.create(1) ,new cc.CallFunc.create(this.detener, this));
        this.sprite.runAction(seq);

        if(this.vitality <= 0) {
            this.death();
        }

    }, attack1 : function(posicion, layer, posicionJugador) {

        if(this.spriteName == "#robbie_idle.png"){
            this.sprite.stopAllActions();
            this.animacion = this.animacionThinking;

            var seq = new cc.Sequence(this.animacion,new cc.DelayTime.create(2) ,new cc.CallFunc.create(this.detener, this));
            this.sprite.runAction(seq);

            var spriteBanana =  new cc.Sprite.create(res.banana_atack_png);
            spriteBanana.setPosition(posicion);
            spriteBanana.setScale(0.25);

            this._emitter =  new cc.ParticleSpiral.create();
            this._emitter.texture = cc.textureCache.addImage(res.banana_atack_png);
            this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
            this._emitter.setEmissionRate(10);
            this._emitter.setScale(8);
            spriteBanana.addChild(this._emitter,10);

            layer.addChild(spriteBanana, 20);

            var actionBy = cc.MoveTo.create(2, posicionJugador);
            spriteBanana.runAction(new cc.Sequence(actionBy,  new cc.RemoveSelf(false)));

            return Math.floor(Math.random() * (this.strenght + this.level - this.level + 1)) + this.level;
        }
        else {
            this.sprite.stopAllActions();
            this.animacion = this.animacionThinking;

            var seq = new cc.Sequence(this.animacion,new cc.CallFunc.create(this.detener, this));
            this.sprite.runAction(seq);

            //Animacion veneno
            var emitter = new cc.ParticleFire.create();
            emitter.texture = cc.textureCache.addImage("#green_smoke_06.png");
            emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
            emitter.setStartColor(new cc.Color(176, 176, 80));
            emitter.setEndColor(new cc.Color(40, 64, 48));
            emitter.setPosition(this.myPosicion);
            emitter.setEmissionRate(20);
            emitter.setScale(0.5);
            this.layer.addChild(emitter, 20);

            var actionBy = cc.MoveTo.create(1, posicionJugador);
            emitter.runAction(new cc.Sequence(actionBy, new cc.DelayTime.create(1) ,new cc.RemoveSelf(false)));

            return Math.floor(Math.random() * (this.strenght + this.level - this.level + 1)) + this.level;
        }

    }, attack2 : function (posicion, layer, posicionJugador) {

        if(this.spriteName == "#robbie_idle.png"){
            this.sprite.stopAllActions();
            this.animacion = this.animacionThinking;

            var seq = new cc.Sequence(this.animacion,new cc.DelayTime.create(5) ,new cc.CallFunc.create(this.detener, this));
            this.sprite.runAction(seq);

            var spriteMeteor = new cc.Sprite.create(res.meteor_attack_png);
            spriteMeteor.setPosition(cc.p(posicion.x, posicion.y + 200));
            spriteMeteor.setScale(2);

            this._emitter =  new cc.ParticleSun.create();
            this._emitter.texture = cc.textureCache.addImage(res.meteor_attack_png);
            this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
            this._emitter.setEmissionRate(15);
            this._emitter.setScale(1);
            spriteMeteor.addChild(this._emitter,10);

            layer.addChild(spriteMeteor, 20);

            var actionRot = cc.RotateBy.create(3, 360);
            spriteMeteor.runAction(actionRot);

            var actionBy = cc.MoveTo.create(3, posicionJugador);
            spriteMeteor.runAction(new cc.Sequence(actionBy,  new cc.RemoveSelf(false)));

            return Math.floor(Math.random() * ((this.intelligence * 2) + this.level - this.level + 1)) + this.level;
        }

        else {

            return 0;

        }
    }, death : function() {

        this.sprite.stopAllActions();
        this.animacion = this.animacionDeath;
        this.sprite.runAction(this.animacion);

    }, loadAnimations : function(spriteName) {


        if(spriteName=="#robbie_idle.png") {

            // Crear animación - idle
            var framesAnimacion = [];
            var frame = cc.spriteFrameCache.getSpriteFrame("robbie_idle.png");
            framesAnimacion.push(frame);
            var animacion = new cc.Animation(framesAnimacion, 0.1);
            this.animacionQuieto =
                new cc.RepeatForever(new cc.Animate(animacion));

            // Crear animación - death
            var framesAnimacion = [];
            var frame = cc.spriteFrameCache.getSpriteFrame("robbie_banana.png");
            framesAnimacion.push(frame);
            var animacion = new cc.Animation(framesAnimacion, 0.1);
            this.animacionDeath =
                new cc.RepeatForever(new cc.Animate(animacion));

            // Crear animación - thinking
            var framesAnimacion = [];
            var frame = cc.spriteFrameCache.getSpriteFrame("robbie_thinking.png");
            framesAnimacion.push(frame);
            var animacion = new cc.Animation(framesAnimacion, 0.1);
            this.animacionThinking = new cc.Animate(animacion);

            // Crear animación - hurt
            var framesAnimacion = [];
            var frame = cc.spriteFrameCache.getSpriteFrame("robbie_banana.png");
            framesAnimacion.push(frame);
            var animacion = new cc.Animation(framesAnimacion, 0.1);
            this.animacionHurt = new cc.Animate(animacion);

        } else {
            //Since we only have 1 other enemy

            // Crear animación - idle
            var framesAnimacion = [];
            for (var i = 1; i <= 5; i++) {
                var str = "malboro_green_0" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacion.push(frame);
            }
            var animacion = new cc.Animation(framesAnimacion, 0.2);
            this.animacionQuieto =
                new cc.RepeatForever(new cc.Animate(animacion));

            // Crear animación - death
            var framesAnimacion = [];
            for (var i = 0; i <= 2; i++) {
                var str = "malboro_green_1" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacion.push(frame);
            }
            var animacion = new cc.Animation(framesAnimacion, 0.2);
            this.animacionDeath = new cc.Animate(animacion);

            // Crear animación - thinking
            var framesAnimacion = [];
            for (var i = 6; i <= 9; i++) {
                var str = "malboro_green_0" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacion.push(frame);
            }
            var animacion = new cc.Animation(framesAnimacion, 0.2);
            this.animacionThinking = new cc.Animate(animacion);

            // Crear animación - hurt
            var framesAnimacion = [];
            for (var i = 0; i <= 1; i++) {
                var str = "malboro_green_1" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacion.push(frame);
            }
            var animacion = new cc.Animation(framesAnimacion, 0.2);
            this.animacionHurt = new cc.Animate(animacion);

        }
    }, loadStats : function(spriteName) {

         if(spriteName=="#robbie_idle.png") {
             this.strenght = 10;
             this.speed = 6;
             this.vitality = 70;
             this.intelligence = 15;
             this.level = 10;
             this.maxvitality = 70;
             this.defense = 10;
             this.magicdefense = 50;
             this.experience = 200;
         } else {
             this.strenght = 10;
             this.speed = 2;
             this.vitality = 40;
             this.intelligence = 5;
             this.level = 3;
             this.maxvitality = 40;
             this.defense = 10;
             this.magicdefense = 0;
             this.experience = 20;
         }

    }
});
