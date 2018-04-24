
class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();


    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }


    private sprite: egret.Shape;
    private speed: number = 3;

    private centerPoint: egret.Point = new egret.Point();
    private fingerPoint: egret.Point = new egret.Point();

    //摇杆中心点坐标
    private centerX: number = 180;
    private centerY: number = 500;
    private centerRadius: number = 130;

    private time:number = 0;


    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {

        let stageW = this.stage.stageWidth;     //720
        let stageH = this.stage.stageHeight;    //1280
        console.log("stageW == "+stageW+"   "+"stageH == "+stageH);

        //创建虚拟摇杆容器
        let shapContainer: egret.Shape = new egret.Shape();
        shapContainer.touchEnabled = true;
        shapContainer.graphics.beginFill(0xd20000, 1);
        shapContainer.graphics.drawCircle(this.centerX, this.centerY, this.centerRadius);
        shapContainer.graphics.endFill();
        this.addChild(shapContainer);

        //移动的物体
        this.sprite = new egret.Shape();

        this.sprite.graphics.beginFill(0xd20000, 1);
        this.addChild(this.sprite);

        this.centerPoint.x = this.centerX;
        this.centerPoint.y = this.centerY;

        shapContainer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        shapContainer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        shapContainer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        shapContainer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        // shapContainer.addEventListener(egret.TouchEvent.ENTER_FRAME, this.onEnterFrame, this);

        this.time = egret.getTimer();
        
        egret.startTick(this.onEnterFrame,this);

    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private drawJoystick() {

    }


    private onTouchBegin(event: egret.TouchEvent): void {
        this.fingerPoint.x = event.localX;
        this.fingerPoint.y = event.localY;
    }

    private onTouchEnd(event: egret.TouchEvent): void {
        this.fingerPoint.x = this.centerPoint.x;
        this.fingerPoint.y = this.centerPoint.y;
    }

    private tempPoint: egret.Point = new egret.Point();

    private onTouchMove(event: egret.TouchEvent): void {

        this.tempPoint.x = event.localX;
        this.tempPoint.y = event.localY;

        let distance: number = egret.Point.distance(this.centerPoint,this.tempPoint);

        if(distance < this.centerRadius-10){
            this.fingerPoint.x = event.localX;
            this.fingerPoint.y = event.localY;
        }else{
            this.fingerPoint.x = this.centerPoint.x;
            this.fingerPoint.y = this.centerPoint.y;
        }

    }

    private onTouchTap(event: egret.TouchEvent): void {
        
    }

    private a: number = 250;
    private b: number = 250;


    private onEnterFrame(): boolean {
    
        let distance: number = egret.Point.distance(this.centerPoint, this.fingerPoint);
        let distanceX: number = this.fingerPoint.x - this.centerPoint.x;
        let distanceY: number = this.fingerPoint.y - this.centerPoint.y;

        if(distanceX > this.centerRadius || distanceX < -this.centerRadius){
            this.sprite.graphics.clear();
            this.sprite.graphics.beginFill(0xd20000, 1);
            this.sprite.graphics.drawCircle(this.a, this.b, 10);
            this.sprite.graphics.endFill();
            return false;
        }
        if(distanceY > this.centerRadius || distanceY < -this.centerRadius){
            this.sprite.graphics.clear();
            this.sprite.graphics.beginFill(0xd20000, 1);
            this.sprite.graphics.drawCircle(250, 250, 10);
            this.sprite.graphics.endFill();
            return false;
        }

        if (distanceX == 0 && distanceY == 0) {

        } else {
            let speedX: number = this.speed * distanceX / distance;
            let speedY: number = this.speed * distanceY / distance;

            this.a = this.a + speedX;
            this.b = this.b + speedY;
            this.sprite.graphics.clear();
            this.sprite.graphics.beginFill(0xd20000, 1);
            this.sprite.graphics.drawCircle(this.a, this.b, 10);
            this.sprite.graphics.endFill();
            return true;

        }

        return false;
    }

}