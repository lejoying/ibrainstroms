/***************************************
 * *    Class：account
 ***************************************/
/*

api = {
    */
/***************************************
     *     URL：/api2/account/verification/get
     ***************************************//*

    "verification/get": {
        request: {
            typical: {"phone": "1XXXXXXXXXX"}
        },
        response: {
            success: {"提示信息": ["验证码已发送到指定手机" | "验证码已于10秒之内发送到指定手机"]},
            failed: {"提示信息": "数据不完整"}
        },
        */
/***************************************
         *     URL：/api2/account/verification/auth
         ***************************************//*

        "verification/auth": {
            request: {
                typical: {"phone": "1XXXXXXXXXX", "verification": "XXXX"}
            },
            response: {
                success: {"提示信息": "验证码验证通过", "status": "passed", "uid": uid / PbKey0, "acccesskey": acccesskey / Pbkey0, "PbKey": PbKey0},
                failed: {"提示信息": ["验证码错误" | "用户不存在"], "status": "failed"}
            }
        }
    }
};
*/

/***************************************
 * *    Class：order
 ***************************************/

/*api = {
    *//***************************************
     *     URL：/api2/order/create
     ***************************************//*
    "order/create": {
        request: {
            typical: {uid: "nnnn", accesskey: "XXXXXX", phone: "1XXXXXXXXXX", service_type:"XXXX"}
        },
        response: {
            success: {"提示信息": "订单创建成功"},
            failed: {"提示信息": "订单创建失败"}
        }
    }
};*/


/***************************************
 * *    Class：node
 ***************************************/
api = {
    /***************************************
     *     URL：/api2/node/get
     ***************************************/
    "node_get": {
        description: {
            url: "/api2/node/get"
        },
        request: {
            typical: {phone: "XXX", accessKey: "XXX", flag: "NNN"}
        },
        response: {
            success: {"提示信息": "获取成功", messages: [
                {type: "text" || "image" || "voice", phone: "NNN", phoneto: "NNN", content: "XXX", time: new Date().getTime(), flag: "NNN"}
            ]},
            failed: {"提示信息": "获取失败", "失败原因": "数据异常"}
        }
    },
        /***************************************
         *     URL：/api2/node/remove
         ***************************************/
        "relation_addfriendagree": {
            description: {
                id: 1000306,
                url: "/api2/relation/addfriendagree"
            },
            request: {
                typical: {"phone": "XXX", accessKey: "XXX", phoneask: "XXX", rid: "XXX", status: true || false}
            },
            response: {
                success: {"提示信息": "添加成功"},
                failed: {"提示信息": "添加失败", "失败原因": ["数据异常"]}
            }
        },

        /***************************************
         *     URL：/api2/node/modify
         ***************************************/
        "relation_addfriendagree": {
            description: {
                id: 1000306,
                url: "/api2/relation/addfriendagree"
            },
            request: {
                typical: {"phone": "XXX", accessKey: "XXX", phoneask: "XXX", rid: "XXX", status: true || false}
            },
            response: {
                success: {"提示信息": "添加成功"},
                failed: {"提示信息": "添加失败", "失败原因": ["数据异常"]}
            }
        },

        /***************************************
         *     URL：/api2/node/add
         ***************************************/
        "relation_addfriendagree": {
            description: {
                id: 1000306,
                url: "/api2/relation/addfriendagree"
            },
            request: {
                typical: {"phone": "XXX", accessKey: "XXX", phoneask: "XXX", rid: "XXX", status: true || false}
            },
            response: {
                success: {"提示信息": "添加成功"},
                failed: {"提示信息": "添加失败", "失败原因": ["数据异常"]}
            }
        }
};