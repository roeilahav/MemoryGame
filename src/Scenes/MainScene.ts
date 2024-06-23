
export default class MainScene extends Phaser.Scene {
    mistakesLeftText: Phaser.GameObjects.Text | undefined;

	constructor() {
		super("MainScene");

	}

	editorCreate(): void {

		// bg
		const bg = this.add.image(408, 368, "bg");
		bg.scaleX = 0.6;
		bg.scaleY = 0.6;

		// symbols_layer
		const symbols_layer = this.add.layer();

		// symbol11
		const symbol12 = this.add.sprite(215.0637664794922, 521.4500732421875, "symbols", "symbol_6.png").setData("symbolKey" , "symbol_6.png");
		symbol12.scaleX = 0.5;
		symbol12.scaleY = 0.5;
		symbols_layer.add(symbol12);

		// symbol11
		const symbol11 = this.add.sprite(405.06378173828125, 521.4500732421875, "symbols", "symbol_5.png").setData("symbolKey" , "symbol_5.png");
		symbol11.scaleX = 0.5;
		symbol11.scaleY = 0.5;
		symbols_layer.add(symbol11);

		// symbol10
		const symbol10 = this.add.sprite(595.0637817382812, 521.4500732421875, "symbols", "symbol_4.png").setData("symbolKey" , "symbol_4.png");
		symbol10.scaleX = 0.5;
		symbol10.scaleY = 0.5;
		symbols_layer.add(symbol10);

		// symbol9
		const symbol9 = this.add.sprite(595, 392, "symbols", "symbol_3.png").setData("symbolKey" , "symbol_3.png");
		symbol9.scaleX = 0.5;
		symbol9.scaleY = 0.5;
		symbols_layer.add(symbol9);

		// symbol8
		const symbol8 = this.add.sprite(405, 392, "symbols", "symbol_2.png").setData("symbolKey" , "symbol_2.png");
		symbol8.scaleX = 0.5;
		symbol8.scaleY = 0.5;
		symbols_layer.add(symbol8);

		// symbol7
		const symbol7 = this.add.sprite(215, 392, "symbols", "symbol_1.png").setData("symbolKey" , "symbol_1.png");
		symbol7.scaleX = 0.5;
		symbol7.scaleY = 0.5;
		symbols_layer.add(symbol7);

		// symbol6
		const symbol6 = this.add.sprite(595, 263, "symbols", "symbol_6.png").setData("symbolKey" , "symbol_6.png");
		symbol6.scaleX = 0.5;
		symbol6.scaleY = 0.5;
		symbols_layer.add(symbol6);

		// symbol5
		const symbol5 = this.add.sprite(405, 263, "symbols", "symbol_5.png").setData("symbolKey" , "symbol_5.png");
		symbol5.scaleX = 0.5;
		symbol5.scaleY = 0.5;
		symbols_layer.add(symbol5);

		// symbol4
		const symbol4 = this.add.sprite(215, 263, "symbols", "symbol_4.png").setData("symbolKey" , "symbol_4.png");
		symbol4.scaleX = 0.5;
		symbol4.scaleY = 0.5;
		symbols_layer.add(symbol4);

		// symbol3
		const symbol3 = this.add.sprite(595, 135, "symbols", "symbol_3.png").setData("symbolKey" , "symbol_3.png");
		symbol3.scaleX = 0.5;
		symbol3.scaleY = 0.5;
		symbols_layer.add(symbol3);

		// symbol2
		const symbol2 = this.add.sprite(405, 135, "symbols", "symbol_2.png").setData("symbolKey" , "symbol_2.png");
		symbol2.scaleX = 0.5;
		symbol2.scaleY = 0.5;
		symbols_layer.add(symbol2);

		// symbol1
		const symbol1 = this.add.sprite(215, 135, "symbols", "symbol_1.png").setData("symbolKey" , "symbol_1.png");
		symbol1.scaleX = 0.5;
		symbol1.scaleY = 0.5;
		symbols_layer.add(symbol1);

        // mistakes left text
        this.mistakesLeftText = this.add.text(250, 30, "Mistakes Left: 6", { fontSize: '32px', color: '#F3E5AB', fontStyle: 'bold'}).setOrigin(0.5);

		this.bg = bg;
		this.symbol12 = symbol12;
		this.symbol11 = symbol11;
		this.symbol10 = symbol10;
		this.symbol9 = symbol9;
		this.symbol8 = symbol8;
		this.symbol7 = symbol7;
		this.symbol6 = symbol6;
		this.symbol5 = symbol5;
		this.symbol4 = symbol4;
		this.symbol3 = symbol3;
		this.symbol2 = symbol2;
		this.symbol1 = symbol1;
		this.symbol1 = symbol1;

		this.events.emit("scene-awake");
	}

	private bg: Phaser.GameObjects.Image | undefined;
	private symbol12: Phaser.GameObjects.Sprite | undefined;
	private symbol11: Phaser.GameObjects.Sprite | undefined;
	private symbol10: Phaser.GameObjects.Sprite | undefined;
	private symbol9: Phaser.GameObjects.Sprite | undefined;
	private symbol8: Phaser.GameObjects.Sprite | undefined;
	private symbol7: Phaser.GameObjects.Sprite | undefined;
	private symbol6: Phaser.GameObjects.Sprite | undefined;
	private symbol5: Phaser.GameObjects.Sprite | undefined;
	private symbol4: Phaser.GameObjects.Sprite | undefined;
	private symbol3: Phaser.GameObjects.Sprite | undefined;
	private symbol2: Phaser.GameObjects.Sprite | undefined;
	private symbol1: Phaser.GameObjects.Sprite | undefined;

	symbolsArr(){
		return [this.symbol1, this.symbol2, this.symbol3, this.symbol4, this.symbol5, this.symbol6, this.symbol7, this.symbol8, this.symbol9, this.symbol10, this.symbol11, this.symbol12 ];
	}

	preload() {
		this.load.pack("pack", './Assets/game_pack_sd.json');
	}

	create() {
		this.editorCreate();
		//making each card "flipped"
		this.symbolsArr().forEach(symbol => {
            //making sure that 'symbol' is not undefined
			if (symbol) {
                symbol.setTexture('symbols', 'symbol_0.png'); 
            }
        });

		this.game.events.emit("GameCreated");
	}
}
