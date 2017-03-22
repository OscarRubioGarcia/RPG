var Caballero = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacionQuieto:null,
    animacionQuietoArriba:null,
    animacionQuietoIzquierda:null,
    animacionQuietoDerecha:null,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacion:null, // Actual
    orientacion:null,

    strenght:null,
    speed:null,
    vitality:null,
    intelligence:null,
    level:null,
    maxvitality:null,
    experience:0,
    maxexperince:50,

ctor:function (space, posicion, layer) {

    this.level = 1;
    this.strenght = 10;
    this.speed = 5;
    this.vitality = 50;
    this.maxvitality = 50;
    this.intelligence = 10;
    this.maxexperince = 50;
    this.experience = 0;

    this.orientacion = 2;

    this.space = space;
    this.layer = layer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#SaraAbajo_0.png");
    // Cuerpo dinamico, SI le afectan las fuerzas
    this.body = new cp.Body(5, Infinity);

    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    this.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
    this.sprite.getContentSize().width,
    this.sprite.getContentSize().height);

    this.shape.setFriction(1);
    this.shape.setElasticity(0);
    this.shape.setCollisionType(colisionJugador);

    // forma dinamica
    this.space.addShape(this.shape);

    // Crear animación - quieto abajo
    var framesAnimacion = [];
    for (var i = 0; i <= 0; i++) {
        var str = "SaraAbajo_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionQuieto =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - quieto arriba
    var framesAnimacion = [];
    for (var i = 0; i <= 0; i++) {
        var str = "SaraArriba_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionQuietoArriba =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - quieto izquierda
    var framesAnimacion = [];
    for (var i = 0; i <= 0; i++) {
        var str = "SaraIzquierda_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionQuietoIzquierda =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - quieto derecha
    var framesAnimacion = [];
    for (var i = 0; i <= 0; i++) {
        var str = "SaraDerecha_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionQuietoDerecha =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - derecha
    var framesAnimacion = [];
    for (var i = 0; i <= 8; i++) {
        var str = "SaraDerecha_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionDerecha =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - izquierda
    var framesAnimacion = [];
    for (var i = 0; i <= 8; i++) {
        var str = "SaraIzquierda_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionIzquierda =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - arriba
    var framesAnimacion = [];
    for (var i = 0; i <= 8; i++) {
        var str = "SaraArriba_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionArriba =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - abajo
    var framesAnimacion = [];
    for (var i = 0; i <= 8; i++) {
        var str = "SaraAbajo_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.1);
    this.animacionAbajo =
        new cc.RepeatForever(new cc.Animate(animacion));


    // ejecutar la animación
    this.sprite.runAction(this.animacionQuieto);
    this.animacion = this.animacionQuieto;
    layer.addChild(this.sprite,10);

    }, moverIzquierda:function() {
        if (this.animacion != this.animacionIzquierda){
            this.sprite.stopAllActions();
            this.animacion = this.animacionIzquierda;
            this.sprite.runAction(this.animacion);
            this.orientacion = 4;
        }

        this.body.vy = 0;
        if ( this.body.vx > -100){
            this.body.applyImpulse(cp.v(-100, 0), cp.v(0, 0));
        }

    }, moverDerecha:function() {
        if (this.animacion != this.animacionDerecha){
            this.sprite.stopAllActions();
            this.animacion = this.animacionDerecha;
            this.sprite.runAction(this.animacion);
            this.orientacion = 6;
        }

        this.body.vy = 0;
        if ( this.body.vx < 100){
            this.body.applyImpulse(cp.v(100, 0), cp.v(0, 0));
        }

    }, moverArriba:function() {
        if (this.animacion != this.animacionArriba){
            this.sprite.stopAllActions();
            this.animacion = this.animacionArriba;
            this.sprite.runAction(this.animacion);
            this.orientacion = 8;
        }

        this.body.vx = 0;
        if ( this.body.vy < 100){
            this.body.applyImpulse(cp.v(0, 100), cp.v(0, 0));
        }

    }, moverAbajo:function() {
        if (this.animacion != this.animacionAbajo){
            this.sprite.stopAllActions();
            this.animacion = this.animacionAbajo;
            this.sprite.runAction(this.animacion);
            this.orientacion = 2;
        }

       this.body.vx = 0;
       if ( this.body.vy > -100){
            this.body.applyImpulse(cp.v(0, -100), cp.v(0, 0));
       }

    }, detener : function() {


      if(this.orientacion==8)
         if (this.animacion != this.animacionQuietoArriba){
            this.sprite.stopAllActions();
            this.animacion = this.animacionQuietoArriba;
            this.sprite.runAction(this.animacion);
          }
      if(this.orientacion==4)
         if (this.animacion != this.animacionQuietoIzquierda){
            this.sprite.stopAllActions();
            this.animacion = this.animacionQuietoIzquierda;
            this.sprite.runAction(this.animacion);
          }

      if(this.orientacion==6)
         if (this.animacion != this.animacionQuietoDerecha){
            this.sprite.stopAllActions();
            this.animacion = this.animacionQuietoDerecha;
            this.sprite.runAction(this.animacion);
          }
      if(this.orientacion==2) {
         if (this.animacion != this.animacionQuieto){
            this.sprite.stopAllActions();
            this.animacion = this.animacionQuieto;
            this.sprite.runAction(this.animacion);
          }
      }

       this.body.vx = 0;
       this.body.vy = 0;
    }, atacar : function() {

        console.log("Atacando");

        return Math.floor(Math.random() * (this.strenght + this.level - this.level + 1)) + this.level;
    }, magia : function() {

        console.log("Ataque Magico");

        return Math.floor(Math.random() * (this.intelligence + this.level - this.level + 1)) + this.level;
    }, potion : function() {

        console.log("Pocion");
        var heal = 50;
        var new_health = this.vitality + heal;

        if(new_health > this.maxvitality) {
            var healed = (this.maxvitality - this.vitality);
            this.vitality = this.maxvitality;

            return healed;
        }
        else {
            this.vitality = this.vitality + heal;

            return heal;
        }

    }, escape : function(enemyLevel) {

        var rand = this.level / enemyLevel;

        return rand;

    },subirNivel:function( categoria ) {
        this.level++;

        if(categoria == "fuerza")
            this.strenght += 3 ;

        if(categoria == "inteligencia")
            this.intelligence += 3;

        if(categoria == "velocidad")
            this.speed += 2;

        this.maxvitality += 10;
        this.vitality = this.maxvitality;
        this.maxexperince = (this.level * 50);

    }, checkSubirNivel : function( newexperience ) {

        this.experience += newexperience;
        console.log("Level check "+ this.experience );

        if(this.experience == this.maxexperince)
        {
            this.experience = 0;
            return 1;
        }

        if(this.experience > this.maxexperince)
        {
            this.experience == (this.experience - this.maxexperince);
            var totalLevels = 1;

            var futureLevel = this.level + 1;
            var loopMe = true;

            console.log("Exact " + this.experience + " " + this.maxexperince + loopMe);

            while(loopMe) {
                var futureMaxExp = (futureLevel * 50);
                console.log("Niveles "+totalLevels);

                if(this.experience > futureMaxExp) {
                    this.experience == (this.experience - futureMaxExp);

                    futureLevel++;
                    totalLevels++;
                } if(this.experience == futureMaxExp) {
                    this.experience = 0;
                    totalLevels++;
                    loopMe = false;
                } else {
                    this.experience == (futureMaxExp - this.experience);
                    loopMe = false;
                }

            }

            return totalLevels;
        }

        return 0;
    }
});
