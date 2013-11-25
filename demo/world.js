//只有一个world
//只有一种space
//只有一种节点node
//只有一种style，无继承，只可组合，描述node如何被绘制，不涉及postion,scale,rotation
//只有一种坐标变换transform：postion,scale,rotation
//可以有定时回调
//可以有绑定事件
var world =
{
	//spaces
	"A" :
	{
		properties :
		{
			size : "800*600*200",
			position : "200,100,0",
		}
		//nodes
		"a" :
		{
			properties :
			{
				style : "a menu",
				transform : "transform_a",
				timer : "timer_a",
				action : "action_a",
			}
			"a1" :
			{
				properties :
				{
					style : "a1 menu",
					transform : "transform_a1",
					timer : "timer_a1",
					action : "action_a1",
				}
				"a11" : {}

			}
			"a2" :
			{
				properties :
				{
					style : "a2 menu",
					transform : "transform_a2",
					timer : "timer_a2",
					action : "action_a2",
				}
				"a21" : {}
			}
		}
	}

}
