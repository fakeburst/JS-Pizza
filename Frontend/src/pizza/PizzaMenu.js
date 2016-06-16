/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var filt = filter.split(",");

    
    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        //pizza_shown.push(pizza);
        //var ingridient = getIngredientsArray(pizza);
        var checked = [];
        filt.forEach(function(f){
            //if(checked) return;
        if(f.charAt(0) == '!'){
            var fil = f.substring(1);
            console.log(fil);
            if(!(fil in pizza.content)){
                    console.log("Kek");
                    checked.push(true);
                }
                else checked.push(false);
        } else {
            if(f in pizza.content)
                checked.push(true);
            else checked.push(false);
        }

        //TODO: зробити фільтри
        });
        function isTrue(element, index, array) {
            return element == true;
        }
        if(checked.every(isTrue)) pizza_shown.push(pizza);
});
    
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}
function initialiseMenu() {
    //Показуємо усі піци

    

    showPizzaList(Pizza_List)

    $("#filter-button-meat").click(function(){
        console.log("Meat");
        $(".count-tile").html("М'ясні' піци");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('meat');
    });

    $("#filter-button-pineapples").click(function(){
        console.log("Pineapple");
        $(".count-tile").html("Піци з ананасом");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('pineapple');
    });

    $("#filter-button-mushrooms").click(function(){
        console.log("Mushroom");
        $(".count-tile").html("Грибні піци");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('mushroom');
    });

    $("#filter-button-ocean").click(function(){
        console.log("Ocean");
        $(".count-tile").html("Піци з морепродуктами");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('ocean');
    });

    $("#filter-button-tomato").click(function(){
        console.log("Vega");
        $(".count-tile").html("Вегетаріанські піци");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('!meat,!ocean,!mushroom');
    });

    $("#filter-button-all-pizza").click(function(){
        console.log("All type");
        $(".count-tile").html("Усі піци");
        $(".active").removeClass("active");
        $(this).addClass("active");
        showPizzaList(Pizza_List);
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;