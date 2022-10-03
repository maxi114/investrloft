(function () {
    const app = angular.module('app').controller('Ctrl2', ['ngRoute', 'angular-jwt']);

    app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        //saved startups
        $routeProvider.when("/savedstartups", {
            templateUrl: "../Investor/savedstartups.html",
            controller: "SavedController2",
            controllerAs: "vm",
            access: {
                restricted: true,
                account: "investor",
            }
        })

        //preview the startups
        $routeProvider.when("/preview/:token", {
            templateUrl: "../Investor/preview.html",
            controller: "PreviewController",
            controllerAs: "vm",
            access: {
                restricted: true,
                account: "investor",
            }
        })

        //messages 
        $routeProvider.when("/investormessages", {
            templateUrl: "../Investor/investormessages.html",
            controller: "MessagesController",
            controllerAs: "vm",
            access: {
                restricted: true,
                account: "investor",
            }
        })

        //products investor has requested to invest in
        $routeProvider.when('/requested', {
            templateUrl: '../Investor/requested.html',
            controller: 'RequestedController',
            controllerAs: 'vm',
            access: {
                restricted: true,
                account: "investor",
            }
        })

        //all products page
        $routeProvider.when("/products", {
            templateUrl: "/products.html",
            controller: "ProductsController",
            controllerAs: "vm",
            access: {
                restricted: true,
                account: "investor",
            }
        })

    });

    //store the products name
    var name1 = [];
    //store the products name when searched
    var name2 = [];
    var nstr;

    //function to hide divs
    var hide = function (response) {
        if (response.data.length == 1) {
            $(".products").show();
            $(".loader").hide();
        }
        else {
            $(".first-product").hide();
            $(".test").remove();
            $(".me").hide();
            $(".loader").hide();
        }
    }


    //function to display all products 
    var products = function (response) {

        var savebtn = "<p class = \"save hrt fa fa-heart\" style =\"color: #b5b6ba\" ></p>"

        //var to store the offer
        var offer;
        var myFiles = [];
        //to upload multiple data
        for (var d = 1; d < response.data.length; d++) {

            //check if product is already saved
            if (response.data[0].length > 0) {

                //check if the product is saved
                var x = response.data[0].every(e => e !== response.data[d]._id)

                if (x == false) {
                    savebtn = "<p  class = \"unsave hrt fa fa-heart\" style =\"color: red\"></p>"
                }
                else {
                    savebtn = "<p  class = \"save hrt fa fa-heart\" style =\"color: #b5b6ba\" ></p>"
                }

            }
            //remove all the white spaces from the product name
            nstr = response.data[d].Startup_Name.replace(/\s/g, '');

            if (response.data[d].Startup_Percent_Offer) {
                //change money from number to string
                var money = response.data[d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                offer = "<p class = \"offer offer2\">Investment: USD " + money + " for " + response.data[d].Startup_Percent_Offer + " stake</p>"

            }

            if (!response.data[d].Startup_Percent_Offer) {
                //change money from number to string
                var money = response.data[d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                offer = "<p class = \"offer offer2\">Investment: USD " + money + " </p>"

            }
            myFiles.push(
                "<input type=\"hidden\" class = \"idem\" id=" + response.data[d]._id + " value = " + response.data[d].Entrepreneur_Email + ">" +
                "<div class = \"img2\">" +
                "</div>" +
                "<div class = \"en  blm\">" +
                "<div class = \"en2\">" +
                "</div>" +
                "<div class = \"en3\">" +
                "<p class = \"enp enpp\">loading..</p>" +
                "<p class = \"enp2 enpp\">loading.. </p>" +
                "</div>" +
                "</div>" +
                "<h2 class=\"name blm\">" + response.data[d].Startup_Name + "</h2>" +
                "<p class=\"description blm\">" + response.data[d].Startup_Description + "</p>" +
                "<div class = \"of\">" +
                offer +
                "</div>" +
                "<div class = \"svr\">" +
                "<div class = \"lc\">" +
                "<i class=\"fa fa-map-marker\" id=\"location\"> " + response.data[d].Startup_Location.City + " " + response.data[d].Startup_Location.State + "</i>" +
                savebtn +
                "</div>" +
                "</div>"
            );
            myFiles = myFiles.join("");
            $("<div class = \"test\">" + myFiles + "</div>").appendTo(".products");
            myFiles = [];
            name1.push(nstr)
        }

    }


    //preview satrups controller function
    app.controller("PreviewController", PreviewController);

    function PreviewController($http, $window, jwtHelper) {

        var vm = this;

        //get the details on the token
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        //retrive token from the url
        const url = window.location.pathname.split("/")
        const url2 = url[2];


        //when user clicks no on the withdraw pop-up
        $(".no").click(function () {
            //hide the withdraw message
            $(".message").hide();
            $(".withdraw2").hide();
        })

        //when user clicks yes
        $(".yes").click(function () {

            //products id
            var pid = $(".idem").attr("id")

            //invetors id 
            var inv = $(".inid").html()

            //entrepreneurs id
            var en = $(".enid").html()

            //products name
            var name = $(".title").html();

            //route to unrequest
            $http.post("/investor/withdraw", {
                invid: inv,
                enid: en,
                pid: pid,
                name: name,
            })
                .then((res) => {
                    //refresh the page
                    location.reload();
                })
        })

        //when investor closes the message
        $(".close").click(function () {

            //hide the message box
            $(".message").hide();
        })

        //when investor closes the message3
        $(".iop").click(function () {
            window.top.close();
        })

        //when user clicks the startup owner profile
        $(".owner2").click(function () {
            var id = $(".infoen").html()

            location.href = "info/startup/" + id
        })

        //when user clicks send on the message pop up
        $(".send").click(function () {

            //hide the message input and show the loading circle
            $(".message2").hide();

            //show the loading corcle
            $(".loader").show();

            //products id
            var pid = $(".idem").attr("id")

            //invetors id 
            var inv = $(".inid").html()

            //entrepreneurs id
            var en = $(".enid").html()

            //store the message
            var msg;

            //check if invetor has a message
            if ($("#txt").val() == "") {
                msg = "Investment request"
            }

            else {
                msg = $("#txt").val()
            }

            //sent to route that will initiate the message
            $http.post("/investor/initiate", {
                invid: inv,
                enid: en,
                msg: msg,
                pid: pid,
                type: "request",
            })
                .then((res) => {

                    //hide the loading circle
                    $(".loader").hide();

                    //hide message 2
                    $(".message2").hide();

                    //if this is the investors first request
                    if (res.data == "first") {
                        vm.add = "Congratulations on sending your first request. "
                        //show the message
                        $(".message3").show();
                    }

                    else {
                        //show the message
                        $(".message3").show();
                    }
                })

        })

        //Investor id
        vm.inid = user._id

        $http.post("/investor/preview", {
            id: url2,
            email: user.Email
        })
            .then((res) => {

                $(".nostp").hide();

                if (res.data[2] == null) {
                    $(".container2").hide();
                    $(".descript1").hide();
                    $(".pen1").hide();
                    $(".owner").hide();
                    $(".nostp").show();
                    return;
                }

                //check if product is saved
                var x = res.data[0].every(e => e !== res.data[2]._id);

                //check if product is already requested
                var y = res.data[1].every(e => e.Product !== res.data[2]._id)

                //if the product is saved
                if (x == false) {
                    $(".save").html("Unsave Startup")
                    $(".save").removeClass("save").addClass("unsave")
                }

                //if the product is already requested
                if (y == false) {
                    $(".request").html("Withdraw request")
                    $(".request").removeClass("request").addClass("withdraw")
                }

                //loop through the requested products
                for (var p = 0; p < res.data[1].length; p++) {
                    if (res.data[1][p].Product == res.data[2]._id) {
                        if (res.data[1][p].Status == "Pending") {
                            $("<p class = \"pen\">Pending investment request </p>").appendTo(".pen1")
                        }
                        else if (res.data[1][p].Status == "Accepted") {
                            $("<i class=\"pen pen3 fa fa-check-circle\"> Accepted Investment Request</i>").appendTo(".pen1")
                        }
                        else {
                            $("<p class = \"pen pen4\">Rejected investment request </p>").appendTo(".pen1")
                        }
                    }
                }
                //when investor saves a startups
                $('.save').click(function () {

                    //store the products email
                    var id = $(this).parents("div")[2].children[12].children[0].id

                    //route to save the product
                    $http.post("/investor/savestrt", {
                        id: id,
                        user: user.Email
                    })
                        .then((res) => {

                            if (res.data == "saved") {
                                $(this).removeClass("save").addClass("unsave")
                                $(this).html("Unsave Startup")
                            }

                            else if (res.data == "none1") {

                                //unsave the data
                                var id2 = $(this).parents("div")[2].children[12].children[0].id

                                $http.post("/investor/unsave", {
                                    id: id2,
                                    user: user.Email
                                })
                                    .then((res) => {

                                        if (res.data == "done") {
                                            $(this).removeClass("unsave").addClass("save")
                                            $(this).html("Save Startup")

                                        }
                                    })
                            }

                            else {
                                location.href = "/preview/" + id2
                            }
                        })
                })

                //when investor unsaves a startup
                $(".unsave").click(function () {

                    //store the products id
                    var id2 = $(this).parents("div")[2].children[12].children[0].id

                    $http.post("/investor/unsave", {
                        id: id2,
                        user: user.Email
                    })
                        .then((res) => {

                            if (res.data == "done") {
                                location.href = "/preview/" + id2
                            }
                        })

                });

                //when user clicks request
                $(".request").click(function () {

                    //display the message
                    document.querySelector(".message").style.display = "flex"
                })

                //when user clicks withdraw request
                $(".withdraw").click(function () {
                    document.querySelector(".message").style.display = "flex";
                    $(".message2").hide();
                    $(".withdraw2").show();
                })

                //save the id of the product
                $(".idem").prop("id", res.data[2]._id + "/" + res.data[2].Startup_Name);

                //save the email of the product
                $(".idem").val(res.data[2].Entrepreneur_Email)

                //change money from number to string
                var money = res.data[2].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                //check to see if there are any video links
                if (res.data[2].Startup_Video_Link.length > 0) {

                    //store the video link array
                    var vids = res.data[2].Startup_Video_Link

                    //loop through the links
                    for (var v = 0; v < vids.length; v++) {
                        $("<div class = \"yplink\">" +
                            "<a class = \"vvv\"href=" + vids[v] + " target = \"_blank\">" + vids[v] + "</a>" +
                            "</div>").appendTo(".vidlink")
                    }

                    document.querySelector(".vidlink").style.display = "block";
                }

                //display the name of the startup
                vm.name = res.data[2].Startup_Name;

                //dislay what this startup does
                vm.description = res.data[2].Startup_Description;

                //display startup location
                vm.city = res.data[2].Startup_Location.City;
                vm.state = res.data[2].Startup_Location.State;

                if (res.data[2].Startup_Employees) {
                    vm.employees = res.data[2].Startup_Employees
                    document.querySelector(".emp").style.backgroundColor = "#2f2fa2"
                    document.querySelector(".emp1").style.display = "block"

                }

                if (res.data[2].Startup_RaisedCapital) {
                    vm.money2 = "USD " + res.data[2].Startup_RaisedCapital.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.querySelector(".emp2").style.display = "block"
                    document.querySelector(".emp").style.backgroundColor = "#2f2fa2"
                }

                if (res.data[2].Startup_Website) {
                    $("<a class = \"emppp\" target = \"_blank\"href=" + res.data[2].Startup_Website + ">" + res.data[2].Startup_Website + "</a>").appendTo(".emp3")

                    document.querySelector(".emp3").style.display = "block"
                    document.querySelector(".emp").style.backgroundColor = "#2f2fa2"
                }

                //to display the second description
                if (res.data[2].Startup_Description2) {
                    vm.subtitle = "Utilization of the investment."
                    vm.description2 = res.data[2].Startup_Description2
                }

                //if there is a percent offer
                if (res.data[2].Startup_Percent_Offer) {

                    $("<p class = \"offer offer2\">Needed Investment: USD " + money + " for " + res.data[2].Startup_Percent_Offer + " stake</p>").appendTo(".price")
                }

                //if therr isnt a percent offer
                if (!res.data[2].Startup_Percent_Offer) {
                    $("<p class = \"offer offer2\"> Needed investment: USD " + money + "</p>").appendTo(".price")
                }

                //if their is an industry
                if (res.data[2].Startup_TitleIndustry !== "none") {

                    //if their is a subtitle
                    if (res.data[2].Startup_SubIndustry !== "none") {
                        $("<h2 class=\"ind2\"> Industry </h2>" +
                            "<p class=\"ind3\">" + res.data[2].Startup_TitleIndustry + ": " + res.data[2].Startup_SubIndustry + "</p>").appendTo(".ind")
                    }

                    //if their isnt  subtitle
                    if (res.data[2].Startup_SubIndustry == "none") {
                        $("<h2 class = \"ind2\"> Industry </h2>" +
                            "<p class=\"ind3\">" + res.data[2].Startup_TitleIndustry + "</p>").appendTo(".ind")
                    }
                }

                //route to get the products images
                $http.post("/investor/imgfil", {
                    email: res.data[2].Entrepreneur_Email,
                    name: res.data[2].Startup_Name
                })
                    .then((res) => {

                        //loop through the images
                        for (var p = 0; p < res.data.length; p++) {

                            //store the images or video type
                            var type = res.data[p].contentType
                            type = type.split("/")
                            var type2 = type[1]

                            if (type[0] == "video") {
                                $("<div class = \"imgs\">" +
                                    "<video class = \"img3\" src = \"../writeto/" + res.data[p]._id + "." + type2 + "\" style = \"linear-gradient(white,white,grey)\" controls></video>" +
                                    "</div>"
                                ).appendTo(".imgs1")
                            }

                            else {
                                $("<div class = \"imgs\">" +
                                    "<img class = \"img3\" src = \"../writeto/" + res.data[p]._id + "." + type2 + "\" style = \"linear-gradient(white,white,grey)\"></img>" +
                                    "</div>"
                                ).appendTo(".imgs1")
                            }

                        }

                        new Flickity(".imgs1", {
                            // options
                            fullscreen: true,
                            lazyLoad: 1,
                            cellAlign: 'left',
                            contain: true,
                        });

                    })

                //route to get the startup owners information
                $http.post("/investor/entr", {
                    email: res.data[2].Entrepreneur_Email
                })
                    .then((res) => {

                        //entrepreneur id
                        vm.enid = res.data._id

                        var initials = res.data.FirstName[0] + " " + res.data.LastName[0];

                        vm.init = initials

                        //owners name
                        vm.name2 = res.data.FirstName + " " + res.data.LastName;

                        //owners type
                        vm.type = res.data.Position

                        //owners bio
                        vm.bio = res.data.Bio

                    })

                //route to get the startup owners profile image
                $http.post("api/profile2", {
                    user: res.data[2].Entrepreneur_Email
                })
                    .then(function (response) {

                        if (response.data == "none") {
                            return;
                        }

                        var prf = document.querySelector(".pr")
                        var prff = document.querySelector(".imgp2")

                        //store the images or video type
                        var type = response.data.contentType
                        type = type.split("/")
                        type = type[1]

                        $(prf).html("");
                        $(prff).html("");

                        var prf2 = response.data._id + "." + type;
                        prf.style.backgroundImage = 'url(../profile/' + prf2 + ')'
                        prff.style.backgroundImage = 'url(../profile/' + prf2 + ')'
                    })

            })

    };

    //saved satrups controller function
    app.controller("SavedController2", SavedController2);

    function SavedController2($http, $window, $location, $scope, jwtHelper) {

        var vm = this;

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        $(".burger").click(function () {
            $(".link").toggleClass('nav-active')
        })

        //when user clicks logout
        $(".vlogout").click(function () {
            //delete the token
            delete $window.localStorage.token

            location.href = '/login'
        })

        //when user clicks account
        $(".vcount").click(function () {
            //redirect to the profile page
            location.href = "/profile"
        })

        //send to client users first name
        vm.firstname = user.FirstName;
        vm.email = user.Email;

        //to track if divdropnav is opened
        var opened = false;

        //to track if bell icon is clicked
        var notificationBell = false;

        //when user clicks the bell icon
        $(".fa").click(function () {

            //if notification is closed
            if (notificationBell == false) {

                //show notification div
                $(".divdropnotification").show();
                $(".divdropnav").hide();

                //track dropdown profile is closed
                opened = false;
                //track notification is open
                notificationBell = true;
                return;

            }

            //if notification is open
            else {
                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;
            }
        });

        //when user clicks their name
        $(".divdrop11").click(function () {

            //if divdropnav is opened
            if (opened == false) {
                $(".divdropnav").show();
                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;
                opened = true;
                return;
            }

            //if divdropnav is closed
            if (opened == true) {
                $(".divdropnav").hide();
                opened = false;
                return;
            }

        })

        //function to save and unsave the startups
        function save() {
            //when investor saves a startups
            $('.save').click(function () {

                //store the products email
                var id = $(this).parents("div")[2].children[0].id;

                //route to save the product
                $http.post("/investor/savestrt", {
                    id: id,
                    user: user.Email
                })
                    .then((res) => {

                        if (res.data == "saved") {
                            $(this).removeClass("save").addClass("unsave")
                            this.style.color = "red"
                        }

                        else if (res.data == "none1") {

                            //unsave the data
                            var id2 = $(this).parents("div")[2].children[0].id;

                            $http.post("/investor/unsave", {
                                id: id2,
                                user: user.Email
                            })
                                .then((res) => {

                                    if (res.data == "done") {
                                        $(this).removeClass("unsave").addClass("save")
                                        this.style.color = "#b5b6ba"

                                    }
                                })
                        }

                        else {
                            location.href = "/products"
                        }
                    })
            })

            //when investor unsaves a startup
            $(".unsave").click(function () {

                //store the products id
                var id2 = $(this).parents("div")[2].children[0].id;

                $http.post("/investor/unsave", {
                    id: id2,
                    user: user.Email
                })
                    .then((res) => {

                        if (res.data == "done") {
                            location.href = "/savedstartups"
                        }
                    })

            });
        }

        //retrive the saved startups
        $http.post("investor/savedStartups", {
            email: user.Email
        })
            .then((response) => {

                if (response.data == "none") {
                    //hide the loading circle
                    $(".loader").hide();
                    return;
                }

                if (response.data[0] == null && response.data.length == 1) {
                    $(".loader").hide();

                    return;
                }

                if (response.data.length > 0) {

                    //hide the loading circle
                    $(".loader").hide();

                    $(".inv1").hide();

                    var savebtn = "<p class = \"unsave hrt fa fa-heart\" style =\"color: red\" ></p>"

                    //var to store the offer
                    var offer;
                    var myFiles = [];
                    //to upload multiple data
                    for (var d = 0; d < response.data.length; d++) {

                        //remove all the white spaces from the product name
                        nstr = response.data[d].Startup_Name.replace(/\s/g, '');

                        if (response.data[d].Startup_Percent_Offer) {
                            //change money from number to string
                            var money = response.data[d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            offer = "<p class = \"offer offer2\">Investment: USD " + money + " for " + response.data[d].Startup_Percent_Offer + " stake</p>"

                        }

                        if (!response.data[d].Startup_Percent_Offer) {
                            //change money from number to string
                            var money = response.data[d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            offer = "<p class = \"offer offer2\">Investment: USD " + money + " </p>"

                        }
                        myFiles.push(
                            "<input type=\"hidden\" class = \"idem\" id=" + response.data[d]._id + " value = " + response.data[d].Entrepreneur_Email + ">" +
                            "<div class = \"img2\">" +
                            "</div>" +
                            "<div class = \"en  blm\">" +
                            "<div class = \"en2\">" +
                            "</div>" +
                            "<div class = \"en3\">" +
                            "<p class = \"enp enpp\">loading..</p>" +
                            "<p class = \"enp2 enpp\">loading.. </p>" +
                            "</div>" +
                            "</div>" +
                            "<h2 class=\"name blm\">" + response.data[d].Startup_Name + "</h2>" +
                            "<p class=\"description blm\">" + response.data[d].Startup_Description + "</p>" +
                            "<div class = \"of\">" +
                            offer +
                            "</div>" +
                            "<div class = \"svr\">" +
                            "<div class = \"lc\">" +
                            "<i class=\"fa fa-map-marker\" id=\"location\"> " + response.data[d].Startup_Location.City + " " + response.data[d].Startup_Location.State + "</i>" +
                            savebtn +
                            "</div>" +
                            "</div>"
                        );
                        myFiles = myFiles.join("");
                        $("<div class = \"test\">" + myFiles + "</div>").appendTo(".products");
                        myFiles = [];
                        name1.push(nstr)
                    }

                    save();

                    //when user clicks the startups
                    $(".blm").click(function () {

                        //product id
                        var prid = $(this).parents("div")[0].children[0].id

                        $location.path("/preview/" + prid + "")
                        $scope.$apply();

                    });

                    //loop through the products
                    for (var i = 0; i < response.data.length; i++) {


                        (function (data) {

                            var em = $(".idem").parent("div")

                            //route to get the products images
                            $http.post("/investor/imgfil", {
                                email: data.Entrepreneur_Email,
                                name: data.Startup_Name
                            })
                                .then((res) => {

                                    function flick() {
                                        //loop through the images
                                        for (var p = 0; p < res.data.length; p++) {

                                            //loop through the products email
                                            for (var e = 0; e < em.length; e++) {

                                                if (em[e].children[0].value == res.data[p].metadata.email && em[e].children[3].innerHTML == res.data[p].metadata.Product_id) {

                                                    //store the images or video type
                                                    var type = res.data[p].contentType
                                                    type = type.split("/")
                                                    var type2 = type[1]

                                                    if (type[0] == "video") {
                                                        $("<video class = \"img3\" id = \"vd\" src=\"../writeto/" + res.data[p]._id + "." + type2 + "\" controls></video>").appendTo(em[e].children[1])
                                                    }
                                                    else {
                                                        $("<div class = \"img3\" style = \" background-image: url(../writeto/" + res.data[p]._id + "." + type2 + "), linear-gradient(white,white,grey)\"></div>").appendTo(em[e].children[1])
                                                    }

                                                }
                                            }


                                        }

                                    }

                                    //function to place lickity
                                    async function Flickit() {
                                        await flick();

                                        //loop through the div holding the products images
                                        for (var i = 0; i < em.length; i++) {
                                            if (em[i].children[1].children.length > 1) {
                                                var elem = em[i].children[1];
                                                var flkty = new Flickity(elem, {
                                                    // options
                                                    cellAlign: 'left',
                                                    contain: true
                                                });
                                            }
                                        }
                                    }

                                    Flickit();
                                })

                            //route to get the entrepreneurs name
                            $http.post("/investor/entr", {
                                email: data.Entrepreneur_Email
                            })
                                .then((res) => {

                                    var initials = res.data.FirstName[0] + " " + res.data.LastName[0]

                                    //loop through the products email
                                    for (var e = 0; e < em.length; e++) {

                                        if (em[e].children[0].value == res.data.Email) {

                                            //var to store the div holding the entrepreneurs name
                                            var prf = em[e].children[2].children[1].children[0]

                                            //var to store the div holding the entrepreneurs position
                                            var prf2 = em[e].children[2].children[1].children[1]

                                            //var to store the div holding the entrepreneurs profile
                                            var prf3 = em[e].children[2].children[0]

                                            $(prf3).html(initials);

                                            $(prf2).html("Startup " + res.data.Position)

                                            $(prf).html(res.data.FirstName + " " + res.data.LastName)

                                        }
                                    }
                                })

                            //route to get the profiles images
                            $http.post("api/profile2", {
                                user: data.Entrepreneur_Email
                            })
                                .then(function (response) {

                                    if (response.data !== "none") {

                                        //loop through the products email
                                        for (var e = 0; e < em.length; e++) {

                                            if (em[e].children[0].value == response.data.metadata.email) {

                                                //var to store the div holding the entrepreneurs profile
                                                var prf = em[e].children[2].children[0]

                                                //store the images or video type
                                                var type = response.data.contentType
                                                type = type.split("/")
                                                type = type[1]

                                                var prf2 = response.data._id + "." + type;
                                                $(prf).html("")
                                                prf.style.backgroundImage = 'url(../profile/' + prf2 + ')'

                                            }
                                        }

                                    }
                                });


                        }(response.data[i]));

                    }
                }
            })



        //route to check for messages / notifications
        $http.post("investor/not", {
            id: user._id
        })
            .then((res) => {
                //check if reponse is not none
                if (res.data !== "none") {

                    $(".cl").html("You have " + res.data + " unread message(s)")
                    $(".badge").show();
                    $(".badge2").show();
                }
            })

        //post function to get the users profile picture
        $http.post("api/profile", {
            user: user.Email,
        })
            .then(function (response) {

                if (response.data) {

                    if (response.data !== "none") {
                        //remove the txt element inside the div
                        $('.logo2').contents().filter(function () {
                            return this.nodeType === 3;
                        }).remove();

                        //image file
                        document.querySelector(".logo2").style.backgroundImage = 'url(../profile/' + response.data + ')';
                    }
                }
            })

    };

    //products controller function
    app.controller("ProductsController", ProductsController);

    function ProductsController($http, $window, jwtHelper, $location, $scope) {
        var vm = this;
        vm.title = "products";

        //global variable to store the products
        var pr;

        //var to store the products that are within miles
        var data2 = {
            data: []
        }

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        //send to client users first name
        vm.firstname = user.FirstName;
        vm.email = user.Email;

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        $(".burger").click(function () {
            $(".link").toggleClass('nav-active')
        })

        //when user clicks account
        $(".vcount").click(function () {
            //redirect to the profile page
            location.href = "/profile"
        })

        //when user clicks logout
        $(".vlogout").click(function () {
            //delete the token
            delete $window.localStorage.token

            location.href = '/login'
        })

        //to track if divdropnav is opened
        var opened = false;

        //to track if bell icon is clicked
        var notificationBell = false;

        //when user clicks the bell icon
        $(".bell").click(function () {

            //if notification is closed
            if (notificationBell == false) {

                //show notification div
                $(".divdropnotification").show();
                $(".divdropnav").hide();

                //track dropdown profile is closed
                opened = false;
                //track notification is open
                notificationBell = true;
                return;

            }

            //if notification is open
            else {
                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;
            }
        });

        //when user clicks their name
        $(".divdrop11").click(function () {

            //if divdropnav is opened
            if (opened == false) {
                $(".divdropnav").show();
                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;

                opened = true;
                return;
            }

            //if divdropnav is closed
            if (opened == true) {
                $(".divdropnav").hide();
                opened = false;
                return;
            }

        })

        //function to display products with its pictures
        function run(response) {

            //get the products images
            async function img() {
                //call the products function
                await products(response)

                //loop through the products
                for (var i = 1; i < response.data.length; i++) {


                    (function (data) {

                        var em = $(".idem").parent("div")

                        //route to get the products images
                        $http.post("/investor/imgfil", {
                            email: data.Entrepreneur_Email,
                            name: data.Startup_Name
                        })
                            .then((res) => {

                                function flick() {
                                    //loop through the images
                                    for (var p = 0; p < res.data.length; p++) {

                                        //loop through the products email
                                        for (var e = 0; e < em.length; e++) {

                                            if (em[e].children[0].value == res.data[p].metadata.email && em[e].children[3].innerHTML == res.data[p].metadata.Product_id) {

                                                //store the images or video type
                                                var type = res.data[p].contentType
                                                type = type.split("/")
                                                var type2 = type[1]

                                                if (type[0] == "video") {
                                                    $("<video class = \"img3\" id = \"vd\" src=\"../writeto/" + res.data[p]._id + "." + type2 + "\" controls></video>").appendTo(em[e].children[1])
                                                }
                                                else {
                                                    $("<div class = \"img3\" style = \" background-image: url(../writeto/" + res.data[p]._id + "." + type2 + "), linear-gradient(white,white,grey)\"></div>").appendTo(em[e].children[1])
                                                }

                                            }
                                        }


                                    }

                                }

                                //function to place lickity
                                async function Flickit() {
                                    await flick();

                                    //loop through the div holding the products images
                                    for (var i = 0; i < em.length; i++) {
                                        if (em[i].children[1].children.length > 1) {
                                            var elem = em[i].children[1];
                                            var flkty = new Flickity(elem, {
                                                // options
                                                cellAlign: 'left',
                                                contain: true
                                            });
                                        }
                                    }
                                }

                                Flickit();
                            })

                        //route to get the entrepreneurs name
                        $http.post("/investor/entr", {
                            email: data.Entrepreneur_Email
                        })
                            .then((res) => {

                                var initials = res.data.FirstName[0] + " " + res.data.LastName[0]

                                //loop through the products email
                                for (var e = 0; e < em.length; e++) {

                                    if (em[e].children[0].value == res.data.Email) {

                                        //var to store the div holding the entrepreneurs name
                                        var prf = em[e].children[2].children[1].children[0]

                                        //var to store the div holding the entrepreneurs position
                                        var prf2 = em[e].children[2].children[1].children[1]

                                        //var to store the div holding the entrepreneurs profile
                                        var prf3 = em[e].children[2].children[0]

                                        $(prf3).html(initials);

                                        $(prf2).html("Startup " + res.data.Position)

                                        $(prf).html(res.data.FirstName + "  " + res.data.LastName)

                                    }
                                }
                            })

                        //route to get the profiles images
                        $http.post("api/profile2", {
                            user: data.Entrepreneur_Email
                        })
                            .then(function (response) {

                                if (response.data !== "none") {

                                    //loop through the products email
                                    for (var e = 0; e < em.length; e++) {

                                        if (em[e].children[0].value == response.data.metadata.email) {

                                            //var to store the div holding the entrepreneurs profile
                                            var prf = em[e].children[2].children[0]

                                            //store the images or video type
                                            var type = response.data.contentType
                                            type = type.split("/")
                                            type = type[1]

                                            var prf2 = response.data._id + "." + type;
                                            $(prf).html("")
                                            prf.style.backgroundImage = 'url(../profile/' + prf2 + ')'

                                        }
                                    }

                                }
                            });


                    }(response.data[i]));

                }

                //when user clicks the startups
                $(".blm").click(function () {

                    //product id
                    var prid = $(this).parents("div")[0].children[0].id

                    var win = window.open("/preview/" + prid + "", '_blank');
                    if (win) {
                        //Browser has allowed it to be opened
                        win.focus();
                    } else {
                        //Browser has blocked it
                        alert('Please allow popups for this website');
                    }
                });
            }
            img();
        }

        //function to save and unsave th startups
        function save() {
            //when investor saves a startups
            $('.save').click(function () {

                //store the products email
                var id = $(this).parents("div")[2].children[0].id;

                //route to save the product
                $http.post("/investor/savestrt", {
                    id: id,
                    user: user.Email
                })
                    .then((res) => {

                        if (res.data == "saved") {
                            $(this).removeClass("save").addClass("unsave")
                            this.style.color = "red"
                        }

                        else if (res.data == "none1") {

                            //unsave the data
                            var id2 = $(this).parents("div")[2].children[0].id;

                            $http.post("/investor/unsave", {
                                id: id2,
                                user: user.Email
                            })
                                .then((res) => {

                                    if (res.data == "done") {
                                        $(this).removeClass("unsave").addClass("save")
                                        this.style.color = "#b5b6ba"

                                    }
                                })
                        }

                        else {
                            location.href = "/products"
                        }
                    })
            })

            //when investor unsaves a startup
            $(".unsave").click(function () {

                //store the products id
                var id2 = $(this).parents("div")[2].children[0].id;

                $http.post("/investor/unsave", {
                    id: id2,
                    user: user.Email
                })
                    .then((res) => {

                        if (res.data == "done") {
                            location.href = "/products"
                        }
                    })

            });
        }

        //when user clicks clear filter
        $(".me").click(function () {
            location.href = "/products"
        })
        var x = document.getElementById("in1");

        //when user enters the price
        $(".submit12").click(function () {

            //store the value of the filter price
            var min = $(".min").val();
            var max = $(".max").val();
            min = parseInt(min)
            max = parseInt(max)

            //var to store products that meet the price filter 
            var price = {
                data: []
            };
            var dataPrice = [];
            //if there is data on data2
            if (data2.data.length > 1) {
                dataPrice.push(data2.data)
            }

            //if there is data to be filterd
            if (dataPrice[0].length > 1 && min || max) {

                async function check() {

                    price.data.push(dataPrice[0][0])

                    //loop through the products
                    for (var i = 1; i < dataPrice[0].length; i++) {

                        //if there is a maximun and minimum
                        if (dataPrice[0][i].Startup_Money_Request >= min && dataPrice[0][i].Startup_Money_Request <= max) {
                            //push the data
                            price.data.push(dataPrice[0][i]);
                        }

                        //if there is a minimum only
                        if (dataPrice[0][i].Startup_Money_Request >= min && !max) {
                            //push the data
                            price.data.push(dataPrice[0][i]);
                        }

                        //if there is a maximim only
                        else if (dataPrice[0][i].Startup_Money_Request <= max && !min) {
                            //push the data
                            price.data.push(dataPrice[0][i]);
                        }
                    }

                    //if there is data
                    if (price.data.length > 0) {

                        //scroll to the top
                        window.scrollTo(0, 0);

                        //call the hide function
                        hide(price);

                        //call the run function
                        run(price)

                        //function to save and unsave products
                        save()
                    }

                    //if there is no data
                    else {

                        $(".test").remove();
                        $(".me").show();
                    }
                }

                check();

            }

        })

        //when user clicks industries
        $("#ijf2").click(function () {


            if (window.getComputedStyle(x).display === "none") {
                document.getElementById("in1").style.display = "block";
            }

            else {
                document.getElementById("in1").style.display = "none";

                //set the distance back to any distance
                $("#in2").val("any")

                //set the price filter back to empty
                $(".price").val("")

                //store the value of the text
                var txt = $("#ijf2").text()

                //if industry is any
                if (txt.toLowerCase() == "any") {
                    //get the startups
                    $http.post("/investor/filstartup", {
                        ind: "any",
                        email: user.Email
                    })
                        .then((response) => {

                            //store the products
                            pr = response.data;
                            data2.data = response.data

                            //scroll to the top
                            window.scrollTo(0, 0);

                            //call the hide function
                            hide(response);

                            //call the run function
                            run(response)

                            //function to save and unsave products
                            save()
                        })
                    return;
                }

                //store the selected industries
                var ind2 = []
                var obj = {};

                //if industry has a subtitle
                if (txt.includes(":")) {

                    var ind = txt.split(":");
                    var ind3 = ind[0].replace(/([A-Z])/g, ' $1').trim()
                    obj["title"] = ind3.toLowerCase();
                    obj["subtitle"] = ind[1].toLowerCase();
                    obj["fil"] = "fil";

                    //push the industry category to the ind2 variable
                    ind2.push(obj);

                    //get the startups
                    $http.post("/investor/filstartup", {
                        ind: ind2,
                        email: user.Email
                    })
                        .then((response) => {

                            //store the products
                            pr = response.data;
                            data2.data = response.data

                            //scroll to the top
                            window.scrollTo(0, 0);

                            //call the hide function
                            hide(response);

                            //call the run function
                            run(response)

                            //function to save and unsave products
                            save()
                        })
                }

                //if industry doesnt have a subtitle
                else {
                    var ind = txt.split(":");
                    var ind3 = ind[0].replace(/([A-Z])/g, ' $1').trim()
                    obj["title"] = ind3.toLowerCase();
                    obj["fil"] = "fil";

                    //push the industry category to the ind2 variable
                    ind2.push(obj);

                    //get the startups
                    $http.post("/investor/filstartup", {
                        ind: ind2,
                        email: user.Email
                    })
                        .then((response) => {

                            //store the products
                            pr = response.data;
                            data2.data = response.data

                            //scroll to the top
                            window.scrollTo(0, 0);

                            //call the hide function
                            hide(response);

                            //call the run function
                            run(response)

                            //function to save and unsave products
                            save()
                        })
                }
            }


        });

        //when user clicks any
        $(".any").click(function () {
            //set the distance back to any distance
            $("#in2").val("any")

            //set the price filter back to empty
            $(".price").val("")

            $("#ijf2").html("Any<i class=\"fa fa-angle-down\" id=\"arrow\"></i>")

            document.getElementById("in1").style.display = "none";

            //get the startups
            $http.post("/investor/filstartup", {
                ind: "any",
                email: user.Email
            })
                .then((response) => {

                    //store the products
                    pr = response.data;
                    data2.data = response.data

                    //scroll to the top
                    window.scrollTo(0, 0);

                    //call the hide function
                    hide(response);

                    //call the run function
                    run(response)

                    //function to save and unsave products
                    save()
                })
        });

        //get function to get the industries
        $http.get("entrepreneur/industry")
            .then((res) => {

                var dat = res.data

                //array var to store the html code
                var file2 = [];
                //loop through the data
                for (var i = 0; i < dat.length; i++) {

                    //loop through the subtitle
                    for (var s = 0; s < dat[i].SubTitle.length; s++) {
                        file2.push(
                            "<label class = \"sub\">" + dat[i].SubTitle[s] + "</label>" + "<br>")
                    }
                    var file2 = file2.join("")

                    $("<div class = \"title\">" +
                        "<label class = \"radio2\" >" + dat[i].Title + "</label>" +
                        "<div class = \"subtitle\">" + file2 + "</div>" +
                        "</div>").appendTo("#in1")

                    file2 = [];
                }

                var title;
                //when user clicks the title
                $(".radio2").click(function () {

                    $(".subtitle").hide();

                    //store the title
                    title = $(this)[0].innerHTML;

                    title = title.split(" ").join("")
                    var subdiv = $(this).parent("div")[0].children[1]

                    $("#ijf2").html(title + "<i class=\"fa fa-angle-down\" id=\"arrow\"></i>");

                    //check to see if there is a subtitle
                    if (subdiv) {
                        $(subdiv).show()
                    }
                    else {

                        //set the distance back to any distance
                        $("#in2").val("any")

                        //set the price filter back to empty
                        $(".price").val("")

                        $("#in1").hide();

                        //store the value of the text
                        var txt = $("#ijf2").text()

                        var ind = txt.split(":");
                        var ind3 = ind[0].replace(/([A-Z])/g, ' $1').trim()
                        obj["title"] = ind3.toLowerCase();
                        obj["fil"] = "fil";

                        //push the industry category to the ind2 variable
                        ind2.push(obj);

                        //get the startups
                        $http.post("/investor/filstartup", {
                            ind: ind2,
                            email: user.Email
                        })
                            .then((response) => {

                                //store the products
                                pr = response.data;
                                data2.data = response.data

                                //scroll to the top
                                window.scrollTo(0, 0);

                                //call the hide function
                                hide(response);

                                //call the run function
                                run(response)

                                //function to save and unsave products
                                save()
                            })
                    }
                });

                //when user cliks subtitle
                $(".sub").click(function () {
                    var sub = $(this)[0].innerHTML;

                    sub = sub.split(" ").join("")
                    //set the distance back to any distance
                    $("#in2").val("any")

                    //set the price filter back to empty
                    $(".price").val("")

                    $("#ijf2").html(title + ":" + sub + "<i class=\"fa fa-angle-down \" id = \"arrow\"></i>");
                    $(".subtitle").hide();
                    $("#in1").hide();

                    //store the selected industries
                    var ind2 = []
                    var obj = {};

                    //store the value of the text
                    var txt = $("#ijf2").text()

                    var ind = txt.split(":");
                    var ind3 = ind[0].replace(/([A-Z])/g, ' $1').trim()
                    obj["title"] = ind3.toLowerCase();
                    obj["subtitle"] = ind[1].toLowerCase();
                    obj["fil"] = "fil";

                    //push the industry category to the ind2 variable
                    ind2.push(obj);

                    //get the startups
                    $http.post("/investor/filstartup", {
                        ind: ind2,
                        email: user.Email
                    })
                        .then((response) => {

                            //store the products
                            pr = response.data;
                            data2.data = response.data

                            //scroll to the top
                            window.scrollTo(0, 0);

                            //call the hide function
                            hide(response);

                            //call the run function
                            run(response)

                            //function to save and unsave products
                            save()
                        })
                });

            });

        //get the type of industries the investor is intrested in
        $http.post("/investor/ind", {
            email: user.Email
        })
            .then((res) => {

                //variable to store the respons data
                var data = res.data

                //get the startups
                $http.post("/investor/filstartup", {
                    ind: data,
                    email: user.Email
                })
                    .then((response) => {
                          
                        //store the products
                        pr = response.data;
                        data2.data = response.data

                        //scroll to the top
                        window.scrollTo(0, 0);


                        //call the hide function
                        hide(response);

                        //call the run function
                        run(response)

                        //function to save and unsave products
                        save()
                    })
            })

        //when user clicks the select distance drop down
        $("select#in2").change(function () {

            $(".test").remove();
            $(".loader").show();

            //set the price filter back to empty
            $(".price").val("")

            var mile = $("select#in2").val();
            var title = $("#ijf2").text()

            //check if title has subtitle in it
            if (title.includes(":")) {

                //split the title
                title = title.split(":")
                title = title[0].replace(/([A-Z])/g, ' $1').trim()
                title = title.toLowerCase();
            }
            else {
                title = $("#ijf2").text()
                title = title.replace(/([A-Z])/g, ' $1').trim()
                title = title.toLowerCase();
            }

            //store the users location
            var lat = user.lat;
            var long = user.long;

            if (mile == "any") {

                data2.data = []

                async function any() {
                    //loop through pr
                    for (var u = 0; u < pr.length; u++) {
                        data2.data.push(pr[u])
                    }

                    //call the hide function
                    hide(data2);

                    //scroll to the top
                    window.scrollTo(0, 0);

                    //call the run function
                    run(data2)

                    //function to save and unsave products
                    save()
                }
                any();
            }
            else {

                data2.data = [];

                data2.data.push(pr[0])
                var k = 1

                //loop through the products
                for (var p = 1; p < pr.length; p++) {


                    //convert mile from string to  number
                    mile = parseInt(mile)

                    var origin1 = new google.maps.LatLng(lat, long);
                    var destinationB = new google.maps.LatLng(pr[p].lat, pr[p].long);
                    (function (data) {

                        var service = new google.maps.DistanceMatrixService();
                        service.getDistanceMatrix(
                            {
                                origins: [origin1],
                                destinations: [destinationB],
                                travelMode: 'DRIVING'

                            }, callback);


                        function callback(response, status) {

                            //get the distance and split out the km
                            var distance = response.rows[0].elements[0].distance.text.split(" ")

                            //convert distance to miles
                            var distanceM = distance[0] / 1.6;


                            //round distance to 1 decimal place
                            var distanceMiles = Math.round(distanceM * 10) / 10

                            K = k++

                            //check to see if product matches the investors intrests
                            if (data.Startup_TitleIndustry == title || title == "any") {
                                //check to see if investor is within distance
                                if (distanceMiles <= mile) {
                                    data2.data.push(data)
                                }
                            }

                            if (k == p) {

                                if (data2.data.length > 1) {

                                    //call the hide function
                                    hide(data2);

                                    //scroll to the top
                                    window.scrollTo(0, 0);

                                    //call the run function
                                    run(data2)

                                    //function to save and unsave products
                                    save()
                                }
                                else {
                                    $(".test").remove();
                                    $(".me").show();
                                }

                            }

                        }

                    }(pr[p]))

                }



            }
        });

        //route to check for messages / notifications
        $http.post("investor/not", {
            id: user._id
        })
            .then((res) => {
                //check if reponse is not none
                if (res.data !== "none") {

                    $(".cl").html("You have " + res.data + " unread message(s)")
                    $(".badge").show();
                    $(".badge2").show();
                }
            })


        //post function to get the users profile picture
        $http.post("api/profile", {
            user: user.Email,
        })
            .then(function (response) {

                if (response.data) {

                    if (response.data !== "none") {
                        //remove the txt element inside the div
                        $('.logo2').contents().filter(function () {
                            return this.nodeType === 3;
                        }).remove();

                        //image file
                        document.querySelector(".logo2").style.backgroundImage = 'url(../profile/' + response.data + ')';
                    }
                }
            })

    };

    //requested  controller function
    app.controller("RequestedController", RequestedController);

    function RequestedController($location, $http, $window, $scope, jwtHelper) {
        var vm = this
        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        $(".burger").click(function () {
            $(".link").toggleClass('nav-active')
        })

        //when user clicks account
        $(".vcount").click(function () {
            //redirect to the profile page
            location.href = "/profile"
        })

        //when user clicks logout
        $(".vlogout").click(function () {
            //delete the token
            delete $window.localStorage.token

            location.href = '/login'
        })

        //send to client users first name
        vm.firstname = user.FirstName;
        vm.email = user.Email;

        //to track if divdropnav is opened
        var opened = false;

        var notificationBell = false;

        //when user clicks the bell icon
        $(".fa").click(function () {

            //if notification is closed
            if (notificationBell == false) {

                //show notification div
                $(".divdropnotification").show();
                $(".divdropnav").hide();

                //track dropdown profile is closed
                opened = false;
                //track notification is open
                notificationBell = true;
                return;

            }

            //if notification is open
            else {
                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;
            }
        });

        //when user clicks their name
        $(".divdrop11").click(function () {

            //if divdropnav is opened
            if (opened == false) {
                $(".divdropnav").show();

                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;

                opened = true;
                return;
            }

            //if divdropnav is closed
            if (opened == true) {
                $(".divdropnav").hide();
                opened = false;
                return;
            }

        })

        //function to save and unsave the startups
        function save() {
            //when investor saves a startups
            $('.save').click(function () {

                //store the products email
                var id = $(this).parents("div")[2].children[0].id;

                //route to save the product
                $http.post("/investor/savestrt", {
                    id: id,
                    user: user.Email
                })
                    .then((res) => {

                        if (res.data == "saved") {
                            $(this).removeClass("save").addClass("unsave")
                            this.style.color = "red"
                        }

                        else if (res.data == "none1") {

                            //unsave the data
                            var id2 = $(this).parents("div")[2].children[0].id;

                            $http.post("/investor/unsave", {
                                id: id2,
                                user: user.Email
                            })
                                .then((res) => {

                                    if (res.data == "done") {
                                        $(this).removeClass("unsave").addClass("save")
                                        this.style.color = "#b5b6ba"

                                    }
                                })
                        }

                        else {
                            location.href = "/products"
                        }
                    })
            })

            //when investor unsaves a startup
            $(".unsave").click(function () {

                //store the products id
                var id2 = $(this).parents("div")[2].children[0].id;

                $http.post("/investor/unsave", {
                    id: id2,
                    user: user.Email
                })
                    .then((res) => {

                        if (res.data == "done") {
                            location.href = "/savedstartups"
                        }
                    })

            });
        }

        //route to get the requested apps
        $http.post("/investor/requested", {
            email: user.Email
        })
            .then((response) => {

                //check if there is data
                if (response.data == "none") {

                    //hide the loading circle
                    $(".loader").hide();
                    return;
                }

                if (response.data.length > 1) {

                    //hide the loading circle
                    $(".loader").hide();

                    $(".inv1").hide();

                    var savebtn = "<p class = \"save hrt fa fa-heart\" style =\"color: #b5b6ba\" ></p>";

                    //var to store the offer
                    var offer;
                    var myFiles = [];
                    //to upload multiple data
                    for (var d = 1; d < response.data.length; d++) {


                        //check if product is already saved
                        if (response.data[0].length > 0) {

                            //check if the product is saved
                            var x = response.data[0].every(e => e !== response.data[d]._id)

                            if (x == false) {
                                savebtn = "<p  class = \"unsave hrt fa fa-heart\" style =\"color: red\"></p>"
                            }
                            else {
                                savebtn = "<p  class = \"save hrt fa fa-heart\" style =\"color: #b5b6ba\" ></p>"
                            }

                        }

                        //remove all the white spaces from the product name
                        nstr = response.data[d].Startup_Name.replace(/\s/g, '');

                        if (response.data[d].Startup_Percent_Offer) {
                            //change money from number to string
                            var money = response.data[d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            offer = "<p class = \"offer offer2\">Investment: USD " + money + " for " + response.data[d].Startup_Percent_Offer + " stake</p>"

                        }

                        if (!response.data[d].Startup_Percent_Offer) {
                            //change money from number to string
                            var money = response.data[d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            offer = "<p class = \"offer offer2\">Investment: USD " + money + " </p>"

                        }
                        myFiles.push(
                            "<input type=\"hidden\" class = \"idem\" id=" + response.data[d]._id + " value = " + response.data[d].Entrepreneur_Email + ">" +
                            "<div class = \"img2\">" +
                            "</div>" +
                            "<div class = \"en  blm\">" +
                            "<div class = \"en2\">" +
                            "</div>" +
                            "<div class = \"en3\">" +
                            "<p class = \"enp enpp\">loading..</p>" +
                            "<p class = \"enp2 enpp\">loading.. </p>" +
                            "</div>" +
                            "</div>" +
                            "<h2 class=\"name blm\">" + response.data[d].Startup_Name + "</h2>" +
                            "<p class=\"description blm\">" + response.data[d].Startup_Description + "</p>" +
                            "<div class = \"of\">" +
                            offer +
                            "</div>" +
                            "<div class = \"svr\">" +
                            "<div class = \"lc\">" +
                            "<i class=\"fa fa-map-marker\" id=\"location\"> " + response.data[d].Startup_Location.City + " " + response.data[d].Startup_Location.State + "</i>" +
                            savebtn +
                            "</div>" +
                            "</div>"
                        );
                        myFiles = myFiles.join("");
                        $("<div class = \"test\">" + myFiles + "</div>").appendTo(".products");
                        myFiles = [];
                        name1.push(nstr)
                    }

                    save();

                    //when user clicks the startups
                    $(".blm").click(function () {

                        //product id
                        var prid = $(this).parents("div")[0].children[0].id

                        $location.path("/preview/" + prid + "")
                        $scope.$apply();

                    });

                    //loop through the products
                    for (var i = 1; i < response.data.length; i++) {


                        (function (data) {

                            var em = $(".idem").parent("div")

                            //route to get the products images
                            $http.post("/investor/imgfil", {
                                email: data.Entrepreneur_Email,
                                name: data.Startup_Name
                            })
                                .then((res) => {

                                    function flick() {
                                        //loop through the images
                                        for (var p = 0; p < res.data.length; p++) {

                                            //loop through the products email
                                            for (var e = 0; e < em.length; e++) {

                                                if (em[e].children[0].value == res.data[p].metadata.email && em[e].children[3].innerHTML == res.data[p].metadata.Product_id) {

                                                    //store the images or video type
                                                    var type = res.data[p].contentType
                                                    type = type.split("/")
                                                    var type2 = type[1]

                                                    if (type[0] == "video") {
                                                        $("<video class = \"img3\" id = \"vd\" src=\"../writeto/" + res.data[p]._id + "." + type2 + "\" controls></video>").appendTo(em[e].children[1])
                                                    }
                                                    else {
                                                        $("<div class = \"img3\" style = \" background-image: url(../writeto/" + res.data[p]._id + "." + type2 + "), linear-gradient(white,white,grey)\"></div>").appendTo(em[e].children[1])
                                                    }

                                                }
                                            }


                                        }

                                    }

                                    //function to place lickity
                                    async function Flickit() {
                                        await flick();

                                        //loop through the div holding the products images
                                        for (var i = 0; i < em.length; i++) {
                                            if (em[i].children[1].children.length > 1) {
                                                var elem = em[i].children[1];
                                                var flkty = new Flickity(elem, {
                                                    // options
                                                    cellAlign: 'left',
                                                    contain: true
                                                });
                                            }
                                        }
                                    }

                                    Flickit();
                                })

                            //route to get the entrepreneurs name
                            $http.post("/investor/entr", {
                                email: data.Entrepreneur_Email
                            })
                                .then((res) => {
                                    var initials = res.data.FirstName[0] + " " + res.data.LastName[0]
                                    //loop through the products email
                                    for (var e = 0; e < em.length; e++) {

                                        if (em[e].children[0].value == res.data.Email) {

                                            //var to store the div holding the entrepreneurs name
                                            var prf = em[e].children[2].children[1].children[0]

                                            //var to store the div holding the entrepreneurs position
                                            var prf2 = em[e].children[2].children[1].children[1]

                                            //var to store the div holding the entrepreneurs profile
                                            var prf3 = em[e].children[2].children[0]

                                            $(prf3).html(initials);

                                            $(prf2).html("Startup " + res.data.Position)

                                            $(prf).html(res.data.FirstName)

                                        }
                                    }
                                })

                            //route to get the profiles images
                            $http.post("api/profile2", {
                                user: data.Entrepreneur_Email
                            })
                                .then(function (response) {

                                    if (response.data !== "none") {

                                        //loop through the products email
                                        for (var e = 0; e < em.length; e++) {

                                            if (em[e].children[0].value == response.data.metadata.email) {

                                                //var to store the div holding the entrepreneurs profile
                                                var prf = em[e].children[2].children[0]

                                                //store the images or video type
                                                var type = response.data.contentType
                                                type = type.split("/")
                                                type = type[1]

                                                var prf2 = response.data._id + "." + type;
                                                $(prf).html("")
                                                prf.style.backgroundImage = 'url(../profile/' + prf2 + ')'

                                            }
                                        }

                                    }
                                });


                        }(response.data[i]));
                    }
                }
                else {
                    $(".loader").hide();
                }
            })

        //route to check for messages / notifications
        $http.post("investor/not", {
            id: user._id
        })
            .then((res) => {
                //check if reponse is not none
                if (res.data !== "none") {

                    $(".cl").html("You have " + res.data + " unread message(s)")
                    $(".badge").show();
                    $(".badge2").show();
                }
            })

        //post function to get the users profile picture
        $http.post("api/profile", {
            user: user.Email,
        })
            .then(function (response) {

                if (response.data) {

                    if (response.data !== "none") {
                        //remove the txt element inside the div
                        $('.logo2').contents().filter(function () {
                            return this.nodeType === 3;
                        }).remove();

                        //image file
                        document.querySelector(".logo2").style.backgroundImage = 'url(../profile/' + response.data + ')';
                    }
                }
            })

    };

    //Messagescontroller function
    app.controller("MessagesController", MessagesController);

    function MessagesController($location, $window, $http, jwtHelper) {
        var vm = this;

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        $(".burger").click(function () {
            $(".link").toggleClass('nav-active')
        })

        //when user clicks account
        $(".vcount").click(function () {
            //redirect to the profile page
            location.href = "/profile"
        })

        //when user clicks logout
        $(".vlogout").click(function () {
            //delete the token
            delete $window.localStorage.token

            location.href = '/login'
        })

        //send to client users first name
        vm.firstname = user.FirstName;
        vm.email = user.Email;

        //to track if divdropnav is opened
        var opened = false;

        var notificationBell = false;

        //when user clicks the bell icon
        $(".ta").click(function () {

            //if notification is closed
            if (notificationBell == false) {

                //show notification div
                $(".divdropnotification").show();
                $(".divdropnav").hide();

                //track dropdown profile is closed
                opened = false;
                //track notification is open
                notificationBell = true;
                return;

            }

            //if notification is open
            else {
                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;
            }
        });

        //when user clicks their name
        $(".divdrop11").click(function () {

            //if divdropnav is opened
            if (opened == false) {
                $(".divdropnav").show();
                //close notification
                $(".divdropnotification").hide();

                //track notification is closed
                notificationBell = false;
                opened = true;
                return;
            }

            //if divdropnav is closed
            if (opened == true) {
                $(".divdropnav").hide();
                opened = false;
                return;
            }

        })


        //when user clicks send
        $(".send").click(function () {

            //entrepreneur id
            var enid = $(".invid").attr("id")

            //investors id
            var invid = user._id

            //message
            var msg = $(".write").val();


            if (msg) {
                $http.post("investor/initiate", {
                    invid: invid,
                    enid: enid,
                    msg: msg,
                })
                    .then((res) => {

                        $("<div class = \"hld\">" +
                            "<div class = \"msg34\">" +
                            "<p class = \"msg332\">" + msg + "</p>" +
                            "</div>" + "</div>").appendTo(".message3")

                        //scroll to the bottom of the message
                        var d = $('.message2');
                        d.scrollTop(d.prop("scrollHeight"));

                        $(".write").val("");
                    })
            }
        })

        //route to showcase the messages
        $http.post("investor/chat", {
            id: user._id
        })
            .then((res) => {

                //check if reponse is not none
                if (res.data !== "none") {
                    $(".p").html("Click on the message(s) on the left to read.")

                    //loop through the messages
                    for (var i = 0; i < res.data.length; i++) {

                        (function (data) {
                            //route to get the etrepreneurs info
                            $http.post("investor/chat2", {
                                id: data.EntrepreneurId
                            })
                                .then((response) => {


                                    var data2 = response.data

                                    var initial = data2.FirstName[0] + " " + data2.LastName[0]

                                    //route to get the profile image
                                    $http.post("api/profile2", {
                                        user: data2.Email
                                    })
                                        .then(function (response) {

                                            var prf3;

                                            //store the images or video type
                                            if (response.data.contentType) {
                                                var type = response.data.contentType
                                                type = type.split("/")
                                                type = type[1]

                                                var prf2 = response.data._id + "." + type;

                                            }

                                            if (prf2) {
                                                prf3 = "<div class = \"pr\" id= " + prf2 + " style = \"background-image: url(../profile/" + prf2 + ")\"></div>"
                                            }
                                            else {
                                                prf3 = "<div class = \"pr\" id= " + prf2 + ">" + initial + "</div>"
                                            }


                                            //check if the message has an unread message
                                            if (data.ReadInvestor == true) {

                                                $("<div class = \"msg\">" +
                                                    "<input type=\"hidden\" id = " + data._id + " value = " + data2._id + ">" +
                                                    prf3 +
                                                    "<div class = \"nm\">" +
                                                    "<p class = \"nm1\">" + data2.FirstName + " " + data2.LastName + "</p>" +
                                                    "<p class = \"type\">Startup " + data2.Position + "</p>" +
                                                    "</div>" +
                                                    "<span class=\"badge\"></span>" +
                                                    "</div>"
                                                ).appendTo(".people1")


                                            }
                                            else {
                                                $("<div class = \"msg\">" +
                                                    "<input type=\"hidden\" id = " + data._id + " value = " + data2._id + ">" +
                                                    prf3 +
                                                    "<div class = \"nm\">" +
                                                    "<p class = \"nm1\">" + data2.FirstName + " " + data2.LastName + "</p>" +
                                                    "<p class = \"type\">Startup " + data2.Position + "</p>" +
                                                    "</div>" +
                                                    "</div>"
                                                ).appendTo(".people1")
                                            }

                                            if ($(window).width() <= 800) {
                                                $(".messages").hide();
                                                $(".people1").show();
                                            }

                                            //when user clicks the previous button
                                            $(".previous").click(function () {
                                                location.reload();
                                            })

                                            //when user clicks on the message
                                            $(".msg").click(function () {
                                                $(".msg").css("background-color", "white")
                                                $(this).css("background-color", "gainsboro")
                                                $(".message1").hide();
                                                $(".msg34").remove();
                                                $(".msg33").remove();
                                                $(".io33").remove();
                                                $("br").remove();
                                                $(".write2").show();

                                                //var to store the message id
                                                var mid = $(this)[0].children[0].id

                                                //var to store the entrepreneurs id
                                                var enid = $(this)[0].children[0].value
                                                //var to store the name
                                                var name = $(this)[0].children[2].children[0].innerHTML

                                                //var to store the type
                                                var type = $(this)[0].children[2].children[1].innerHTML

                                                //var to get the initials
                                                var int;
                                                var prf5;

                                                if ($(this)[0].children[1].innerHTML) {
                                                    int = $(this)[0].children[1].innerHTML
                                                    prf5 = "<div class = \"pr2\">" + int + "</div>"
                                                }
                                                else {
                                                    var br = $(this)[0].children[1].id;
                                                    prf5 = "<div class = \"pr2\" style = \"background-image:url(../profile/" + br + ")\"></div>"
                                                }

                                                $("<div class = \"io33\">" +
                                                    "<input type=\"hidden\" class = \"invid\"  id = " + data2._id + ">" +
                                                    "<input  type=\"hidden\" id = " + mid + ">" +
                                                    prf5 +
                                                    "<p class = \"nm33\">" + name + "</P>" +
                                                    "<p class = \"tp33\">" + type + "</p>" +
                                                    "</div>"
                                                ).appendTo(".header33")

                                                $(".io33").click(function () {
                                                    var enid3 = enid
                                                    var url = "/info/startup/" + enid3
                                                    window.open(url)
                                                })

                                                //loop through the messages
                                                for (var m = 0; m < res.data.length; m++) {

                                                    //find the clicked message
                                                    if (res.data[m]._id == mid) {

                                                        //loop through the messages
                                                        for (var p = 0; p < res.data[m].Message.length; p++) {

                                                            var data3 = res.data[m].Message[p];


                                                            //check to see of the txt is through the entrepreneur
                                                            if (data3.Act == "entrepreneur") {


                                                                if (data3.Link) {
                                                                    var data4 = data3.Link.split(",")

                                                                    if (data4.length > 1) {

                                                                        // var to store the link
                                                                        var links = []

                                                                        //loop through the links
                                                                        for (var i = 0; i < data4.length; i++) {

                                                                            var data5 = data4[i].split("/")

                                                                            links.push(
                                                                                "<a class = \"link4\" href=\"/preview/" + data5[0] + "\" target = \"_blank\">" + data5[1] + "</a>"
                                                                            )
                                                                        }

                                                                        links = links.join("")

                                                                        $(
                                                                            "<div class = \"msg33\">" +
                                                                            "<p class = \"time-date\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"nmm\">" + name + "</p>" +
                                                                            "<p class = \"msg331\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk\">" +
                                                                            "<p class = \"link2\">My Startup Links</p>" +
                                                                            "<div class = \"link3\">" +
                                                                            links +
                                                                            "</div>" +
                                                                            "</div>" +
                                                                            "</div>").appendTo(".message3")

                                                                        links = [];

                                                                    }
                                                                    else {
                                                                        var data5 = data4[0].split("/")
                                                                        $(
                                                                            "<div class = \"msg33\">" +
                                                                            "<p class = \"time-date\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"nmm\">" + name + "</p>" +
                                                                            "<p class = \"msg331\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk\">" +
                                                                            "<p class = \"link2\">My Startup Link</p>" +
                                                                            "<div class = \"link3\">" +
                                                                            "<a class = \"link4\" href=\"/preview/" + data5[0] + "\" target = \"_blank\">" + data5[1] + "</a>" +
                                                                            "</div>" +
                                                                            "</div>" +
                                                                            "</div>").appendTo(".message3")
                                                                    }

                                                                }
                                                                else {

                                                                    $(
                                                                        "<div class = \"msg33\">" +
                                                                        "<p class = \"time-date\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                        "<p class = \"nmm\">" + name + "</p>" +
                                                                        "<p class = \"msg331\">" + data3.Msg + "</p>" +
                                                                        "</div>").appendTo(".message3")
                                                                }
                                                            }
                                                            else {


                                                                if (data3.Link) {

                                                                    //var to store the product link
                                                                    var prlink = data3.Link.split("/")
                                                                    if (data3.Msg == "Withdrawn investment request") {
                                                                        $(
                                                                            "<div class = \"msg34\">" +
                                                                            "<p class = \"time-date2\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"msg332\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk9\">" +
                                                                            "<p class = \"link2\">Withdrawn Investment Request</p>" +
                                                                            "<div class = \"link3\">" +
                                                                            "<a class = \"link4\" href=\"/preview/" + prlink[0] + "\" target = \"_blank\">" + prlink[1] + "</a>" +
                                                                            "</div>" +
                                                                            "</div>" +
                                                                            "</div>").appendTo(".message3")
                                                                    }

                                                                    else {
                                                                        $(
                                                                            "<div class = \"msg34\">" +
                                                                            "<p class = \"time-date2\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"msg332\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk9\">" +
                                                                            "<p class = \"link2\">Requesting to invest in your startup</p>" +
                                                                            "<div class = \"link3\">" +
                                                                            "<a class = \"link4\" href=\"/preview/" + prlink[0] + "\" target = \"_blank\">" + prlink[1] + "</a>" +
                                                                            "</div>" +
                                                                            "</div>" +
                                                                            "</div>").appendTo(".message3")
                                                                    }
                                                                }
                                                                else {

                                                                    $(
                                                                        "<div class = \"msg34\">" +
                                                                        "<p class = \"time-date2\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                        "<p class = \"msg332\">" + data3.Msg + "</p>" +
                                                                        "</div>").appendTo(".message3")
                                                                }
                                                            }
                                                        }
                                                    }
                                                }

                                                //check the window size
                                                if ($(window).width() <= 800) {
                                                    $(".people").hide();
                                                    $(".messages").show();
                                                    $(".previous").show();
                                                }

                                                //scroll to the bottom of the message
                                                var d = $('.message2');
                                                d.scrollTop(d.prop("scrollHeight"));

                                                //route to say that entrepreneur has read the text
                                                $http.post("/investor/read", {
                                                    id: mid
                                                })
                                                    .then((res) => {
                                                    })
                                            })
                                        });
                                });
                        }(res.data[i]))

                    }

                }
            })

        //route to check for messages / notifications
        $http.post("investor/not", {
            id: user._id
        })
            .then((res) => {
                //check if reponse is not none
                if (res.data !== "none") {
                    $(window).on('resize', function (lazyLayout) {
                        var win = $(this); //this = window

                        if (win.width() <= 800) {

                            if ($('.message3').children().length > 0) {

                                $(".people1").hide()

                            }
                            else {
                                $(".messages").hide();
                                $(".people1").show();
                            }
                        }

                        if (win.width() >= 801) {
                            $(".messages").show();
                            $(".people1").show();
                        }
                    });
                    $(".cl").html("You have " + res.data + " unread message(s)")
                }
            })

        //post function to get the users profile picture
        $http.post("api/profile", {
            user: user.Email,
        })
            .then(function (response) {

                if (response.data) {

                    if (response.data !== "none") {
                        //remove the txt element inside the div
                        $('.logo2').contents().filter(function () {
                            return this.nodeType === 3;
                        }).remove();

                        //image file
                        document.querySelector(".logo2").style.backgroundImage = 'url(../profile/' + response.data + ')';
                    }
                }
            })
    };

}())