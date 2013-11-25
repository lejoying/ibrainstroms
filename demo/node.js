//如果只有一个view：world
//如果只有一种节点node
//如果只有一种布局

var world={};

world.root={};



{
	id : view,

	inner : [
		{
			id : A,
			position : "A.TL=view.TL",
			size : "H=content().H;W=1024",
			content :
			{
				text : "你好！",
				font : "宋体6px",
				picture : "p2.jpg"
			}
			inner : [
			
			]
		},

		{
			id : B,
			position : "TL=above().BL#swap(parents().H)", //默认值first(),next(),last(),above(),parents()
			size : "H=parents().H;W=parents().W",
			inner : [
				{
					reference : A
				}, {}

			]
		}
	]

}
