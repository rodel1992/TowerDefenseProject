
(function() {

	// constructor
	var MenuTower = function(type)
	{
		this.Bitmap_constructor();
		
		this.type = type;
		this.initY = this.y = 9 * 48;
		this.initialize();
	}

	var _mt = createjs.extend(MenuTower, createjs.Bitmap);

	// init function
	_mt.initialize = function()
	{
	    this.drawMenuTower();
	}

	//
	_mt.drawMenuTower = function()
	{
		// instantiate menutower depending on current type
		// TowersEnum defined in globals.js
	    switch (this.type) {
	        case TowersEnum.BASIC:
	            // this.menuTower = new createjs.Bitmap(queue.getResult("imgt1"));
	            this.image = queue.getResult("imgt1");
				this.initX = this.x = 0;	
	            this.cost = 100;
	            break;
	        case TowersEnum.ADVANCED:
	            // this.menuTower = new createjs.Bitmap(queue.getResult("imgt2"));
	            this.image = queue.getResult("imgt2");
	            this.cost = 150;
				this.initX = this.x = 60;	
	            break;
	        case TowersEnum.ULTIMATE:
	            // this.menuTower = new createjs.Bitmap(queue.getResult("imgt3"));
	            this.image = queue.getResult("imgt3");
	            this.cost = 175;
	            this.initX = this.x = 120;
	            break;
	    }

	    this.towerCost = new createjs.Text(this.cost, "10px Arial");
	    this.towerCost.textAlign = 'center';
	    this.towerCost.textBaseline = 'middle';
	    this.towerCost.x = this.x + 24;
	    this.towerCost.y = this.y + 55;

	    // square background that is either red or green
	    _mt.placeHelper = new createjs.Shape();
	    _mt.cmd = _mt.placeHelper.graphics.beginFill("#107727").command;
	    _mt.placeHelper.graphics.drawRect(0, 0, 48, 48);
	    _mt.placeHelper.alpha = 0.01;


	    // preview when dragging the tower
	    // _mt.previewTower = new createjs.Bitmap(this.image);
	    // _mt.previewTower.y = this.y;
	    // _mt.previewTower.x = this.x;
	    // _mt.previewTower.towerType = 1;

	    // listeners for previewTower
	    this.on("mousedown", this.onMouseDown);
	    this.on("pressmove", this.dragMove);
	    this.on("pressup", this.onRelease);

	    stage.addChild(_mt.placeHelper, this.towerCost);
	}

	_mt.onMouseDown = function()
	{
		console.log("CLICK");
		_mt.placeHelper.x = this.x;
		_mt.placeHelper.y = this.y;
		_mt.placeHelper.alpha = 0.6;
	}

	_mt.onDragged = function(ev)
	{
		_mt.dragMove();
	}

	_mt.dragMove = function()
	{
		this.ix = Math.floor(stage.mouseX / 48);
		this.iy = Math.floor(stage.mouseY / 48);

		this.x0 = this.ix * 48;
		this.y0 = this.iy * 48;

		this.x = _mt.placeHelper.x = this.x0;
		this.y = _mt.placeHelper.y = this.y0;

		// placement guide
		// green = can place
		// red = cannot place
		if(_mt.iy < 10 && _mt.ix < 20)
		{
			if(this.checkLocation(this.iy, this.ix))
			{
				// console.log("yes");
			 // ... later, update the fill style/color:
				this.cmd.style = "#107727";
				// _tower.placeHelper.graphics.beginFill("#107727");
			}
			else
			{		
				// console.log("no");
				this.cmd.style = "#b20e0e";
				// _tower.placeHelper.graphics.beginFill("#b20e0e");
			}
		}

		// ev.target.x = this.x0;
		// ev.target.y = this.y0;

	}

	_mt.checkLocation = function(row, col)
	{
	    if (stage1) {
	        console.log(row);
	        if (stage1.gameTable[row][col] != 0) {
	            return false;
	        }
	        return true;
	    }
	    if (stage2) {
	        console.log(row);
	        if (stage2.gameTable[row][col] != 0) {
	            return false;
	        }
	        return true;
	    }
	}

	_mt.onRelease = function()
	{
		// return preview to initial position 
		this.y = this.initY;
		this.x = this.initX;

		// this.towerType = this.towerType;

		this.placeHelper.alpha = 0;
		this.placeHelper.x = -200;

		// out of bounds
		if(this.iy >= 10 || this.ix >= 20)
		{
			return;
		}

		// initiate place tower


		// first, check if current position is valid for placement (not in path? no tower already? within bounds?)
		var canPlace = this.checkLocation(this.iy, this.ix);

		// second, check if credits is enough for tower
		if(credit < this.cost)
			return;

		if(canPlace)
		{
		// if above conditions are met, place tower
			var newTower = new Tower(this.x0, this.y0, this.type);
			stage.addChild(newTower);

			// mark position as "1" for "tower"
			if (stage1) {
			    stage1.gameTable[this.iy][this.ix] = 1;
			}
			if (stage2) {
			    stage2.gameTable[this.iy][this.ix] = 1;
			}

			towers.push(newTower);

			// after placing, deduct price of tower from credit
			credit -= this.cost;
			creditTxt.text = "Credit: " + credit;
		}
	}

window.MenuTower = createjs.promote(MenuTower, "Bitmap");
}());



