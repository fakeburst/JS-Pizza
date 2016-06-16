/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');
	var API = require('./API');
    
    API.getPizzaList(function(err, pizza){
    	if (err){
    		console.log("API error!");
            console.log(err);
    		return;
    	}
    	Pizza_List = pizza;
    	PizzaCart.initialiseCart();
    	PizzaMenu.initialiseMenu();
    });
});