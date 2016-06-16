/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var LiqPay = require('./liqpay');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    var name = order_info.name;
    var phone = order_info.phone;
    var address = order_info.adress;
    var price = order_info.price;
    var desc = order_info.desc;
    
    console.log("Kek: ", name && phone && address & price);

    if (name && phone && address && price){
	    var liqpay = new LiqPay("i1471096846", "XRbS1JzYJeWPAhUeHmkrz9GH8ORompuyvBGdr9Iu");
		var link = liqpay.cnb_link({
			'action'      : 'pay',
			'amount'      : price,
			'currency'    : 'UAH',
			'description' : desc,
			'sandbox'     : '1',
			'version'     : '3'
		});
	    res.send({
	        success: true,
	        link: link
	    });
    } else {
	    res.send({
	        success: false
	    });
    }
};