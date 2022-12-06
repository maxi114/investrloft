
(function () {
    const app = angular.module('app', ['ngRoute', 'angular-jwt']);

    //prevent user from login into restricted pages without a valid token
    app.run(function ($http, $rootScope, $window, $location, jwtHelper) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $window.localStorage.token;
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            if (nextRoute.access !== undefined && nextRoute.access.restricted === true && !window.localStorage.token) {
                event.preventDefault();
                $location.path('/login');
            }
            if ($window.localStorage.token && nextRoute.access.restricted === true) {
                $http.post('/api/verify', { token: $window.localStorage.token })
                    .then(function (response) {

                    }, function (err) {
                        delete $window.localStorage.token;
                        $location.path('/login');
                    })
            }


            //decode the token
            const token = $window.localStorage.token;
            const payload = jwtHelper.decodeToken(token).data;
            if (payload) {
                var user = payload
            }

            //check to see if the user is using the right account
            $http.post("/api/account", user)
                .then(function (response) {
                    const account = response.data.Account;
                    if (nextRoute.access.account) {
                        if (account !== nextRoute.access.account) {
                            $location.path('/login');
                        }
                    }
                })

        })
    });

    app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl: './home.html',
            controller: 'HomeController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/homent', {
            templateUrl: './homent.html',
            controller: 'HomentController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when("/howitworks", {
            templateUrl: './howitworks.html',
            access: {
                restricted: false
            }
        })

        $routeProvider.when('/login', {
            templateUrl: '../login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })

        $routeProvider.when('/company', {
            templateUrl: '../company.html',
            controller: 'companyController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })

        $routeProvider.when('/support', {
            templateUrl: '../support.html',
            controller: 'supportController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })

        $routeProvider.when('/partnership', {
            templateUrl: '../partnership.html',
            controller: 'partnershipController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })

        //startup rgt.html
        $routeProvider.when('/startuprgt', {
            templateUrl: '../startuprgt.html',
            controller: 'startuprgtController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        //investor registrtion
        $routeProvider.when('/investorgt', {
            templateUrl: '../investorgt.html',
            controller: 'InvestorController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/whoami', {
            templateUrl: '../whoami.html',
            controller: 'WhoamiController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })

        $routeProvider.when('/termsofservice', {
            templateUrl: '../termsofservice.html',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/vemail/:token', {
            templateUrl: '../vemail.html',
            controller: "VerifyController",
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/info/:token/:token', {
            templateUrl: '../info.html',
            controller: "InfoController",
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/profile', {
            templateUrl: '../profile.html',
            controller: 'ProfileController',
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        });

        $routeProvider.when('/email', {
            templateUrl: '../email.html',
            controller: 'EmailController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/reset/:token', {
            templateUrl: '../reset.html',
            controller: 'ResetController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/billing', {
            templateUrl: '../billing.html',
            controller: 'BillingController',
            controllerAs: "vm",
            access: {
                restricted: true
            }
        })

        $routeProvider.when('/homeinv', {
            templateUrl: '../homeinv.html',
            controller: 'HomeinvController',
            controllerAs: "vm",
            access: {
                restricted: false
            }
        })

        //resources controller
        $routeProvider.when('/resource', {
            templateUrl: '../resource2.html',
            controller: 'ResourceController',
            controllerAs: "vm",
            access: {
                restricted: false
            }
        })

    });


    //resource controller
    app.controller('ResourceController', ResourceController);

    function ResourceController($location, $scope, $window, $http, jwtHelper) {

        var vm = this

        //route to get the resources
        $http.post("admin/resource2", {
            Name: "this route is for getting all the resources"
        })
            .then((res) => {

                //variable to store the data received from the router
                var data = res.data

                for (var i = 0; i < data.logo[0].length; i++) {

                    var logo = data.logo[0][i]
                    var resource = data.resource[0][i]

                    var type = logo.contentType.split("/")
                    type = type[1];

                    var url = '../logo2/' + logo._id + "." + type;


                    console.log(url)

                    if (logo.metadata.Name == resource.Name) {
                        
                        $("<div class = \"resource\">" +
                        "<div class = \"profile\">" +
                        "<div class = \"loggo\" style=\"background-image: url("+url+");\">" +
                        "</div>" +
                        "</div>" +
                        "<div class = \"leftsection\">" +
                        "<h1 class = \"name\">" + resource.Name + "</h1>" +
                        "<a href = " + resource.Link + " target=\"_blank\" >Visit " + resource.Name + " here </a>" +
                        "<p class = \"description\">" + resource.Description + "</p>" +
                        "</div>" +
                        "</div>").appendTo(".resources")

                    }

                }

            })

    }

    //home controller
    app.controller('HomeController', HomeController);

    function HomeController($location, $scope, $window, $http, jwtHelper) {

        var vm = this

    }


    //home investor controller
    app.controller('HomeinvController', HomeinvController);

    function HomeinvController($location, $scope, $window, $http, jwtHelper) {

        var vm = this

        $("#spin3").hide();
        $("#spin4").hide();

        //when user clicks notify button
        $(".btn2").click(function () {

            //check to see if there is an email
            if (vm.notify == undefined) {
                $(".error1").html("please enter the email of the startup you would like to refer.")
                return
            }

            $(".error1").html("")

            $(".btn3").html("")
            $("#spin4").show()

            $http.post("/api/referstartup", vm.notify)
                .then((res) => {
                    $("#spin4").hide();
                    $(".btn2").html("Thankyou for your refer.")

                    setTimeout(() => {
                        $(".contact-form").hide();
                        location.href = "/homeinv"
                    }, 1500)
                })
        })

        //function to display investors on the home screen
        $http.post("api/homeInvestor", {
            data: "homeinvestor"
        })
            .then((res) => {

                return;
                //var to track number of pics on the left div
                var l = 0;

                //var to track number of of pics on the right div
                var r = 0;

                if (res.data.length !== 0) {

                    $(".s5b , .s5p").hide();
                    $(".invhld , .invhld1").show();
                    document.querySelector(".sct5").style.display = "flex"

                    //loop through the investor data
                    for (var i = 0; i < res.data.length; i++) {

                        var firstname = res.data[i].FirstName
                        var lastname = res.data[i].LastName
                        var city = res.data[i].City
                        var state = res.data[i].State
                        var bio = res.data[i].Bio
                        var email = res.data[i].Email

                        /*display the first investor*/
                        if (i == 0) {
                            $("<div class = \"inv\">" +
                                "<div class = \"invprf\" id = " + email + ">" +
                                "</div>" +
                                "<div class = \"bio\">" +
                                "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                "<p class = \"location\">" + city + ", " + state + "</p>" +
                                "<p class = \"bio1\">" + bio + "</p>" +
                                "</div>" +
                                "</div>"
                            ).prependTo(".sct2")
                        }
                        else {
                            l += 1

                            if (l <= 3 && r == 0) {
                                $("<div class =\"div" + i + " prf1\" id=" + email + "></div>").appendTo(".sct1")
                            }
                            else {
                                if (l <= 6) {
                                    $("<div class =\"div" + i + " prf1\" id=" + email + "></div>").appendTo(".sct3")
                                }
                            }
                        }

                        /*get the picture*/
                        $http.post("/api/profile", {
                            user: res.data[i].Email
                        })
                            .then((res1) => {
                                var em = res1.config.data.user

                                /*check if picture matches the first investor*/
                                if ($(".invprf")[0].id == em) {
                                    //image file
                                    document.querySelector(".invprf").style.backgroundImage = 'url(../profile/' + res1.data + ')';
                                }
                                else {

                                    //loop the investor profile pics
                                    for (var p = 0; p < $(".prf1").length; p++) {

                                        var div = $(".prf1")[p]
                                        if (div.id == em) {

                                            $(div).css('background-image', 'url(../profile/' + res1.data + ')');

                                        }

                                    }
                                }

                            })
                    }

                    var la = 0;
                    //when user clicks the left arrow
                    $(".left").click(function () {

                        var clas = $(".sct1")[0].children[la].id
                        clas = clas.split(' ')
                        clas = clas[0]

                        var email = $(".sct1")[0].children[la].id

                        //big investr email
                        var email2 = $(".invprf")[0].id

                        //get the profile of the main investor
                        var prf = $(".invprf")[0].style.backgroundImage
                        prf = prf.split("url")
                        prf = prf[1]
                        prf = prf.split("(")
                        prf = prf[1]
                        prf = prf.split(")")
                        prf = prf[0]
                        prf = prf.split("/")
                        prf = prf[2]
                        prf = prf.split('"')
                        prf = prf[0]

                        //get the profile of the small investor
                        var prf2 = $(".sct1")[0].children[la].style.backgroundImage
                        prf2 = prf2.split("url")
                        prf2 = prf2[1]
                        prf2 = prf2.split("(")
                        prf2 = prf2[1]
                        prf2 = prf2.split(")")
                        prf2 = prf2[0]
                        prf2 = prf2.split("/")
                        prf2 = prf2[2]
                        prf2 = prf2.split('"')
                        prf2 = prf2[0]


                        //get the div and remove
                        $(".sct1")[0].children[la].remove()

                        //get the number
                        var n = clas.slice(-1)
                        //append the new div
                        $("<div class =\"div" + n + " prf1\" id=" + email2 + " style=\"background-image: url(../profile/" + prf + ");\"></div>").prependTo(".sct1")

                        //loop to change classes of small div
                        var div1 = $(".sct1")[0].children

                        for (var c = 0; c < div1.length; c++) {

                            var clas2 = div1[c].className
                            if (c == 0) {

                                $(div1[c]).removeClass(clas2).addClass("div1 prf1")
                            }

                            if (c == 1) {
                                $(div1[c]).removeClass(clas2).addClass("div2 prf1")
                            }

                            if (c == 2) {
                                $(div1[c]).removeClass(clas2).addClass("div3 prf1")
                            }
                        }

                        $(".inv").remove();

                        //loop through the data
                        for (var t = 0; t < res.data.length; t++) {

                            if (res.data[t].Email == email) {

                                var firstname = res.data[t].FirstName
                                var lastname = res.data[t].LastName
                                var city = res.data[t].City
                                var state = res.data[t].State
                                var bio = res.data[t].Bio
                                var email = res.data[t].Email

                                $("<div class = \"inv\">" +
                                    "<div class = \"invprf\" id = " + email + " style=\"background-image: url(../profile/" + prf2 + ");\">" +
                                    "</div>" +
                                    "<div class = \"bio\">" +
                                    "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                    "<p class = \"location\">" + city + ", " + state + "</p>" +
                                    "<p class = \"bio1\">" + bio + "</p>" +
                                    "</div>" +
                                    "</div>"
                                ).prependTo(".sct2")
                            }
                        }

                        la += 1
                        if (la == 3) {
                            la = 0
                        }

                    })

                    //when user clicks the right arrow
                    $(".right").click(function () {

                        var clas = $(".sct3")[0].children[r].className
                        clas = clas.split(' ')
                        clas = clas[0]

                        var email = $(".sct3")[0].children[r].id

                        //big investr email
                        var email2 = $(".invprf")[0].id

                        //get the profile of the main investor
                        var prf = $(".invprf")[0].style.backgroundImage
                        prf = prf.split("url")
                        prf = prf[1]
                        prf = prf.split("(")
                        prf = prf[1]
                        prf = prf.split(")")
                        prf = prf[0]
                        prf = prf.split("/")
                        prf = prf[2]
                        prf = prf.split('"')
                        prf = prf[0]

                        //get the profile of the small investor
                        var prf2 = $(".sct3")[0].children[r].style.backgroundImage
                        prf2 = prf2.split("url")
                        prf2 = prf2[1]
                        prf2 = prf2.split("(")
                        prf2 = prf2[1]
                        prf2 = prf2.split(")")
                        prf2 = prf2[0]
                        prf2 = prf2.split("/")
                        prf2 = prf2[2]
                        prf2 = prf2.split('"')
                        prf2 = prf2[0]


                        //get the div and remove
                        $(".sct3")[0].children[r].remove()

                        //get the number
                        var n = clas.slice(-1)
                        //append the new div
                        $("<div class =\"div" + n + " prf1\" id=" + email2 + " style=\"background-image: url(../profile/" + prf + ");\"></div>").prependTo(".sct3")

                        //loop to change classes of small div
                        var div1 = $(".sct3")[0].children

                        for (var c = 0; c < div1.length; c++) {

                            var clas2 = div1[c].className
                            if (c == 0) {

                                $(div1[c]).removeClass(clas2).addClass("div4 prf1")
                            }

                            if (c == 1) {
                                $(div1[c]).removeClass(clas2).addClass("div5 prf1")
                            }

                            if (c == 2) {
                                $(div1[c]).removeClass(clas2).addClass("div6 prf1")
                            }
                        }

                        $(".inv").remove();

                        //loop through the data
                        for (var t = 0; t < res.data.length; t++) {

                            if (res.data[t].Email == email) {

                                var firstname = res.data[t].FirstName
                                var lastname = res.data[t].LastName
                                var city = res.data[t].City
                                var state = res.data[t].State
                                var bio = res.data[t].Bio
                                var email = res.data[t].Email

                                $("<div class = \"inv\">" +
                                    "<div class = \"invprf\" id = " + email + " style=\"background-image: url(../profile/" + prf2 + ");\">" +
                                    "</div>" +
                                    "<div class = \"bio\">" +
                                    "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                    "<p class = \"location\">" + city + ", " + state + "</p>" +
                                    "<p class = \"bio1\">" + bio + "</p>" +
                                    "</div>" +
                                    "</div>"
                                ).prependTo(".sct2")
                            }
                        }

                        r += 1
                        if (r == 3) {
                            r = 0
                        }


                    })
                }

            })

        //when user clicks send button on the contact
        $(".btn").click(function () {

            //check to see if the information is all enterd
            if (!vm.contact) {
                $(".error").html("Please fill out the information above.")
                return
            }

            if (!vm.contact.name) {
                $(".error").html("What is your name?")
                return
            }

            if (!vm.contact.email) {
                $(".error").html("Enter your email above, its a way of getting back to you")
                return
            }

            if (!vm.contact.message) {
                $(".error").html("Type your message above (how can we help you)")
                return
            }

            $(".error").html("")
            $(".btn1").hide()
            document.getElementById("spin3").style.display = "block"


            $http.post("/api/contactus", vm.contact)
                .then((res) => {

                    if (res.data == "sent") {
                        $("#spin3").hide();
                        $(".btn").html("Message sent")

                        setTimeout(() => {
                            $(".contact-form").hide();
                            location.href = "/homeinv"
                        }, 1000)

                    }

                    else {
                        $(".error").html("An error occured, try again shortly!")

                        setTimeout(() => {
                            $(".contact-form").hide();
                            location.href = "/homeinv"
                        }, 3000)
                    }


                })
        })
    }

    //company controller
    app.controller('companyController', companyController);

    function companyController($location, $scope, $window, $http, jwtHelper) {
        var vm = this

        $("#spin3").hide();
        $("#spin4").hide();

        //function to display investors on the home screen
        $http.post("api/homeInvestor", {
            data: "homeinvestor"
        })
            .then((res) => {

                //var to track number of pics on the left div
                var l = 0;

                //var to track number of of pics on the right div
                var r = 0;

                if (res.data.length !== 0) {

                    $(".s5b , .s5p").hide();
                    $(".invhld , .invhld1").show();
                    document.querySelector(".sct5").style.display = "flex"

                    //loop through the investor data
                    for (var i = 0; i < res.data.length; i++) {

                        var firstname = res.data[i].FirstName
                        var lastname = res.data[i].LastName
                        var city = res.data[i].City
                        var state = res.data[i].State
                        var bio = res.data[i].Bio
                        var email = res.data[i].Email

                        /*display the first investor*/
                        if (i == 0) {
                            $("<div class = \"inv\">" +
                                "<div class = \"invprf\" id = " + email + ">" +
                                "</div>" +
                                "<div class = \"bio\">" +
                                "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                "<p class = \"location\">" + city + ", " + state + "</p>" +
                                "<p class = \"bio1\">" + bio + "</p>" +
                                "</div>" +
                                "</div>"
                            ).prependTo(".sct2")
                        }
                        else {
                            l += 1

                            if (l <= 3 && r == 0) {
                                $("<div class =\"div" + i + " prf1\" id=" + email + "></div>").appendTo(".sct1")
                            }
                            else {
                                if (l <= 6) {
                                    $("<div class =\"div" + i + " prf1\" id=" + email + "></div>").appendTo(".sct3")
                                }
                            }
                        }

                        /*get the picture*/
                        $http.post("/api/profile", {
                            user: res.data[i].Email
                        })
                            .then((res1) => {
                                var em = res1.config.data.user

                                /*check if picture matches the first investor*/
                                if ($(".invprf")[0].id == em) {
                                    //image file
                                    document.querySelector(".invprf").style.backgroundImage = 'url(../profile/' + res1.data + ')';
                                }
                                else {

                                    //loop the investor profile pics
                                    for (var p = 0; p < $(".prf1").length; p++) {

                                        var div = $(".prf1")[p]
                                        if (div.id == em) {

                                            $(div).css('background-image', 'url(../profile/' + res1.data + ')');

                                        }

                                    }
                                }

                            })
                    }

                    var la = 0;
                    //when user clicks the left arrow
                    $(".left").click(function () {

                        var clas = $(".sct1")[0].children[la].id
                        clas = clas.split(' ')
                        clas = clas[0]

                        var email = $(".sct1")[0].children[la].id

                        //big investr email
                        var email2 = $(".invprf")[0].id

                        //get the profile of the main investor
                        var prf = $(".invprf")[0].style.backgroundImage
                        prf = prf.split("url")
                        prf = prf[1]
                        prf = prf.split("(")
                        prf = prf[1]
                        prf = prf.split(")")
                        prf = prf[0]
                        prf = prf.split("/")
                        prf = prf[2]
                        prf = prf.split('"')
                        prf = prf[0]

                        //get the profile of the small investor
                        var prf2 = $(".sct1")[0].children[la].style.backgroundImage
                        prf2 = prf2.split("url")
                        prf2 = prf2[1]
                        prf2 = prf2.split("(")
                        prf2 = prf2[1]
                        prf2 = prf2.split(")")
                        prf2 = prf2[0]
                        prf2 = prf2.split("/")
                        prf2 = prf2[2]
                        prf2 = prf2.split('"')
                        prf2 = prf2[0]


                        //get the div and remove
                        $(".sct1")[0].children[la].remove()

                        //get the number
                        var n = clas.slice(-1)
                        //append the new div
                        $("<div class =\"div" + n + " prf1\" id=" + email2 + " style=\"background-image: url(../profile/" + prf + ");\"></div>").prependTo(".sct1")

                        //loop to change classes of small div
                        var div1 = $(".sct1")[0].children

                        for (var c = 0; c < div1.length; c++) {

                            var clas2 = div1[c].className
                            if (c == 0) {

                                $(div1[c]).removeClass(clas2).addClass("div1 prf1")
                            }

                            if (c == 1) {
                                $(div1[c]).removeClass(clas2).addClass("div2 prf1")
                            }

                            if (c == 2) {
                                $(div1[c]).removeClass(clas2).addClass("div3 prf1")
                            }
                        }

                        $(".inv").remove();

                        //loop through the data
                        for (var t = 0; t < res.data.length; t++) {

                            if (res.data[t].Email == email) {

                                var firstname = res.data[t].FirstName
                                var lastname = res.data[t].LastName
                                var city = res.data[t].City
                                var state = res.data[t].State
                                var bio = res.data[t].Bio
                                var email = res.data[t].Email

                                $("<div class = \"inv\">" +
                                    "<div class = \"invprf\" id = " + email + " style=\"background-image: url(../profile/" + prf2 + ");\">" +
                                    "</div>" +
                                    "<div class = \"bio\">" +
                                    "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                    "<p class = \"location\">" + city + ", " + state + "</p>" +
                                    "<p class = \"bio1\">" + bio + "</p>" +
                                    "</div>" +
                                    "</div>"
                                ).prependTo(".sct2")
                            }
                        }

                        la += 1
                        if (la == 3) {
                            la = 0
                        }

                    })

                    //when user clicks the right arrow
                    $(".right").click(function () {

                        var clas = $(".sct3")[0].children[r].className
                        clas = clas.split(' ')
                        clas = clas[0]

                        var email = $(".sct3")[0].children[r].id

                        //big investr email
                        var email2 = $(".invprf")[0].id

                        //get the profile of the main investor
                        var prf = $(".invprf")[0].style.backgroundImage
                        prf = prf.split("url")
                        prf = prf[1]
                        prf = prf.split("(")
                        prf = prf[1]
                        prf = prf.split(")")
                        prf = prf[0]
                        prf = prf.split("/")
                        prf = prf[2]
                        prf = prf.split('"')
                        prf = prf[0]

                        //get the profile of the small investor
                        var prf2 = $(".sct3")[0].children[r].style.backgroundImage
                        prf2 = prf2.split("url")
                        prf2 = prf2[1]
                        prf2 = prf2.split("(")
                        prf2 = prf2[1]
                        prf2 = prf2.split(")")
                        prf2 = prf2[0]
                        prf2 = prf2.split("/")
                        prf2 = prf2[2]
                        prf2 = prf2.split('"')
                        prf2 = prf2[0]


                        //get the div and remove
                        $(".sct3")[0].children[r].remove()

                        //get the number
                        var n = clas.slice(-1)
                        //append the new div
                        $("<div class =\"div" + n + " prf1\" id=" + email2 + " style=\"background-image: url(../profile/" + prf + ");\"></div>").prependTo(".sct3")

                        //loop to change classes of small div
                        var div1 = $(".sct3")[0].children

                        for (var c = 0; c < div1.length; c++) {

                            var clas2 = div1[c].className
                            if (c == 0) {

                                $(div1[c]).removeClass(clas2).addClass("div4 prf1")
                            }

                            if (c == 1) {
                                $(div1[c]).removeClass(clas2).addClass("div5 prf1")
                            }

                            if (c == 2) {
                                $(div1[c]).removeClass(clas2).addClass("div6 prf1")
                            }
                        }

                        $(".inv").remove();

                        //loop through the data
                        for (var t = 0; t < res.data.length; t++) {

                            if (res.data[t].Email == email) {

                                var firstname = res.data[t].FirstName
                                var lastname = res.data[t].LastName
                                var city = res.data[t].City
                                var state = res.data[t].State
                                var bio = res.data[t].Bio
                                var email = res.data[t].Email

                                $("<div class = \"inv\">" +
                                    "<div class = \"invprf\" id = " + email + " style=\"background-image: url(../profile/" + prf2 + ");\">" +
                                    "</div>" +
                                    "<div class = \"bio\">" +
                                    "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                    "<p class = \"location\">" + city + ", " + state + "</p>" +
                                    "<p class = \"bio1\">" + bio + "</p>" +
                                    "</div>" +
                                    "</div>"
                                ).prependTo(".sct2")
                            }
                        }

                        r += 1
                        if (r == 3) {
                            r = 0
                        }


                    })
                }

            })

        //when user clicks send button on the contact
        $(".btn").click(function () {

            //check to see if the information is all enterd
            if (!vm.contact) {
                $(".error").html("Please fill out the information above.")
                return
            }

            if (!vm.contact.name) {
                $(".error").html("What is your name?")
                return
            }

            if (!vm.contact.email) {
                $(".error").html("Enter your email above, its a way of getting back to you")
                return
            }

            if (!vm.contact.message) {
                $(".error").html("Type your message above (how can we help you)")
                return
            }

            $(".error").html("")
            $(".btn1").hide()
            document.getElementById("spin3").style.display = "block"


            $http.post("/api/contactus", vm.contact)
                .then((res) => {

                    if (res.data == "sent") {
                        $("#spin3").hide();
                        $(".btn").html("Message sent")

                        setTimeout(() => {
                            $(".contact-form").hide();
                            location.href = "/company"
                        }, 1000)

                    }

                    else {
                        $(".error").html("An error occured, try again shortly!")

                        setTimeout(() => {
                            $(".contact-form").hide();
                            location.href = "/company"
                        }, 3000)
                    }


                })
        })
    }

    //support controller
    app.controller('supportController', supportController);

    function supportController($location, $scope, $window, $http, jwtHelper) {
        var vm = this
    }

    //partnership controller
    app.controller('partnershipController', partnershipController);

    function partnershipController($location, $scope, $window, $http, jwtHelper) {
        var vm = this
    }

    //info controller
    app.controller('InfoController', InfoController);

    function InfoController($location, $scope, $window, $http, jwtHelper) {
        var vm = this

        //store the url path
        var url = window.location.pathname

        //split the url path
        var url2 = url.split("/")

        //store the account type
        var account = url2[2]

        //store the user id as stored in the database
        var id = url2[3]


        $http.post("/api/info", {
            account: account,
            id: id
        })
            .then((res) => {

                vm.bio = res.data[0].Bio

                var fname = res.data[0].FirstName
                var lname = res.data[0].LastName

                vm.name = fname + " " + lname

                var city = res.data[0].City;
                var state = res.data[0].State;

                vm.location = city + " " + state

                $(".pc").html(fname[0] + " " + lname[0])

                //var to store the offer
                var offer;
                var myFiles = [];

                //if account is investor
                if (account == "investor") {

                    vm.type = "investor";


                    if (res.data[0].Industry.length > 0) {

                        //loop through the industries
                        for (var i = 0; i < res.data[0].Industry.length; i++) {

                            //check to see if there are subtitles
                            if (res.data[0].Industry[i].subtitle.length > 0) {

                                $("<p class = \"indus1\">" + res.data[0].Industry[i].title + " : " + res.data[0].Industry[i].subtitle + "</p>").appendTo(".indus")

                            }
                            else {
                                $("<p class = \"indus1\">" + res.data[0].Industry[i].title + " </p>").appendTo(".indus")
                            }
                        }
                    }

                    //change money from number to string
                    var money = res.data[0].Budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    $("<p class = \"rating2 \">Budget: " +
                        "<label class = \"bdgt\" >$" + money + "</label>" +
                        "</p>").appendTo(".indus")

                    //check if the investor has any requested startups
                    if (res.data[1].length > 0) {

                        vm.startup = "Requested startups"
                        run();

                    }

                }

                //if account is entrepreneur
                else {

                    $(".indus").hide();
                    if (res.data[1]) {
                        vm.type = "Startup " + res.data[0].Position;
                        vm.startup = "Listed startups"
                        run();
                    }
                }

                function run() {

                    if (res.data[1].length > 0) {

                        //loop through the startups
                        for (var d = 0; d < res.data[1].length; d++) {


                            if (res.data[1][d].Startup_Percent_Offer) {
                                //change money from number to string
                                var money = res.data[1][d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                offer = "<p class = \"offer offer2\">Investment: USD " + money + " for " + res.data[1][d].Startup_Percent_Offer + " </p>"

                            }

                            if (!res.data[1][d].Startup_Percent_Offer) {
                                //change money from number to string
                                var money = res.data[1][d].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                offer = "<p class = \"offer offer2\">Investment: USD " + money + " </p>"

                            }
                            myFiles.push(
                                "<input type=\"hidden\" class = \"idem\" id=" + res.data[1][d]._id + " value = " + res.data[1][d].Entrepreneur_Email + ">" +
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
                                "<h2 class=\"name2 blm\">" + res.data[1][d].Startup_Name + "</h2>" +
                                "<p class=\"description blm\">" + res.data[1][d].Startup_Description + "</p>" +
                                "<div class = \"of\">" +
                                offer +
                                "</div>" +
                                "<div class = \"svr\">" +
                                "<div class = \"lc\">" +
                                "<i class=\"fa fa-map-marker\" id=\"location2\"> " + res.data[1][d].Startup_Location.City + " " + res.data[1][d].Startup_Location.State + "</i>" +
                                "</div>" +
                                "</div>"
                            );
                            myFiles = myFiles.join("");
                            $("<div class = \"test\">" + myFiles + "</div>").appendTo(".products");
                            myFiles = [];
                        }

                        //if account is investor
                        if (account == "startup") {
                            $('.blm').css('cursor', 'pointer');

                            $(".blm").click(function () {

                                var id = $(this).parents("div")[0].children[0].id

                                location.href = "/preview/" + id
                            })
                        }
                        //loop through the products
                        for (var i = 0; i < res.data[1].length; i++) {


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


                            }(res.data[1][i]));

                        }
                    }
                }

                $http.post("api/profile", {
                    user: res.data[0].Email,
                })
                    .then(function (response) {

                        if (response.data) {

                            if (response.data !== "none") {
                                //remove the txt element inside the div
                                $('.logo2').contents().filter(function () {
                                    return this.nodeType === 3;
                                }).remove();

                                //image file
                                $(".pc").html("")
                                document.querySelector(".pc").style.backgroundImage = 'url(../profile/' + response.data + ')';
                            }
                        }
                    })
            })

    };


    //billing controller
    app.controller('BillingController', BillingController);

    function BillingController($location, $window, $http, jwtHelper) {

        var vm = this;

        delete $window.localStorage.latestInvoiceId;
        delete $window.localStorage.latestInvoicePaymentIntentStatus;

        //decode the token to check the type of account the user is using
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload;
        }

        var stripe = Stripe('pk_test_51Hr6PtEz3Znw2QHsFNSvMLTGZncIpB2LCoKrYBk7FUxZPzTeFiShWdWFI8fqcit5IHMcA6OwAiWGix3W23r1M8Ur00cInFexvw');
        var elements = stripe.elements();
        /*------------------*/
        $(".subscribe").hide();
        $(".payment_methods").hide();
        $(".billing_history").hide();

        //document.querySelector(".oops").style.display = "block"

        if (user.Account == "investor" || user.Subscription == "free") {
            $(".subscribe").hide();
            $(".payment_methods").hide();
            $(".billing_history").hide();
            document.querySelector(".oops").style.display = "block"
            return;
        }

        if (user.Subscription == "active" || user.Subscription == "past_due") {
            $(".payment_methods").hide();
            $(".billing_history").hide();
            $http.post("api/customerPortal", {
                customerId: user.stripeCustomerId
            })
                .then((res) => {
                    location.href = res.data.url
                })
            return;
        }

        //when user clicks update card
        $(".Updatecard").click(function () {

            $(".payment_methods").hide();
            $(".subscribe").show();
            $(".plan").hide();
            $(".sub1").html("Payment Method")
            $(".pp1").html("Enter preferred credit / debit card.")
            $(".ppp2").html("All major credit / debit cards accepted.")
            $(".pp3").html("your card will be charged monhly (every 30 days)")
            $(".subb2").html("Update")
        })

        //when user clicks cancel subscription
        $(".cancel").click(function () {
            document.querySelector(".popsub").style.display = "flex"
        })

        //when user clicks no on the cancel subscription
        $(".noo2").click(function () {
            $(".popsub").hide();
        })

        //when user clicks yes on the cancel subscription
        $(".yess2").click(function () {
            $(".loader").show();
            $(".poppp2").hide();
            $(".poppp").hide();
            $(".yess2").hide();
            $(".noo2").hide();

            return fetch('api/cancel-subscription', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: user.subscriptionId,
                    email: user.Email
                }),
            })
                .then(response => {
                    return response.json();
                })
                .then(cancelSubscriptionResponse => {
                    // Display to the user that the subscription has been cancelled.
                    $(".loader").hide();
                    $(".poppp").show();
                    $(".poppp").html("Your subscription will be canceled once this billing period is over. You are going to be logged out for changes to take effect.")

                    setTimeout(function () {
                        delete $window.localStorage.token
                        delete $window.localStorage.latestInvoiceId;
                        delete $window.localStorage.latestInvoicePaymentIntentStatus;
                        location.href = '/login'
                    }, 5000);
                });

        })

        //if user subscription is scheduled for cancelation
        if (user.canceling == true) {
            $("#cancel").remove();
            $(
                "<p class = \"activate\" id = \"cancel\" >Reactivate Subscription</p>").appendTo(".payment_methods2")

            $(".description4").html("Cancels on")
            document.querySelector(".description4").style.color = "orange";
            document.querySelector(".activate").style.color = "#2f2fa2"

            //when user clicks reactivate subscription
            $(".activate").click(function () {
                document.querySelector(".popsub").style.display = "flex"
                $(".loader").show();
                $(".poppp2").hide();
                $(".poppp").hide();
                $(".yess2").hide();
                $(".noo2").hide();

                $http.post("/api/reactive-subscription", {
                    email: user.Email,
                    subscriptionId: user.subscriptionId
                })
                    .then((res) => {
                        // Display to the user that the subscription has been cancelled.
                        $(".loader").hide();
                        $(".poppp").show();
                        $(".poppp").html("Your subscription has been reactivated. You are going to be logged out for changes to take effect.")

                        setTimeout(function () {
                            delete $window.localStorage.token
                            delete $window.localStorage.latestInvoiceId;
                            delete $window.localStorage.latestInvoicePaymentIntentStatus;
                            location.href = '/login'
                        }, 4000);
                    })
            })

        }
        //check the users subscription
        if (user.Subscription == "inactive") {

            document.querySelector(".subscribe").style.display = "block"
            $(".payment_methods").hide();
            $(".billing_history").hide();
        }

        else {

            //code to get the charges
            $http.post("/api/payments", {
                customerId: user.stripeCustomerId
            })
                .then((res) => {

                    //loop through the invoices
                    for (var i = 0; i < res.data.data.length; i++) {

                        var timestamp = res.data.data[i].created

                        function timeConverter(UNIX_timestamp) {
                            var a = new Date(UNIX_timestamp * 1000);
                            var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                            var year = a.getFullYear();
                            var month = months[a.getMonth()];
                            var date = a.getDate();
                            /*var hour = a.getHours();
                            var min = a.getMinutes();
                            var sec = a.getSeconds();*/
                            var time = month + '/' + date + '/' + year;
                            return time;
                        }

                        var amount = res.data.data[i].amount_due / 100;
                        var date = timeConverter(timestamp)
                        var status = res.data.data[i].status;

                        function capitalizeFirstLetter(string) {
                            return string.charAt(0).toUpperCase() + string.slice(1);
                        }

                        var status2 = capitalizeFirstLetter(status);

                        $("<tr>" +
                            "<td class = \"jki2\">" + date + "</td>" +
                            "<td class = \"jki2\" >" + amount + "</td>" +
                            "<td class = \"jki2\">" + status2 + "</td>" +
                            "</tr>"
                        ).appendTo(".tbody")
                    }
                })


            //code to retrieve subscriptions ending period
            $http.post("/api/retrieve-subscription", {
                subscriptionId: user.subscriptionId
            })
                .then((res) => {

                    var timestamp = res.data.current_period_end

                    function timeConverter(UNIX_timestamp) {
                        var a = new Date(UNIX_timestamp * 1000);
                        var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        /*var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();*/
                        var time = month + '/' + date + '/' + year;
                        return time;
                    }
                    vm.date = timeConverter(timestamp)
                })


            $http.post("/api/retrievecard", {
                email: user.Email
            })
                .then((res) => {
                    $(".subscribe").hide();
                    $(".payment_methods").show();


                    //send the card details to the user
                    //get tha card brand
                    vm.cardbrand = res.data.card.brand;

                    //get the last 4 digits of the customer card
                    vm.last4 = res.data.card.last4;

                    //get the cards expiry month
                    vm.exp_month = res.data.card.exp_month;

                    //get the card expiry year
                    vm.exp_year = res.data.card.exp_year;
                })
        }
        // Set up Stripe.js and Elements to use in checkout form
        var style = {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        };

        var clicked = false
        var cardElement = elements.create("card", { style: style });
        cardElement.mount("#card-element");

        cardElement.on('change', showCardError);

        let displayError = document.getElementById('card-errors');

        function showCardError(event) {

            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
                clicked = true
            }
        }



        //when user clicks subscribe
        $(".subb2").click(function () {

            if ($('#card-errors').html() !== "") {
                return;
            }
            if (clicked == false) {
                return;
            }

            $(".subb2").hide();
            document.querySelector(".spin").style.display = "inline-block"

            // get stripe customer id
            $http.post("/api/cusid", {
                email: user.Email
            })
                .then((res) => {

                    var customer = res.data

                    // If a previous payment was attempted, get the latest invoice
                    const latestInvoicePaymentIntentStatus = localStorage.getItem(
                        'latestInvoicePaymentIntentStatus'
                    );

                    if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
                        const invoiceId = localStorage.getItem('latestInvoiceId');
                        const isPaymentRetry = true;

                        // create new payment method & retry payment on invoice with new payment method
                        createPaymentMethod({
                            card: cardElement,
                            isPaymentRetry: isPaymentRetry,
                            invoiceId: invoiceId,
                        });
                    } else {
                        // create new payment method & create subscription
                        createPaymentMethod({ card: cardElement });
                    }

                    function createPaymentMethod({ card, isPaymentRetry, invoiceId }) {
                        // Set up payment method for recurring usage
                        let billingName = user.FirstName + " " + user.LastName
                        stripe.createPaymentMethod({
                            type: 'card',
                            card: card,
                            billing_details: {
                                name: billingName,
                                email: user.Email
                            },
                        })
                            .then((result) => {

                                if (result.error) {
                                    $(".subb2").show();
                                    $(".spin").hide();
                                    showCardError(result);

                                } else {

                                    if (isPaymentRetry) {
                                        // Update the payment method and retry invoice payment
                                        retryInvoiceWithNewPaymentMethod({
                                            customerId: customer,
                                            paymentMethodId: result.paymentMethod.id,
                                            invoiceId: invoiceId,
                                            priceId: "price_1JRoALEz3Znw2QHsdaSHMAJK",
                                        });
                                    } else {
                                        // Create the subscription
                                        createSubscription({
                                            customerId: customer,
                                            paymentMethodId: result.paymentMethod.id,
                                            priceId: "price_1JRoALEz3Znw2QHsdaSHMAJK",
                                        });
                                    }
                                }
                            });
                    }

                    function retryInvoiceWithNewPaymentMethod({
                        customerId,
                        paymentMethodId,
                        invoiceId,
                        priceId
                    }) {
                        return (
                            fetch('api/retry-invoice', {
                                method: 'post',
                                headers: {
                                    'Content-type': 'application/json',
                                },
                                body: JSON.stringify({
                                    customerId: customerId,
                                    paymentMethodId: paymentMethodId,
                                    invoiceId: invoiceId,
                                }),
                            })
                                .then((response) => {
                                    return response.json();
                                })
                                // If the card is declined, display an error to the user.
                                .then((result) => {
                                    if (result.error) {
                                        // The card had an error when trying to attach it to a customer.
                                        throw result;
                                    }
                                    return result;
                                })
                                // Normalize the result to contain the object returned by Stripe.
                                // Add the additional details we need.
                                .then((result) => {
                                    return {
                                        // Use the Stripe 'object' property on the
                                        // returned result to understand what object is returned.
                                        invoice: result,
                                        paymentMethodId: paymentMethodId,
                                        priceId: priceId,
                                        isRetry: true,
                                    };
                                })
                                // Some payment methods require a customer to be on session
                                // to complete the payment process. Check the status of the
                                // payment intent to handle these actions.
                                .then(handlePaymentThatRequiresCustomerAction)
                                // No more actions required. Provision your service for the user.
                                .then(onSubscriptionComplete)
                                .catch((error) => {
                                    // An error has happened. Display the failure to the user here.
                                    // We utilize the HTML element we created.
                                    $(".subb2").show();
                                    $(".spin").hide();
                                    console.log(error);
                                    displayError.textContent = "An error has occured. Please try again later."
                                })
                        );
                    }



                    function createSubscription({ customerId, paymentMethodId, priceId }) {
                        return (
                            fetch('api/create-subscription', {
                                method: 'post',
                                headers: {
                                    'Content-type': 'application/json',
                                },
                                body: JSON.stringify({
                                    customerId: customerId,
                                    paymentMethodId: paymentMethodId,
                                    priceId: priceId,
                                    subscription2: user.Subscription,
                                    email: user.Email
                                }),
                            })
                                .then((response) => {
                                    return response.json();
                                })
                                // If the card is declined, display an error to the user.
                                .then((result) => {
                                    if (result.error) {
                                        // The card had an error when trying to attach it to a customer.
                                        throw result;
                                    }
                                    return result;
                                })
                                // Normalize the result to contain the object returned by Stripe.
                                // Add the additional details we need.
                                .then((result) => {

                                    return {
                                        paymentMethodId: paymentMethodId,
                                        priceId: priceId,
                                        subscription: result,
                                    };

                                })
                                // Some payment methods require a customer to be on session
                                // to complete the payment process. Check the status of the
                                // payment intent to handle these actions.
                                .then(handlePaymentThatRequiresCustomerAction)
                                // If attaching this card to a Customer object succeeds,
                                // but attempts to charge the customer fail, you
                                // get a requires_payment_method error.
                                .then(handleRequiresPaymentMethod)
                                // No more actions required. Provision your service for the user.
                                .then(onSubscriptionComplete)
                                .catch((error) => {

                                    if (error == "SyntaxError: Unexpected token d in JSON at position 0") {
                                        $(".subb2").show();
                                        $(".spin").hide();

                                        document.querySelector(".pop-up").style.display = "flex";
                                        $('.popp').html("Your payment method has been updated.")

                                        setTimeout(function () {
                                            delete $window.localStorage.latestInvoiceId;
                                            delete $window.localStorage.latestInvoicePaymentIntentStatus;
                                            location.reload()
                                        }, 4000);

                                        return;
                                    }

                                    else {
                                        // An error has happened. Display the failure to the user here.
                                        // We utilize the HTML element we created.

                                        $(".subb2").show();
                                        $(".spin").hide();
                                        displayError.textContent = error.error.message
                                    }
                                })

                        );
                    }
                    function onSubscriptionComplete(result) {
                        // Payment was successful.
                        if (result.subscription.status === 'active') {
                            // Change your UI to show a success message to your customer.
                            // Call your backend to grant access to your service based on
                            // `result.subscription.items.data[0].price.product` the customer subscribed to.
                            $http.post("/api/subcomplete", {
                                email: user.Email,
                            })
                                .then((res) => {
                                    $(".subb2").show();
                                    $(".spin").hide();

                                    document.querySelector(".pop-up").style.display = "flex";
                                    vm.message = "Thankyou for subscribing. You are going to be logged out for changes to take effect."

                                    setTimeout(function () {
                                        delete $window.localStorage.token
                                        delete $window.localStorage.latestInvoiceId;
                                        delete $window.localStorage.latestInvoicePaymentIntentStatus;
                                        location.href = '/login'
                                    }, 5000);
                                })
                        }
                    }

                    function handlePaymentThatRequiresCustomerAction({
                        subscription,
                        invoice,
                        priceId,
                        paymentMethodId,
                        isRetry,
                    }) {
                        if (subscription && subscription.status === 'active') {
                            // Subscription is active, no customer actions required.
                            return { subscription, priceId, paymentMethodId };
                        }

                        // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
                        // If it's a retry, the payment intent will be on the invoice itself.
                        let paymentIntent = invoice ? invoice.payment_intent : subscription.latest_invoice.payment_intent;

                        if (
                            paymentIntent.status === 'requires_action' ||
                            (isRetry === true && paymentIntent.status === 'requires_payment_method')
                        ) {
                            return stripe
                                .confirmCardPayment(paymentIntent.client_secret, {
                                    payment_method: paymentMethodId,
                                })
                                .then((result) => {
                                    if (result.error) {
                                        // Start code flow to handle updating the payment details.
                                        // Display error message in your UI.
                                        // The card was declined (i.e. insufficient funds, card has expired, etc).
                                        throw result;
                                    } else {
                                        if (result.paymentIntent.status === 'succeeded') {
                                            // Show a success message to your customer.
                                            // There's a risk of the customer closing the window before the callback.
                                            // We recommend setting up webhook endpoints later in this guide.
                                            $http.post("/api/subcomplete", {
                                                email: user.Email,
                                            })
                                                .then((res) => {
                                                    $(".subb2").show();
                                                    $(".spin").hide();

                                                    document.querySelector(".pop-up").style.display = "flex";
                                                    vm.message = "Thankyou for subscribing. You are going to be logged out for changes to take effect."

                                                    setTimeout(function () {
                                                        delete $window.localStorage.token
                                                        delete $window.localStorage.latestInvoiceId;
                                                        delete $window.localStorage.latestInvoicePaymentIntentStatus;
                                                        location.href = '/login'
                                                    }, 5000);
                                                })

                                            return {
                                                priceId: priceId,
                                                subscription: subscription,
                                                invoice: invoice,
                                                paymentMethodId: paymentMethodId,
                                            };
                                        }
                                    }
                                })
                                .catch((error) => {
                                    $(".subb2").show();
                                    $(".spin").hide();
                                    displayError.textContent = error.error.message;
                                });
                        } else {
                            // No customer action needed.
                            return { subscription, priceId, paymentMethodId };
                        }
                    }

                    function handleRequiresPaymentMethod({
                        subscription,
                        paymentMethodId,
                        priceId,
                    }) {
                        if (subscription.status === 'active') {
                            // subscription is active, no customer actions required.
                            return { subscription, priceId, paymentMethodId };
                        } else if (
                            subscription.latest_invoice.payment_intent.status ===
                            'requires_payment_method'
                        ) {
                            // Using localStorage to manage the state of the retry here,
                            // feel free to replace with what you prefer.
                            // Store the latest invoice ID and status.
                            localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
                            localStorage.setItem(
                                'latestInvoicePaymentIntentStatus',
                                subscription.latest_invoice.payment_intent.status
                            );
                            throw { error: { message: 'Your card was declined.' } };
                        } else {
                            return { subscription, priceId, paymentMethodId };
                        }
                    }


                });


        });


    };

    //reset controller function
    app.controller('ResetController', ResetController);

    function ResetController($location, $window, $http) {
        var vm = this;

        //when user clicks change password
        vm.change = function () {
            const url = window.location.pathname.split("/")
            const url2 = url[2];
            //if there is a blank form
            if (!vm.user) {
                vm.error = "please type in your new password";
                return;
            }

            //if the password doesnt meet the standard return a message
            if ($(".invalid").attr("class") == "invalid ng-touched") {
                vm.error = "please fill out the form correctly";
                return;
            }

            //check if the passwords match
            if (vm.user.password !== vm.user.password1) {
                vm.error = "The passwords do not match"
                return;
            }

            $http.post("/api/pwrdreset", {
                user: vm.user,
                url: url2,
            })
                .then((response) => {
                    if (response.data == "this link has expired") {
                        delete $window.localStorage.token;
                        vm.error = response.data
                    }
                    else {
                        $location.path('/login')
                    }
                })
        }
    }

    //email controller function
    app.controller('EmailController', EmailController);

    function EmailController($location, $window, $http) {
        var vm = this;
        //when user clicks reset password button
        vm.reset = function () {
            if ($(".invalid").attr("class") == "invalid ng-touched") {
                vm.error = "please fill out the form correctly";
                return;
            }
            $http.post('/api/reset', {
                email: vm.user
            })
                .then(function (response) {
                    if (response.data == "no email found") {
                        vm.error = response.data;
                    }

                    else {
                        vm.error = ""
                        vm.message = response.data
                    }


                })
        }
    }

    //home controller function
    app.controller('HomentController', HomentController);

    function HomentController($location, $window, $http) {
        var vm = this;
        vm.title = "Home Controller";


        $("#spin3").hide();
        $("#spin4").hide();



        //when user clicks notify button
        $(".btn2").click(function () {

            //check to see if there is an email
            if (vm.notify == undefined) {
                $(".error1").html("please enter the email of the investor you would like to refer.")
                return
            }

            $(".error1").html("")

            $(".btn3").html("")
            $("#spin4").show()

            $http.post("/api/referinvtstr", vm.notify)
                .then((res) => {
                    $("#spin4").hide();
                    $(".btn2").html("Thankyou for your refer.")

                    setTimeout(() => {
                        $(".contact-form").hide();
                        location.href = "/"
                    }, 1500)
                })
        })

        //function to display investors on the home screen
        $http.post("api/homeInvestor", {
            data: "homeinvestor"
        })
            .then((res) => {

                //var to track number of pics on the left div
                var l = 0;

                //var to track number of of pics on the right div
                var r = 0;

                if (res.data.length !== 0) {

                    $(".s5b , .s5p").hide();
                    $(".invhld , .invhld1").show();
                    document.querySelector(".sct5").style.display = "flex"

                    //loop through the investor data
                    for (var i = 0; i < res.data.length; i++) {

                        var firstname = res.data[i].FirstName
                        var lastname = res.data[i].LastName
                        var city = res.data[i].City
                        var state = res.data[i].State
                        var bio = res.data[i].Bio
                        var email = res.data[i].Email

                        /*display the first investor*/
                        if (i == 0) {
                            $("<div class = \"inv\">" +
                                "<div class = \"invprf\" id = " + email + ">" +
                                "</div>" +
                                "<div class = \"bio\">" +
                                "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                "<p class = \"location\">" + city + ", " + state + "</p>" +
                                "<p class = \"bio1\">" + bio + "</p>" +
                                "</div>" +
                                "</div>"
                            ).prependTo(".sct2")
                        }
                        else {
                            l += 1

                            if (l <= 3 && r == 0) {
                                $("<div class =\"div" + i + " prf1\" id=" + email + "></div>").appendTo(".sct1")
                            }
                            else {
                                if (l <= 6) {
                                    $("<div class =\"div" + i + " prf1\" id=" + email + "></div>").appendTo(".sct3")
                                }
                            }
                        }

                        /*get the picture*/
                        $http.post("/api/profile", {
                            user: res.data[i].Email
                        })
                            .then((res1) => {
                                var em = res1.config.data.user

                                /*check if picture matches the first investor*/
                                if ($(".invprf")[0].id == em) {
                                    //image file
                                    document.querySelector(".invprf").style.backgroundImage = 'url(../profile/' + res1.data + ')';
                                }
                                else {

                                    //loop the investor profile pics
                                    for (var p = 0; p < $(".prf1").length; p++) {

                                        var div = $(".prf1")[p]
                                        if (div.id == em) {

                                            $(div).css('background-image', 'url(../profile/' + res1.data + ')');

                                        }

                                    }
                                }

                            })
                    }

                    var la = 0;
                    //when user clicks the left arrow
                    $(".left").click(function () {

                        var clas = $(".sct1")[0].children[la].id
                        clas = clas.split(' ')
                        clas = clas[0]

                        var email = $(".sct1")[0].children[la].id

                        //big investr email
                        var email2 = $(".invprf")[0].id

                        //get the profile of the main investor
                        var prf = $(".invprf")[0].style.backgroundImage
                        prf = prf.split("url")
                        prf = prf[1]
                        prf = prf.split("(")
                        prf = prf[1]
                        prf = prf.split(")")
                        prf = prf[0]
                        prf = prf.split("/")
                        prf = prf[2]
                        prf = prf.split('"')
                        prf = prf[0]

                        //get the profile of the small investor
                        var prf2 = $(".sct1")[0].children[la].style.backgroundImage
                        prf2 = prf2.split("url")
                        prf2 = prf2[1]
                        prf2 = prf2.split("(")
                        prf2 = prf2[1]
                        prf2 = prf2.split(")")
                        prf2 = prf2[0]
                        prf2 = prf2.split("/")
                        prf2 = prf2[2]
                        prf2 = prf2.split('"')
                        prf2 = prf2[0]


                        //get the div and remove
                        $(".sct1")[0].children[la].remove()

                        //get the number
                        var n = clas.slice(-1)
                        //append the new div
                        $("<div class =\"div" + n + " prf1\" id=" + email2 + " style=\"background-image: url(../profile/" + prf + ");\"></div>").prependTo(".sct1")

                        //loop to change classes of small div
                        var div1 = $(".sct1")[0].children

                        for (var c = 0; c < div1.length; c++) {

                            var clas2 = div1[c].className
                            if (c == 0) {

                                $(div1[c]).removeClass(clas2).addClass("div1 prf1")
                            }

                            if (c == 1) {
                                $(div1[c]).removeClass(clas2).addClass("div2 prf1")
                            }

                            if (c == 2) {
                                $(div1[c]).removeClass(clas2).addClass("div3 prf1")
                            }
                        }

                        $(".inv").remove();

                        //loop through the data
                        for (var t = 0; t < res.data.length; t++) {

                            if (res.data[t].Email == email) {

                                var firstname = res.data[t].FirstName
                                var lastname = res.data[t].LastName
                                var city = res.data[t].City
                                var state = res.data[t].State
                                var bio = res.data[t].Bio
                                var email = res.data[t].Email

                                $("<div class = \"inv\">" +
                                    "<div class = \"invprf\" id = " + email + " style=\"background-image: url(../profile/" + prf2 + ");\">" +
                                    "</div>" +
                                    "<div class = \"bio\">" +
                                    "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                    "<p class = \"location\">" + city + ", " + state + "</p>" +
                                    "<p class = \"bio1\">" + bio + "</p>" +
                                    "</div>" +
                                    "</div>"
                                ).prependTo(".sct2")
                            }
                        }

                        la += 1
                        if (la == 3) {
                            la = 0
                        }

                    })

                    //when user clicks the right arrow
                    $(".right").click(function () {

                        var clas = $(".sct3")[0].children[r].className
                        clas = clas.split(' ')
                        clas = clas[0]

                        var email = $(".sct3")[0].children[r].id

                        //big investr email
                        var email2 = $(".invprf")[0].id

                        //get the profile of the main investor
                        var prf = $(".invprf")[0].style.backgroundImage
                        prf = prf.split("url")
                        prf = prf[1]
                        prf = prf.split("(")
                        prf = prf[1]
                        prf = prf.split(")")
                        prf = prf[0]
                        prf = prf.split("/")
                        prf = prf[2]
                        prf = prf.split('"')
                        prf = prf[0]

                        //get the profile of the small investor
                        var prf2 = $(".sct3")[0].children[r].style.backgroundImage
                        prf2 = prf2.split("url")
                        prf2 = prf2[1]
                        prf2 = prf2.split("(")
                        prf2 = prf2[1]
                        prf2 = prf2.split(")")
                        prf2 = prf2[0]
                        prf2 = prf2.split("/")
                        prf2 = prf2[2]
                        prf2 = prf2.split('"')
                        prf2 = prf2[0]


                        //get the div and remove
                        $(".sct3")[0].children[r].remove()

                        //get the number
                        var n = clas.slice(-1)
                        //append the new div
                        $("<div class =\"div" + n + " prf1\" id=" + email2 + " style=\"background-image: url(../profile/" + prf + ");\"></div>").prependTo(".sct3")

                        //loop to change classes of small div
                        var div1 = $(".sct3")[0].children

                        for (var c = 0; c < div1.length; c++) {

                            var clas2 = div1[c].className
                            if (c == 0) {

                                $(div1[c]).removeClass(clas2).addClass("div4 prf1")
                            }

                            if (c == 1) {
                                $(div1[c]).removeClass(clas2).addClass("div5 prf1")
                            }

                            if (c == 2) {
                                $(div1[c]).removeClass(clas2).addClass("div6 prf1")
                            }
                        }

                        $(".inv").remove();

                        //loop through the data
                        for (var t = 0; t < res.data.length; t++) {

                            if (res.data[t].Email == email) {

                                var firstname = res.data[t].FirstName
                                var lastname = res.data[t].LastName
                                var city = res.data[t].City
                                var state = res.data[t].State
                                var bio = res.data[t].Bio
                                var email = res.data[t].Email

                                $("<div class = \"inv\">" +
                                    "<div class = \"invprf\" id = " + email + " style=\"background-image: url(../profile/" + prf2 + ");\">" +
                                    "</div>" +
                                    "<div class = \"bio\">" +
                                    "<p class = \"name\">" + firstname + " " + lastname + "</p>" +
                                    "<p class = \"location\">" + city + ", " + state + "</p>" +
                                    "<p class = \"bio1\">" + bio + "</p>" +
                                    "</div>" +
                                    "</div>"
                                ).prependTo(".sct2")
                            }
                        }

                        r += 1
                        if (r == 3) {
                            r = 0
                        }


                    })
                }

            })

        //when user clicks send button on the contact
        $(".btn").click(function () {

            //check to see if the information is all enterd
            if (!vm.contact) {
                $(".error").html("Please fill out the information above.")
                return
            }

            if (!vm.contact.name) {
                $(".error").html("What is your name?")
                return
            }

            if (!vm.contact.email) {
                $(".error").html("Enter your email above, its a way of getting back to you")
                return
            }

            if (!vm.contact.message) {
                $(".error").html("Type your message above (how can we help you)")
                return
            }

            $(".error").html("")
            $(".btn1").hide()
            document.getElementById("spin3").style.display = "block"


            $http.post("/api/contactus", vm.contact)
                .then((res) => {

                    if (res.data == "sent") {
                        $("#spin3").hide();
                        $(".btn").html("Message sent")

                        setTimeout(() => {
                            $(".contact-form").hide();
                            location.href = "/"
                        }, 1000)

                    }

                    else {
                        $(".error").html("An error occured, try again shortly!")

                        setTimeout(() => {
                            $(".contact-form").hide();
                            location.href = "/"
                        }, 3000)
                    }


                })
        })

    }

    //startup registration controller function
    app.controller('startuprgtController', startuprgtController);

    function startuprgtController($location, $window, $http, jwtHelper) {
        var vm = this;
        vm.title = "startuprgt controller";
        vm.error;
        vm.user;

        //reload the page once
        if (window.location.href.indexOf('reload') == -1) {
            window.location.replace(window.location.href + '?reload');
        }

        $(".burger").click(function () {
            $(".links").toggleClass('nav-active')
        })

        vm.register = function () {

            //reset vm.error to blank
            vm.error = "";

            if ($(".invalid").attr("class") == "invalid ng-touched") {
                vm.error = "please fill out the form correctly";
                return;
            }

            //if missing the whole form
            if (!vm.startup) {
                vm.error = 'please fill out the form below';
                return;
            };

            //if missing email
            if (!vm.startup.email) {
                vm.error = "please provide your email adress";
                return;
            };

            //if missing FirstName
            if (!vm.startup.FirstName) {
                vm.error = "your first name is missing";
                return;
            };

            //if missing last name
            if (!vm.startup.LastName) {
                vm.error = "your last name is missing";
                return;
            };

            //if missing school
            if (!vm.startup.school) {
                vm.error = "The school section is missing"
                return;
            }
            //if missing bio
            if (!vm.startup.bio) {
                vm.error = "please provide your biography below";
                return;
            };

            //if there is no address
            if (!$("#loc_lat").val()) {
                vm.error = "Please provide your address so we can provide you with startups closest to you";
                return;
            }

            //if there is no position
            if (!vm.startup.position) {
                vm.error = "what is your position in the startup ?"
                return;
            }

            //if missing password
            if (!vm.startup.password) {
                vm.error = "password field is empty";
                return;
            }

            if (!vm.checked) {
                vm.error = "you haven`t agreed to the terms of service below"
                return;
            }

            vm.startup.lat = $("#loc_lat").val()
            vm.startup.long = $("#loc_long").val()
            vm.startup.city = $("#city").val();
            vm.startup.state = $("#state").val();
            vm.startup.country = $("#country").val();

            //send the information to the server for storage
            $http.post('/api/startuprgt', {
                startup: vm.startup,
                Checked: vm.checked,
            })
                .then(function (response) {
                    if (response.data == "change") {
                        $location.path('/whoami')
                        return;
                    }

                    if (response.data == "exists") {
                        vm.error = "provided email already exists";
                        return;
                    }

                    $window.localStorage.token = response.data;
                    vm.error = ""
                    //show the pop up 
                    document.querySelector('.pop-up').style.display = 'flex';


                }, function (err) {
                    vm.error = err.data;
                })

        }
    }

    //Investor registration controller function
    app.controller('InvestorController', InvestorController);

    function InvestorController($location, $window, $http, jwtHelper) {
        var vm = this;
        vm.title = "Investor controller";
        vm.error;
        vm.user;

        //reload the page once
        if (window.location.href.indexOf('reload') == -1) {
            window.location.replace(window.location.href + '?reload');
        }

        //track all the titles and subtitles that are selected
        var title = [];

        //get all the insudtries
        $http.get('api/industry')
            .then((response) => {

                //store the data
                var dat = response.data;

                //array var to store the html code
                var file2 = [];
                //loop through the data
                for (var i = 0; i < dat.length; i++) {

                    //loop through the subtitle
                    for (var s = 0; s < dat[i].SubTitle.length; s++) {
                        file2.push("<input class = \"radiio\" type=\"checkbox\" id=" + dat[i].SubTitle[s] + " value=" + dat[i].SubTitle[s] + "></input>" +
                            "<label for=" + dat[i].SubTitle[s] + ">" + dat[i].SubTitle[s] + "</label>" + "<br>")
                    }
                    var file2 = file2.join("")

                    $("<div class = \"title\">" +
                        "<input class = \"radio\" type=\"checkbox\" value=" + dat[i].Title + "></input>" +
                        "<label class = \"radio2\" >" + dat[i].Title + " </label>" +
                        "<div class = \"subtitle\">" + file2 + "</div>" +
                        "</div>").appendTo(".industry")

                    file2 = [];
                }


                //when user clicks the check button
                $(".radio").click(function () {

                    //var to store the clicked radio data
                    var dat = $(this).parent("div")[0].children[1].innerHTML.toLowerCase();

                    if ($(this).prop("checked") == true) {

                        var ti = {
                            title: String,
                            subtitle: [],
                        }

                        ti.title = dat;
                        title.push(ti)
                    }
                    else {

                        //remove the sutitle
                        //loop through the title
                        for (var i = 0; i < title.length; i++) {

                            //loop through the sutitles
                            for (var s = 0; s < title[i].subtitle.length; s++) {
                                //uncheck all the checkboxes
                                $('#' + title[i].subtitle[s]).prop('checked', false);
                            }
                            if (title[i].title == dat) {
                                title.splice(i, 1)
                            }
                        }

                    }
                })

                //when user clicks the subtitle button
                $(".radiio").click(function () {

                    //store the check button on title
                    var rtit = $(this).parents("div")[1].children[0];

                    var rsub = $(this)

                    var titval = $(this).parents("div")[1].children[1].innerHTML.toLowerCase();

                    var subval = $(this).val().toLowerCase();

                    var ti = {
                        title: String,
                        subtitle: [],
                    }

                    //when user unchecks a subtitle
                    if ($(rsub).prop("checked") == false) {

                        //loop through the title
                        for (var t = 0; t < title.length; t++) {

                            //loop through the title
                            if (title[t].title == titval) {

                                //loop through the subtitles
                                for (var s = 0; s < title[t].subtitle.length; s++) {

                                    if (title[t].subtitle[s] == subval) {
                                        title[t].subtitle.splice(s, 1)
                                    }
                                }

                            }
                        }
                    }

                    //check if title is not checked and subtitle is checked
                    if ($(rtit).prop("checked") == false && $(rsub).prop("checked") == true) {

                        //check the title
                        $(rtit).prop("checked", true)

                        //seth the value
                        ti.title = titval;
                        ti.subtitle.push(subval);

                        title.push(ti)

                    }

                    //check if title is checked
                    else if ($(rtit).prop("checked") == true && $(rsub).prop("checked") == true) {

                        //loop the title
                        for (var i = 0; i < title.length; i++) {

                            //look for the title with the same title that holds the subtitle
                            if (title[i].title == titval) {
                                title[i].subtitle.push(subval)
                            }
                        }
                    }
                })

                //when user clicks title on industry section
                $(".radio2").click(function () {
                    var x = $(this).parent("div")[0].children[2]

                    //if there is a subtitle
                    if (window.getComputedStyle(x).display === "none") {
                        $(x).show();
                    }

                    else {
                        $(x).hide();
                    }
                })
            })

        vm.register = function () {

            //reset vm.error to blank
            vm.error = "";

            if ($(".invalid").attr("class") == "invalid ng-touched") {
                vm.error = "please fill out the form correctly.";
                return;
            }

            //if missing the whole form
            if (!vm.investor) {
                vm.error = 'please fill out the form below.';
                return;
            };

            //if missing email
            if (!vm.investor.email) {
                vm.error = "please provide your email adress.";
                return;
            };

            //if missing FirstName
            if (!vm.investor.FirstName) {
                vm.error = "your first name is missing.";
                return;
            };

            //if missing last name
            if (!vm.investor.LastName) {
                vm.error = "your last name is missing.";
                return;
            };

            //if missing bio
            if (!vm.investor.bio) {
                vm.error = "please provide your biography below.";
                return;
            };

            //if missing investor type
            if (!vm.investor.type) {
                vm.error = "The investor type section is empty"
                return;
            }

            //if there is no budget
            if (!vm.investor.budget) {
                vm.error = "please enter your investment budget";
                return;
            }

            //if there is no address
            if (!$("#loc_lat").val()) {
                vm.error = "Please provide your address so we can provide you with startups closest to you.";
                return;
            }

            //if missing password
            if (!vm.investor.password) {
                vm.error = "password field is empty.";
                return;
            }

            if (!vm.checked) {
                vm.error = "you haven`t agreed to the terms of service below."
                return;
            }

            if (!vm.checked2) {
                vm.error = "if you are an accredited investor then check the accredited investor checkbox."
                return;
            }
            vm.investor.lat = $("#loc_lat").val()
            vm.investor.long = $("#loc_long").val()
            vm.investor.city = $("#city").val();
            vm.investor.state = $("#state").val();
            vm.investor.country = $("#country").val();

            //send the information to the server for storage
            $http.post('/api/investorgt', {
                investor: vm.investor,
                Checked: vm.checked,
                industry: title,
            })
                .then(function (response) {

                    if (response.data == "change") {
                        $location.path('/whoami')
                        return;
                    }

                    if (response.data == "exists") {
                        vm.error = "provided email already exists";
                        return;
                    }

                    $window.localStorage.token = response.data;
                    vm.error = ""
                    //show the pop up 
                    document.querySelector('.pop-up').style.display = 'flex';


                }, function (err) {
                    console.log(err)
                })

        }
    }

    //whoami controller function
    app.controller('WhoamiController', WhoamiController);

    function WhoamiController($location, $http, $route) {
        var vm = this;
        vm.title = 'whoami controller';

        vm.startup = function () {
            $location.path('/startuprgt')
        }

        vm.inve = function () {
            $location.path('/investorgt')
        }
    }

    //login controller funtion
    app.controller('LoginController', LoginController);

    function LoginController($location, $window, $http, jwtHelper) {
        var vm = this;
        vm.error;

        vm.login = function () {
            if (vm.user) {
                $http.post('/api/login', vm.user)
                    .then(function (response) {

                        //to reset error back to an empty string
                        vm.error = "";

                        //if missing email or password
                        if (response.data == "missing") {
                            vm.error = "please enter both email and password"
                            return;
                        }

                        //if there is an error
                        if (response.data == "error") {
                            vm.error = "an error has occured";
                            return;
                        }

                        //if account doesnt exists
                        if (response.data == "NoAccount") {
                            vm.error = "no user has been registered with this credentials"
                            return;
                        }

                        if (response.data == "inactive") {
                            vm.error = "you need to verify your email first to login, check your email for a verification link"
                            return;
                        }

                        $window.localStorage.token = response.data;
                        vm.user;
                        const token = $window.localStorage.token;
                        const payload = jwtHelper.decodeToken(token).data;
                        if (payload) {
                            vm.user = payload;
                        }
                        if (vm.user.Account == "startup") {
                            $location.path('/post');
                        }
                        else {
                            $location.path('/products')
                        }

                    }, function (err) {
                        vm.error = err.data
                    })
            }
            else {
                vm.error = 'please fill out the information below';
            }
        }

    }

    //verify email
    app.controller('VerifyController', VerifyController);

    function VerifyController($location, jwtHelper, $http, $window) {
        var vm = this;
        //retrive token from the url
        const url = window.location.pathname.split("/")
        const url2 = url[2];

        //send the token to api/vemail to check for validation
        $http.post('/api/vemail', {
            url: url2
        })
            .then((response) => {
                if (response.data == "this link has expired") {
                    $("#announcement").hide();
                    vm.message = "";
                    vm.error = response.data;
                }
                else {
                    $("#announcement").show();
                    vm.message = response.data
                    //login button
                    $(
                        "<a href = \"/login\" class = \"btn\"> LOGIN </a>"
                    ).appendTo(".button");
                }
            })


    }

    //profile controller function
    app.controller('ProfileController', ProfileController);

    function ProfileController($location, $window, jwtHelper, $http) {
        var vm = this;
        vm.error;
        vm.title = 'profile';
        var image2;
        var myFiles2 = [];
        var myFiles = [];

        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {

            vm.user = payload
            var user = payload
        }

        //when user clicks delete button
        $(".dele").click(function () {
            document.querySelector(".pop-dis").style.display = "flex";
        });

        //when user clicks no button
        $(".no2").click(function () {
            //hide the pop-dis
            $(".pop-dis").hide();
        })

        //when user clicks yes2
        $(".yes2").click(function () {

            //if its investor
            if (user.Account == "investor") {
                //route to delete users account
                $http.post("/api/delete", {
                    account: user.Account,
                    email: user.Email
                })
                    .then((res) => {

                        delete $window.localStorage.token
                        $location.path("/")

                    })

                return;
            }

            //route to delete the customer from stripe
            $http.post("/api/delete-customer", {
                customerId: user.stripeCustomerId
            })
                .then((res) => {

                    //route to delete users account
                    $http.post("/api/delete", {
                        account: user.Account,
                        email: user.Email
                    })
                        .then((res) => {

                            delete $window.localStorage.token
                            $location.path("/")

                        })
                })
        })

        //find out wich account the user is on
        if (user.Account == "startup") {
            vm.info = "investors"
            $("#f").html("to find investors closest to ypu.")
        }
        else {
            vm.info = "startups"
            $("#f").html("to find Startups closest to you.")
        }

        var lat = user.lat;
        var long = user.long;

        var api = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyAEosJpwPi93NGAXxn0y3mHBZHEkFr9zd4"

        var location
        $.getJSON(api, function (data) {
            location = data.results[0].formatted_address;
            $("#search_input").val(location)
        });

        $(".fname").val(user.FirstName);
        $(".lname").val(user.LastName);
        $("#bio").val(user.Bio);
        vm.email = user.Email;
        vm.rgt = user.RegistrationDate;
        vm.city = user.City


        //array var to store the title
        var title = [];

        //if the account is an investor
        if (user.Account == "investor") {

            //show intrests
            document.querySelector(".intrests").style.display = "block"


            //loop through investors intrests
            for (var u = 0; u < user.Industry.length; u++) {

                var ti = {
                    title: String,
                    subtitle: [],
                }

                ti.title = user.Industry[u].title;

                //loop through the subtitls
                for (var s = 0; s < user.Industry[u].subtitle.length; s++) {

                    ti.subtitle.push(user.Industry[u].subtitle[s])
                }

                title.push(ti)

            }

            intrest();
            //function to loop the title
            function intrest() {

                var t = [];
                var su = [];

                //loop through the title
                for (var i = 0; i < title.length; i++) {
                    t.push("<p class = \"ti ti2\">" + title[i].title + "</p>")

                    //loop through the subtitle
                    for (var s = 0; s < title[i].subtitle.length; s++) {
                        su.push("<p class = \"ti ti3\" >" + title[i].subtitle[s] + "</p>")
                    }

                    t = t.join(" ");
                    su = su.join(" ");

                    //if there are subtitles
                    if (su.length > 0) {
                        $("<div class = \"mk\">" + t +
                            "<p class = \"ti\" id = \"hj\">:</p>" +
                            su +
                            "</div>").appendTo(".intr1")
                    }
                    else {
                        $("<div class = \"mk\">" + t +
                            "</div>").appendTo(".intr1")
                    }

                    t = [];
                    su = [];
                }
            }
            //get the industries
            $http.get("/api/industry")
                .then((res) => {
                    //store the data
                    var dat = res.data;

                    //array var to store the html code
                    var file2 = [];
                    //loop through the data
                    for (var i = 0; i < dat.length; i++) {

                        //loop through the subtitle
                        for (var s = 0; s < dat[i].SubTitle.length; s++) {
                            file2.push("<input class = \"radiio\" type=\"checkbox\" id=" + dat[i].SubTitle[s] + " value=" + dat[i].SubTitle[s] + "></input>" +
                                "<label for=" + dat[i].SubTitle[s] + ">" + dat[i].SubTitle[s] + "</label>" + "<br>")
                        }
                        var file2 = file2.join("")

                        $("<div class = \"title\">" +
                            "<input class = \"radio\" type=\"checkbox\" value=" + dat[i].Title + "></input>" +
                            "<label class = \"radio2\" >" + dat[i].Title + "</label>" +
                            "<div class = \"subtitle\">" + file2 + "</div>" +
                            "</div>").appendTo(".intr2")

                        file2 = [];
                    }

                    //when user clicks the check button
                    $(".radio").click(function () {

                        //var to store the clicked radio data
                        var dat = $(this).parent("div")[0].children[1].innerHTML.toLowerCase();

                        if ($(this).prop("checked") == true) {

                            //loop through the title
                            for (var i = 0; i < title.length; i++) {
                                if (title[i].title == dat) {
                                    title.splice(i, 1)
                                }
                            }
                            var ti = {
                                title: String,
                                subtitle: [],
                            }

                            ti.title = dat;
                            title.push(ti)
                            //remove the client side intrest tag
                            $(".mk").remove();
                            intrest();
                        }
                        else {

                            //remove the sutitle
                            //loop through the title
                            for (var i = 0; i < title.length; i++) {

                                //loop through the substitles
                                for (var s = 0; s < title[i].subtitle.length; s++) {
                                    //uncheck all the checkboxes
                                    $('#' + title[i].subtitle[s]).prop('checked', false);
                                }
                                if (title[i].title == dat) {
                                    title.splice(i, 1);

                                    //remove the client side intrest tag
                                    $(".mk").remove();
                                    intrest();
                                }
                            }

                        }
                    })

                    //when user clicks the subtitle button
                    $(".radiio").click(function () {

                        //store the check button on title
                        var rtit = $(this).parents("div")[1].children[0];

                        var rsub = $(this)

                        var titval = $(this).parents("div")[1].children[1].innerHTML.toLowerCase();

                        var subval = $(this).val().toLowerCase();

                        var ti = {
                            title: String,
                            subtitle: [],
                        }

                        //when user unchecks a subtitle
                        if ($(rsub).prop("checked") == false) {

                            //loop through the title
                            for (var t = 0; t < title.length; t++) {

                                //loop through the title
                                if (title[t].title == titval) {

                                    //loop through the subtitles
                                    for (var s = 0; s < title[t].subtitle.length; s++) {

                                        if (title[t].subtitle[s] == subval) {
                                            title[t].subtitle.splice(s, 1)

                                            //remove the client side intrest tag
                                            $(".mk").remove();
                                            intrest();
                                        }
                                    }

                                }
                            }
                        }

                        //check if title is not checked and subtitle is checked
                        if ($(rtit).prop("checked") == false && $(rsub).prop("checked") == true) {

                            //check the title
                            $(rtit).prop("checked", true)

                            //seth the value
                            ti.title = titval;
                            ti.subtitle.push(subval);

                            title.push(ti);

                            //remove the client side intrest tag
                            $(".mk").remove();
                            intrest();
                        }

                        //check if title is checked
                        else if ($(rtit).prop("checked") == true && $(rsub).prop("checked") == true) {

                            //loop the title
                            for (var i = 0; i < title.length; i++) {

                                //look for the title with the same title that holds the subtitle
                                if (title[i].title == titval) {
                                    title[i].subtitle.push(subval);

                                    //remove the client side intrest tag
                                    $(".mk").remove();
                                    intrest();
                                }
                            }
                        }
                    })

                    //when user clicks title on industry section
                    $(".radio2").click(function () {
                        var x = $(this).parent("div")[0].children[2]

                        //if there is a subtitle
                        if (window.getComputedStyle(x).display === "none") {
                            $(x).show();
                        }

                        else {
                            $(x).hide();
                        }
                    })
                })
        }
        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.divprof').text(intials);

        vm.logout = function () {
            delete $window.localStorage.token;
            $location.path('/login')
        }

        //preview pictures before uploading
        if (window.File && window.FileList && window.FileReader) {

            $("#file").on("change", function (e) {

                //remove the previous file
                $(".prof").remove();

                if (myFiles.length > 0) {
                    myFiles = [];
                    $(".prof").remove();

                }
                if (myFiles2.length > 0) {
                    myFiles2 = [];
                    $(".prof").remove();
                }
                var files = e.target.files


                if (files[0].type.includes("image")) {

                    //remove the txt element inside the div
                    $('.divprof').contents().filter(function () {
                        return this.nodeType === 3;
                    }).remove();

                    myFiles.push(files[0]);
                }
                else {
                    //alert
                    alert("Upload only images or vidoes")
                }

                var fileReader = new FileReader();
                fileReader.onload = (function (e) {

                    //image file
                    document.querySelector(".divprof").style.backgroundImage = 'url(' + e.target.result + ')';

                });
                fileReader.readAsDataURL(files[0]);

            });
        } else {
            alert("Your browser doesn't support to File API")
        }

        vm.save = function () {


            //reset the error
            vm.error = ""

            //check if there is a value on firstname
            if (!$('.fname').val()) {
                vm.error = "Please type in your first name";
                return;
            }

            //check if there is a value on laststname
            if (!$('.lname').val()) {
                vm.error = "Please type in your last name";
                return;
            }

            //check if there is a value on email
            if (!$('.email').html()) {
                vm.error = "Please type in your email";
                return;
            }

            //check if there is a value on bio
            if (!$('#bio').val()) {
                vm.error = "biography cant be empty";
                return;
            }

            //store the address
            var lat1;
            var long1;
            var city;
            var state;
            var country;

            //check if address was changed
            if ($("#loc_lat").val() == "") {

                lat1 = lat;
                long1 = long;
                city = user.City;
                state = user.State;
                country = user.Country;
            }
            else {
                lat1 = $("#loc_lat").val();
                long1 = $("#loc_long").val();
                city = $("#city").val();
                state = $("#state").val();
                country = $("#country").val();
            }

            title = JSON.stringify(title)

            //var to store the users profile data
            var profile = {
                fname: $('.fname').val(),
                lname: $('.lname').val(),
                bio: $('#bio').val(),
                lat: lat1,
                long: long1,
                country: country,
                state: state,
                city: city,
                email: user.Email,
                account: user.Account,
                industry: title,
            };


            var fd = new FormData();

            for (key in profile) {
                fd.append(key, profile[key]);
            }



            fd.append(user.Email, myFiles[0]);


            document.querySelector(".pop-up").style.display = "flex";

            //when user clicks no dont update
            $(".no").click(function () {
                window.location.reload();
            })

            //when user clicks update
            $(".yes").click(function () {
                //get the input fields and update the field inputs
                $http.post("api/update", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined },
                })
                    .then(function (response) {

                        if (response.data == "saved") {
                            delete $window.localStorage.token
                            $location.path("login")
                        }

                    })
            });
        }

        //post function to get the users profile picture
        $http.post("api/profile", {
            user: user.Email,
        })
            .then(function (response) {

                if (response.data) {

                    if (response.data !== "none") {
                        //remove the txt element inside the div
                        $('.divprof').contents().filter(function () {
                            return this.nodeType === 3;
                        }).remove();

                        //image file
                        document.querySelector(".divprof").style.backgroundImage = 'url(../profile/' + response.data + ')';
                    }
                }
            })
    }


}())