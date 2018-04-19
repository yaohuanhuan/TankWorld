
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
    private speed: number = 10;
    private fingerX: number;
    private fingerY: number;


    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {

        let stageW = this.stage.stageWidth;     //640
        let stageH = this.stage.stageHeight;    //1136
        console.log(stageW);
        console.log(stageH);

        let shap: egret.Shape = new egret.Shape();
        shap.graphics.beginFill(0x1895FF, 0.5)
        shap.graphics.drawRect(0, 0, stageW, stageH);
        this.addChild(shap);

        let shapContainer: egret.Shape = new egret.Shape();
        shapContainer.touchEnabled = true;
        shapContainer.graphics.beginFill(0xd20000, 1);
        shapContainer.graphics.drawCircle(170, 900, 130);
        shapContainer.graphics.endFill();
        this.addChild(shapContainer);

        shapContainer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        shapContainer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        shapContainer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        shapContainer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        shapContainer.addEventListener(egret.TouchEvent.ENTER_FRAME, this.onEnterFrame, this);


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
        this.fingerX = event.localX;
        this.fingerY = event.localY;
    }

    private onTouchEnd(event: egret.TouchEvent): void {
        this.fingerX = event.localX;
        this.fingerY = event.localY;
    }

    private onTouchMove(event: egret.TouchEvent): void {
        this.fingerX = event.localX;
        this.fingerY = event.localY;
    }

    private onTouchTap(event: egret.TouchEvent): void {

    }


    private onEnterFrame(): void {

        let distanceX: number = this.fingerX - 170;
        let distanceY: number = this.fingerY - 900;

        let speedX: number = this.speed*

    }

}
