(function () {
    const app = angular.module('app').controller('Ctrl2', ['ngRoute', 'angular-jwt']);

    app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);


        $routeProvider.when('/savedinvestors', {
            templateUrl: '../Entrepreneur/savedinvestors.html',
            controller: 'SavedController',
            controllerAs: 'vm',
            access: {
                restricted: true,
                account: "startup",
            }
        });

        $routeProvider.when('/findinvestors', {
            templateUrl: '../Entrepreneur/investors.html',
            controller: 'InvestorsController',
            controllerAs: 'vm',
            access: {
                restricted: true,
                account: "startup",
            }
        });

        $routeProvider.when('/mystartups', {
            templateUrl: '../Entrepreneur/mystartups.html',
            controller: 'EntrepreneurController',
            controllerAs: 'vm',
            access: {
                restricted: true,
                account: "startup",
            }
        });

        $routeProvider.when('/messages', {
            templateUrl: '../Entrepreneur/offers.html',
            controller: 'OffersController',
            controllerAs: 'vm',
            access: {
                restricted: true,
                account: "startup",
            }
        });

        $routeProvider.when('/post', {
            templateUrl: '../Entrepreneur/post.html',
            controller: 'PostController',
            controllerAs: 'vm',
            access: {
                restricted: true,
                account: "startup",
            }
        });

        $routeProvider.when("/update", {
            templateUrl: "../Entrepreneur/update.html",
            controller: "UpdateController",
            controllerAs: "vm",
            access: {
                restricted: true,
                account: "startup",
            }
        });

        //preview the startups
        $routeProvider.when("/preview2/:token", {
            templateUrl: "../Investor/preview.html",
            controller: "Preview2Controller",
            controllerAs: "vm",
            access: {
                restricted: true,
                account: "startup",
            }
        })

    });

    var slideshow = function () {
        /*-------------product images and video slideshow code below--------------*/

        var slidein = [];
        //store the settimeout function
        var timeout;
        var slide = $(".myslidediv").parent(".test");
        //push 0 into the slide array
        for (var s = 0; s < slide.length; s++) {
            slidein.push(0)
        }

        function carousel() {
            var i;
            var t;

            for (t = 0; t < slide.length; t++) {
                var x = $(slide[t]).children(".myslidediv");
                var d = $(slide[t]).children(".dot1").children(".dot2").children(".dot")
                slidein[t]++

                for (var i = 0; i < x.length; i++) {
                    x[i].style.display = "none";
                    d[i].style.backgroundColor = "#bbb";
                }

                if (slidein[t] > x.length) {
                    slidein.splice(t, 1, 1)
                }
                x[slidein[t] - 1].style.display = "block";
                d[slidein[t] - 1].style.backgroundColor = "#2f2fa2";

            }

            //delete the last couple slidein if it is grater than slide.length

            if (slidein.length > slide.length) {
                slidein.splice(0, slide.length)
            }
            timeout = setTimeout(carousel, 5000); // Change image every 2 seconds
        }

        //start function
        carousel();
        //when user swipes left or right on the slideshow

        $(".myslidediv").swipe({

            swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                //store the slide files
                var files = $(".myslidediv");

                //allow verical scrolling
                if (direction == "up" || direction == "down") {
                    //loop through all the files and allow vertical scrolling
                    for (var i = 0; i < files.length; i++) {
                        $(files[i]).swipe('option', 'allowPageScroll', 'vertical')
                    }
                    return;
                }

                for (var s = 0; s < slide.length; s++) {
                    var d = $(slide[s]).children(".myslidediv");
                    var x = $(slide[s]).children(".dot1").children(".dot2").children(".dot");

                    if ($(d[slidein[s] - 1]).attr("src") == $(this).attr("src")) {
                        //images and videos
                        d[slidein[s] - 1].style.display = "none";
                        //dots
                        x[slidein[s] - 1].style.backgroundColor = "#bbb";

                        if (direction == "right") {

                            slidein[s]--

                            if (slidein[s] - 1 < 0) {
                                slidein.splice(s, 1, d.length)
                            }
                            if (slidein[s] > 0) {
                                d[slidein[s] - 1].style.display = "block";
                                x[slidein[s] - 1].style.backgroundColor = "#2f2fa2";
                            }

                        }

                        if (direction == "left") {

                            slidein[s]++
                            if (slidein[s] - 1 == d.length) {
                                slidein.splice(s, 1, 1)
                            }
                            if (slidein[s] > 0) {
                                d[slidein[s] - 1].style.display = "block";
                                x[slidein[s] - 1].style.backgroundColor = "#2f2fa2";
                            }
                        }

                    }
                }



            }
        })



        //when video is paused start the slide show
        $('.video').on('pause', function () {
            setTimeout(function () {
                carousel()
            }, 2000);
        });
        //when video is playing stop the slide show
        $('.video').on('play', function () {
            clearTimeout(timeout)
        });

        /*------------------------product image and video slideshow code above--------------------------*/

    }

    //function to call display the investors
    function investor(data) {

        //var to store the class of the save nad unsave investor button
        var clas;
        var txt;


        //loop through the data
        for (var d = 1; d < data.length; d++) {

            //get the users initial
            var intials = data[d].FirstName.charAt(0) + data[d].LastName.charAt(0);

            //check to see if the investor is already saved
            var x = data[0].SavedInvestors.every(element => element !== data[d]._id)

            if (x == false) {
                clas = "unsave"
                txt = "Unsave"
            }

            if (x == true) {
                clas = "save";
                txt = "Save"
            }

            //change money from number to string
            var money = data[d].Budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            $("<div class = \"investor2\" >" +
                "<div class = \"profile\" id = " + data[d]._id + " >" +
                intials +
                "</div>" +
                "<div class = \"nl\">" +
                "<div class = \"name\">" +
                "<p class = \"firstName\">" + data[d].FirstName + "</p>" +
                "<p class = \"lastName\">" + data[d].LastName + "</p>" +
                "</div>" +
                "<div class = \"loc\">" +
                "<i class=\"fa fa-map-marker\" id = \"location\"> " + data[d].City + " " + data[d].State + "</i>" +
                "</div>" +
                "</div>" +
                "<div class = \"bio\">" +
                "<p class = \"bio2\">" + data[d].Bio + "</p>" +
                "<button class = \"contact\">Contact</button>" +
                "<div class = \"rating\">" +
                "<p class = \"rating2 \">Budget " +
                "<label class = \"bdgt\" >$" + money + "</label>" +
                "</p>" +
                "<P class = " + clas + "  id =" + data[d]._id + ">" + txt + "</p>" +
                "</div>" +
                "</div>" +
                "</div>"

            ).appendTo(".investor")
        }

        //when entrepreneur clicks on the investor profile
        $(".nl").click(function () {
            var inid = $(this).parents("div")[0].children[2].children[2].children[1].id
            url = "/info/investor/" + inid

            window, open(url)
        })

        //when entrepreneur clicks contact on investor
        $(".contact").click(function () {

            $(".imgp2").css("background", "");
            document.querySelector(".imgp2").innerHTML = ""

            document.querySelector(".message1").style.display = "flex"

            var inid = $(this).parents("div")[1].children[2].children[2].children[1].id

            //get the profile image url
            var pr = $(this).parents("div")[1].children[0].style.backgroundImage;

            if (pr !== "") {
                document.querySelector(".imgp2").style.backgroundImage = pr;
            }
            else {
                $(".imgp2").html($(this).parents("div")[1].children[0].innerHTML)
            }

            $(".inid").val(inid)
            $(".enid").val(data[0]._id)

            //loop through the investors
            for (var i = 1; i < data.length; i++) {

                //find the clicked investor
                if (inid == data[i]._id) {

                    //get the investors first name
                    var fname = data[i].FirstName;

                    //get the invetors last name
                    var lname = data[i].LastName;

                    //store the investors city
                    var city = data[i].City;

                    //store the investors state
                    var state = data[i].State;

                    //display investors first and last name
                    $(".namep").html(fname + " " + lname)

                    //display investors location
                    $(".typep").html("  " + city + " " + state)

                    break;
                }
            }
        })

        //remove any messages
        $(".message").remove()
    }


    //preview satrups controller function
    app.controller("Preview2Controller", Preview2Controller);

    function Preview2Controller($http, $window, jwtHelper) {

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

        //route to see if there are investors intrested in this startup
        $http.post("/entrepreneur/investtt", {
            id: url2
        })
            .then((res) => {

                //var to store the data
                var dt = res.data

                if (dt.Investors) {
                    //loop through the investors
                    for (var i = 0; i < dt.Investors.length; i++) {

                        //fetch the investor
                        $http.post("/entrepreneur/investtt2", {
                            id: dt.Investors[i].InvId
                        })
                            .then((res) => {

                                //var to store the initials
                                var initials = res.data.FirstName[0] + " " + res.data.LastName[0]


                                //if there is data
                                if (res.data !== "none") {

                                    //route to get the profile image
                                    $http.post("api/profile2", {
                                        user: res.data.Email
                                    })
                                        .then(function (response) {

                                            var prf3
                                            var prf2
                                            if (response.data.contentType) {
                                                //store the images or video type
                                                var type = response.data.contentType
                                                type = type.split("/")
                                                type = type[1]

                                                var prf2 = response.data._id + "." + type;
                                            }

                                            if (prf2) {
                                                prf3 = "<div class = \"inv2\" id= " + prf2 + " style = \"background-image: url(../profile/" + prf2 + ")\"></div>"
                                            }
                                            else {
                                                prf3 = "<div class = \"inv2\" id= " + prf2 + ">" + initials + "</div>"
                                            }
                                            //loop through the requested products
                                            for (var p = 0; p < res.data.Requested.length; p++) {

                                                if (res.data.Requested[p].Product == url2) {

                                                    if (res.data.Requested[p].Status == "Pending") {
                                                        $("<div class = \"in\">" +
                                                            "<input type=\"hidden\" value = " + res.data._id + ">" +
                                                            prf3 +
                                                            "<div class = \"inv3\">" +
                                                            "<p class = \"dy\">" + res.data.FirstName + " " + res.data.LastName + "</p>" +
                                                            "<p class = \"iop1\">Investor</p>" +
                                                            "</div>" +
                                                            "<p class = \"iop2\">Pending investment request</p>" +
                                                            "<div class = \"bttnns\">" +
                                                            "<button class = \"acpt\">Accept</button>" +
                                                            "<button class = \"rjct\">Reject</button>" +
                                                            "</div>" +
                                                            "</div>"
                                                        ).appendTo(".pen2")
                                                    }

                                                    if (res.data.Requested[p].Status == "Accepted") {
                                                        $("<div class = \"in\">" +
                                                            "<input type=\"hidden\" value = " + res.data._id + ">" +
                                                            prf3 +
                                                            "<div class = \"inv3\">" +
                                                            "<p class = \"dy\">" + res.data.FirstName + " " + res.data.LastName + "</p>" +
                                                            "<p class = \"iop1\">Investor</p>" +
                                                            "</div>" +
                                                            "<i class=\"iop2 ioppp fa fa-check-circle\"> Accepted Investment Request</i>" +
                                                            "</div>"
                                                        ).appendTo(".pen2")
                                                    }

                                                    if (res.data.Requested[p].Status == "Rejected") {
                                                        $("<div class = \"in\">" +
                                                            "<input type=\"hidden\" value = " + res.data._id + ">" +
                                                            prf3 +
                                                            "<div class = \"inv3\">" +
                                                            "<p class = \"dy\">" + res.data.FirstName + " " + res.data.LastName + "</p>" +
                                                            "<p class = \"iop1\">Investor</p>" +
                                                            "</div>" +
                                                            "<p class = \"iop2 iiop\">Rejected investment request</p>" +
                                                            "<div class = \"bttnns\">" +
                                                            "<button class = \"unrjct\">unreject</button>" +
                                                            "</div>" +
                                                            "</div>"
                                                        ).appendTo(".pen2")
                                                    }

                                                }
                                            }

                                            //display the investors
                                            $(".pen21").show();

                                            //when user clicks unreject
                                            $(".unrjct").click(function () {

                                                //var to store the initials
                                                var int;
                                                var prf5;

                                                if ($(this).parents("div")[1].children[1].innerHTML) {
                                                    int = $(this).parents("div")[1].children[1].innerHTML
                                                    prf5 = "<div class = \"aptp\">" + int + "</div>"
                                                }
                                                else {
                                                    var br = $(this).parents("div")[1].children[1].id;
                                                    prf5 = "<div class = \"aptp\" style = \"background-image:url(../profile/" + br + ")\"></div>"
                                                }

                                                //store the neame
                                                var name = $(this).parents("div")[1].children[2].children[0].innerHTML

                                                //store the id
                                                var invid = $(this).parents("div")[1].children[0].value

                                                //store the product name
                                                var prname = $(this).parents("div")[4].children[1].innerHTML

                                                //store the product id
                                                var prid = url2

                                                $("<div class=\"accept2\">" +
                                                    prf5 +
                                                    "<div class=\"acptp\">" +
                                                    "<p class = \"dy\" >" + name + "</p>" +
                                                    "<p class = \"iop1\" >investor</p>" +
                                                    "</div>" +
                                                    "<div class=\"readd\">" +
                                                    "<p>Are you sure you want to unreject " + name + "?</p>" +
                                                    "<button class = \"ysbtn\" >Yes</button>" +
                                                    "<button class = \"nbtn\" >No</button>" +
                                                    "</div>" +
                                                    "</div>").appendTo(".accept1")

                                                //display the accept pop-up
                                                document.querySelector(".accept1").style.display = "flex"

                                                //when user clicks no
                                                $(".nbtn").click(function () {
                                                    $(".accept1").hide();
                                                    $(".accept2").remove();
                                                })

                                                //when user clicks yes
                                                $(".ysbtn").click(function () {
                                                    $(".loader2").show();
                                                    $(".accept2").remove();

                                                    //route to accept investor
                                                    $http.post("/entrepreneur/unrjct", {
                                                        invid: invid,
                                                        prid: prid,
                                                        enid: user._id,
                                                        name: prname
                                                    })
                                                        .then((res) => {
                                                            console.log(res.data)
                                                            if (res.data == "done") {
                                                                $("<div class=\"accept2\">" +
                                                                    "<p class=\"aop\"> unrejection succesful</p>" +
                                                                    "<p class = \"aop2\" >You have succesfully unrejected " + name + "</p>" +
                                                                    "<div class = \"readd\">" +
                                                                    "<button class =\"ok\">OK</button>" +
                                                                    "</div>" +
                                                                    "</div>").appendTo(".accept1")

                                                                //when user clicks ok
                                                                $(".ok").click(function () {
                                                                    location.reload();
                                                                })
                                                            }
                                                        })
                                                })
                                            })
                                            //when user clicks accept
                                            $(".acpt").click(function () {

                                                //var to store the initials
                                                var int;
                                                var prf5;

                                                if ($(this).parents("div")[1].children[1].innerHTML) {
                                                    int = $(this).parents("div")[1].children[1].innerHTML
                                                    prf5 = "<div class = \"aptp\">" + int + "</div>"
                                                }
                                                else {
                                                    var br = $(this).parents("div")[1].children[1].id;
                                                    prf5 = "<div class = \"aptp\" style = \"background-image:url(../profile/" + br + ")\"></div>"
                                                }

                                                //store the neame
                                                var name = $(this).parents("div")[1].children[2].children[0].innerHTML

                                                //store the id
                                                var invid = $(this).parents("div")[1].children[0].value

                                                //store the product name
                                                var prname = $(this).parents("div")[4].children[1].innerHTML

                                                //store the product id
                                                var prid = url2

                                                $("<div class=\"accept2\">" +
                                                    prf5 +
                                                    "<div class=\"acptp\">" +
                                                    "<p class = \"dy\" >" + name + "</p>" +
                                                    "<p class = \"iop1\" >investor</p>" +
                                                    "</div>" +
                                                    "<div class=\"readd\">" +
                                                    "<p>Are you sure you want " + name + " as your investor?</p>" +
                                                    "<button class = \"ysbtn\" >Yes</button>" +
                                                    "<button class = \"nbtn\" >No</button>" +
                                                    "</div>" +
                                                    "</div>").appendTo(".accept1")

                                                //display the accept pop-up
                                                document.querySelector(".accept1").style.display = "flex"

                                                //when user clicks no
                                                $(".nbtn").click(function () {
                                                    $(".accept1").hide();
                                                    $(".accept2").remove();
                                                })

                                                //when user clicks yes
                                                $(".ysbtn").click(function () {
                                                    $(".loader2").show();
                                                    $(".accept2").remove();

                                                    //route to accept investor
                                                    $http.post("/entrepreneur/accept", {
                                                        invid: invid,
                                                        prid: prid,
                                                        enid: user._id,
                                                        name: prname
                                                    })
                                                        .then((res) => {
                                                            console.log(res.data)
                                                            if (res.data == "done") {
                                                                $("<div class=\"accept2\">" +
                                                                    "<i class=\"aop fa fa-check-circle\"> Investment Request Accepted</i>" +
                                                                    "<p class = \"aop2\" >Congratulations on accepting " + name + " as your investor. You now need to follow up with the investor and find out how they will make the investment. We do not process any investment transactions, all we do is help your startup connect with potential investors.</p>" +
                                                                    "<div class = \"readd\">" +
                                                                    "<button class =\"ok\">OK</button>" +
                                                                    "</div>" +
                                                                    "</div>").appendTo(".accept1")

                                                                //when user clicks ok
                                                                $(".ok").click(function () {
                                                                    location.reload();
                                                                })
                                                            }
                                                        })
                                                })
                                            })

                                            //when user clicks reject
                                            $(".rjct").click(function () {
                                                //var to store the initials
                                                var int;
                                                var prf5;

                                                if ($(this).parents("div")[1].children[1].innerHTML) {
                                                    int = $(this).parents("div")[1].children[1].innerHTML
                                                    prf5 = "<div class = \"aptp\">" + int + "</div>"
                                                }
                                                else {
                                                    var br = $(this).parents("div")[1].children[1].id;
                                                    prf5 = "<div class = \"aptp\" style = \"background-image:url(../profile/" + br + ")\"></div>"
                                                }

                                                //store the neame
                                                var name = $(this).parents("div")[1].children[2].children[0].innerHTML

                                                //store the id
                                                var invid = $(this).parents("div")[1].children[0].value

                                                //store the product name
                                                var prname = $(this).parents("div")[4].children[1].innerHTML

                                                //store the product id
                                                var prid = url2

                                                $("<div class=\"accept2\">" +
                                                    prf5 +
                                                    "<div class=\"acptp\">" +
                                                    "<p class = \"dy\" >" + name + "</p>" +
                                                    "<p class = \"iop1\" >investor</p>" +
                                                    "</div>" +
                                                    "<div class=\"readd\">" +
                                                    "<p>Are you sure you want to reject " + name + "s investment request?</p>" +
                                                    "<button class = \"ysbtn\" >Yes</button>" +
                                                    "<button class = \"nbtn\" >No</button>" +
                                                    "</div>" +
                                                    "</div>").appendTo(".accept1")

                                                //display the accept pop-up
                                                document.querySelector(".accept1").style.display = "flex"

                                                //when user clicks no
                                                $(".nbtn").click(function () {
                                                    $(".accept1").hide();
                                                    $(".accept2").remove();
                                                })


                                                $(".ysbtn").click(function () {
                                                    console.log("c;ocle")
                                                    $(".loader2").show();
                                                    $(".accept2").remove();

                                                    //route to accept investor
                                                    $http.post("/entrepreneur/rejct", {
                                                        invid: invid,
                                                        prid: prid,
                                                        enid: user._id,
                                                        name: prname
                                                    })
                                                        .then((res) => {
                                                            if (res.data == "done") {
                                                                $("<div class=\"accept2\">" +
                                                                    "<p class=\"aopp2\"> Investment Request Rejected</p>" +
                                                                    "<p class = \"aop2\" >You have rejected " + name + " as your startups potential investor. </p>" +
                                                                    "<div class = \"readd\">" +
                                                                    "<button class =\"ok\">OK</button>" +
                                                                    "</div>" +
                                                                    "</div>").appendTo(".accept1")

                                                                //when user clicks ok
                                                                $(".ok").click(function () {
                                                                    location.reload();
                                                                })
                                                            }
                                                        })
                                                })
                                            })
                                        });
                                }

                            })
                    }
                }
            })

        $http.post("/investor/preview", {
            id: url2,
            email: "startup"
        })
            .then((res) => {

                $(".container2").hide();

                $(".nostp").hide();

                if (res.data[2] == null) {
                    $(".descript1").hide();
                    $(".pen2").hide();
                    $(".owner").hide();
                    $(".nostp").show();
                    return;
                }
                //save the id of the product
                $(".idem").prop("id", res.data[2]._id);

                //save the email of the product
                $(".idem").val(res.data[2].Entrepreneur_Email)

                //change money from number to string
                var money = res.data[2].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                //display the name of the startup
                vm.name = res.data[2].Startup_Name;

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

                //dislay what this startup does
                vm.description = res.data[2].Startup_Description;

                //display startup location
                vm.city = res.data[2].Startup_Location.City;
                vm.state = res.data[2].Startup_Location.State;

                //to display the second description
                if (res.data[2].Startup_Description2) {
                    vm.subtitle = "Utilization of the investment."
                    vm.description2 = res.data[2].Startup_Description2

                }

                //if there is a percent offer
                if (res.data[2].Startup_Percent_Offer) {

                    $("<p class = \"offer offer2\">Needed Investment: USD " + money + " for " + res.data[2].Startup_Percent_Offer + " stake</p>").appendTo(".price")
                }

                //if their isnt a percent offer
                if (!res.data[2].Startup_Percent_Offer) {
                    $("<p class = \"offer offer2\">Needed Investment: USD " + money + " </p>").appendTo(".price")
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

                        //owners name
                        vm.name2 = res.data.FirstName + " " + res.data.LastName;

                        //initials
                        var init = res.data.FirstName[0] + " " + res.data.LastName[0];

                        $(".pr").html(init)
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

    //saved investors controller
    app.controller("SavedController", SavedController);
    function SavedController($http, $window, jwtHelper) {

        var vm = this;

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        //send to client users first name
        vm.email = user.Email;

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        //to track if divdropnav is opened
        var opened = false;

        //to track if bell icon is clicked
        var notificationBell = false;

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

        //when user clicks close on the message pop-up
        $(".close").click(function () {
            $(".message1").hide();
            //empty the txt
            $("#txt").val("")
            //hide the error if any
            $(".error").hide();
            $(".insert1").hide();
            $(".stp").remove();
            $(".link23").hide();
        });

        $(".iop").click(function () {
            $(".message3").hide();
            $(".message1").hide();
        })
        //when user clicks insert
        $(".insert").click(function () {

            if ($(".insert1").is(":hidden")) {
                $(".insert1").show();
            }
            else {
                $(".insert1").hide();
            }

            $(".st").remove();
            //route to get the startups 
            $http.post("entrepreneur/insert", {
                email: user.Email
            })
                .then((res) => {

                    //loop through the data
                    for (var i = 0; i < res.data.length; i++) {

                        $("<div class = \"st\">" +
                            "<input type = \"hidden\" value=" + res.data[i]._id + ">" +
                            "<p class = \"pk1\">" + res.data[i].Startup_Name + "</p>" +
                            "</div>"
                        ).appendTo(".insert1")
                    }

                    //when user clicks startup in insert
                    $(".pk1").click(function () {
                        $(".insert1").hide();
                        var id = $(this).parent("div")[0].children[0].value;
                        var name = $(this).parent("div")[0].children[1].innerHTML
                        $("<a class = \"stp\" target = \"_blank\" href = \"preview2/" + id + "\" id=\"" + id + "/" + name + "\">" + name + "</a>"
                        ).appendTo(".link23")
                        $(".link23").show()
                    })
                })

        })

        //when user clicks send
        $(".send").click(function () {


            if (user.Subscription == "inactive") {
                $(".message2").hide();
                document.querySelector(".subpop").style.display = "flex";
                $(".subpop2").html("Contact Investors")
                $(".subpop3").html("dont wait for investors to find you, reach out to them.")
                return;
            }

            //if user subscription is past due
            if (user.Subscription == "past_due") {
                document.querySelector(".subpop").style.display = "flex";
                $(".subpop2").html("Past due")
                $(".subpop3").html("Your subscription is past due. Don't let this potential investor slip away.")
                return;
            }

            else {
                //store invetors id
                var invid = $(".inid").val()

                //store the entrepreneur id
                var enid = $(".enid").val();

                //store the entrepreneurs message
                var msg = $("#txt").val()

                //check if the investor has a message
                if (msg) {

                    //if there are links get the links
                    if ($(".stp")) {

                        //array to store the links
                        var lin = [];

                        //if there are multiple linke
                        if ($(".stp").length > 1) {

                            //loop through the links
                            for (var i = 0; i < $(".stp").length; i++) {
                                lin.push(document.getElementsByClassName("stp")[i].id)
                            }
                        }
                        else {
                            lin.push($(".stp").attr("id"))
                        }

                    }

                    $http.post("entrepreneur/msg", {
                        inid: invid,
                        enid: enid,
                        msg: msg,
                        link: lin,
                        type: "regular"
                    })
                        .then((res) => {
                            $(".message2").hide();
                            $(".message3").show();
                        })
                }
                else {
                    $(".error").show();
                }
            }

        })

        //post function to get the saved investors
        $http.post("/entrepreneur/savedInvestors", {
            email: user.Email
        })
            .then((res) => {


                //var to store the data
                var data = res.data

                //hide the loading cirlce
                $(".loader").hide();

                //if there is no data
                if (res.data == "none") {
                    return;
                }

                //if there is data
                if (res.data !== "none") {

                    $(".inv1").hide();

                    function inve() {
                        //loop through the data
                        for (var d = 0; d < data.length; d++) {

                            //get the users initial
                            var intials = data[d].FirstName.charAt(0) + data[d].LastName.charAt(0);

                            //change money from number to string
                            var money = data[d].Budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            //var profileImage = $('.logo2').text(intials);
                            $("<div class = \"investor2\" >" +
                                "<div class = \"profile\" id = " + data[d]._id + ">" +
                                intials +
                                "</div>" +
                                "<div class = \"nl\">" +
                                "<div class = \"name\">" +
                                "<p class = \"firstName\">" + data[d].FirstName + "</p>" +
                                "<p class = \"lastName\">" + data[d].LastName + "</p>" +
                                "</div>" +
                                "<div class = \"loc\">" +
                                "<i class=\"location fa fa-map-marker\"> " + data[d].City + " " + data[d].State + "</i>" +
                                "</div>" +
                                "</div>" +
                                "<div class = \"bio\">" +
                                "<p class = \"bio2\">" + data[d].Bio + "</p>" +
                                "<button class = \"contact\">Contact</button>" +
                                "<div class = \"rating\">" +
                                "<p class = \"rating2 \">Budget " +
                                "<label class = \"bdgt\" >$" + money + "</label>" +
                                "</p>" +
                                "<P class = \"unsave\" id=" + data[d]._id + ">Unsave Investor</p>" +
                                "</div>" +
                                "</div>" +
                                "</div>"

                            ).appendTo(".investor")

                        }

                        //when entrepreneur clicks on the investor profile
                        $(".nl").click(function () {
                            var inid = $(this).parents("div")[0].children[2].children[2].children[1].id
                            url = "/info/investor/" + inid

                            window, open(url)
                        })

                        //when entrepreneur clicks contact on investor
                        $(".contact").click(function () {

                            $(".imgp2").css("background", "");
                            document.querySelector(".imgp2").innerHTML = ""

                            document.querySelector(".message1").style.display = "flex"

                            var inid = $(this).parents("div")[1].children[2].children[2].children[1].id

                            //get the profile image url
                            var pr = $(this).parents("div")[1].children[0].style.backgroundImage;


                            if (pr !== "") {
                                document.querySelector(".imgp2").style.backgroundImage = pr;
                            }
                            else {
                                $(".imgp2").html($(this).parents("div")[1].children[0].innerHTML)
                            }


                            $(".inid").val(inid)
                            $(".enid").val(user._id)

                            //loop through the investors
                            for (var i = 0; i < data.length; i++) {

                                //find the clicked investor
                                if (inid == data[i]._id) {

                                    //get the investors first name
                                    var fname = data[i].FirstName;

                                    //get the invetors last name
                                    var lname = data[i].LastName;

                                    //store the investors city
                                    var city = data[i].City;

                                    //store the investors state
                                    var state = data[i].State;

                                    //display investors first and last name
                                    $(".namep").html(fname + " " + lname)

                                    //display investors location
                                    $(".typep").html("  " + city + " " + state)

                                    break;
                                }
                            }
                        })

                        //remove any messages
                        $(".message").remove()
                    }

                    async function profile() {

                        const result = await inve();

                        //loop through the data
                        for (var p = 0; p < data.length; p++) {

                            //post function to get the users profile picture
                            (function (data) {

                                var idd = data._id

                                $http.post("api/profile", {
                                    user: data.Email,
                                })
                                    .then(function (response) {

                                        //if there is data
                                        if (response.data !== "none") {

                                            //remove the txt element inside the div
                                            $('#' + idd).contents().filter(function () {
                                                return this.nodeType === 3;
                                            }).remove();

                                            //image file
                                            document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                        }
                                    })
                            }(data[p]));
                        }
                    }

                    profile();
                }

                //when user clicks unsave
                $(".unsave").click(function () {

                    //div holding the investor
                    var id2 = $(this).parents("div")[2]

                    //variable to save id of the investor being removed
                    var id = $(this).attr('id');

                    //route to unsave an investor
                    $http.post("/entrepreneur/unsaveInvestor", {
                        id: id,
                        email: user.Email
                    })
                        .then((res) => {

                            //if saved
                            if (res.data == "saved") {
                                location.href = "/savedinvestors"
                            }
                            else {
                                location.href = "/savedinvestors"
                            }
                        })
                })
            })

        //route to check for messages / notifications
        $http.post("entrepreneur/not", {
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
    }

    //find investors controller
    app.controller("InvestorsController", InvestorsController);
    function InvestorsController($http, $window, jwtHelper) {

        /*document.querySelector(".launch2").style.display = "block"
        $(".investors").hide();*/
        var vm = this;

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        //send to client users first name
        vm.email = user.Email;

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        //to track if divdropnav is opened
        var opened = false;

        //to track if bell icon is clicked
        var notificationBell = false;

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


        //when user clicks close on the message pop-up
        $(".close").click(function () {
            $(".message1").hide();
            //empty the txt
            $("#txt").val("")
            //hide the error if any
            $(".error").hide();
            $(".insert1").hide();
            $(".stp").remove();
            $(".link23").hide();
        });

        $(".iop").click(function () {
            $(".message3").hide();
            $(".message1").hide();
        })
        //when user clicks insert
        $(".insert").click(function () {

            if ($(".insert1").is(":hidden")) {
                $(".insert1").show();
            }
            else {
                $(".insert1").hide();
            }

            $(".st").remove();
            //route to get the startups 
            $http.post("entrepreneur/insert", {
                email: user.Email
            })
                .then((res) => {

                    //loop through the data
                    for (var i = 0; i < res.data.length; i++) {

                        $("<div class = \"st\">" +
                            "<input type = \"hidden\" value=" + res.data[i]._id + ">" +
                            "<p class = \"pk1\">" + res.data[i].Startup_Name + "</p>" +
                            "</div>"
                        ).appendTo(".insert1")
                    }

                    //when user clicks startup in insert
                    $(".pk1").click(function () {
                        $(".insert1").hide();
                        var id = $(this).parent("div")[0].children[0].value;
                        var name = $(this).parent("div")[0].children[1].innerHTML
                        $("<a class = \"stp\" target = \"_blank\" href = \"preview2/" + id + "\" id=\"" + id + "/" + name + "\">" + name + "</a>"
                        ).appendTo(".link23")
                        $(".link23").show()
                    })
                })

        })
        //when user clicks send
        $(".send").click(function () {


            if (user.Subscription == "inactive") {
                $(".message2").hide();
                document.querySelector(".subpop").style.display = "flex";
                $(".subpop2").html("Contact Investors")
                $(".subpop3").html("dont wait for investors to find you, reach out to them.")
                return;
            }

            //if user subscription is past due
            if (user.Subscription == "past_due") {
                document.querySelector(".subpop").style.display = "flex";
                $(".subpop2").html("Past due")
                $(".subpop3").html("Your subscription is past due. Don't let this potential investor slip away.")
                return;
            }

            else {
                //store invetors id
                var invid = $(".inid").val()

                //store the investors id
                var enid = $(".enid").val();

                //store the entrepreneurs message
                var msg = $("#txt").val()

                //check if the investor has a message
                if (msg) {

                    //if there are links get the links
                    if ($(".stp")) {

                        //array to store the links
                        var lin = [];

                        //if there are multiple linke
                        if ($(".stp").length > 1) {

                            //loop through the links
                            for (var i = 0; i < $(".stp").length; i++) {
                                lin.push(document.getElementsByClassName("stp")[i].id)
                            }
                        }
                        else {
                            lin.push($(".stp").attr("id"))
                        }

                    }

                    $http.post("entrepreneur/msg", {
                        inid: invid,
                        enid: enid,
                        msg: msg,
                        link: lin,
                        type: "regular"
                    })
                        .then((res) => {
                            $(".message2").hide();
                            $(".message3").show();
                        })
                }
                else {
                    $(".error").show();
                }
            }

        })

        //when user clicks their profile picture on the navigation bar
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


        //when user clicks the select distance drop down
        $("select#in2").change(function () {

            //remove the previous investors
            $('.investor2').remove();

            //remove message
            $(".message").remove();

            //show the loader
            $(".loader").show();

            var mile = $("select#in2").val();
            var lat = user.lat;
            var long = user.long;

            var ind = $("#ijf2").text().toLowerCase();

            //store the selected industries
            var ind2 = []
            var obj = {};

            //split the industries
            if (ind.includes(":")) {

                ind = ind.split(":")

                //set the title and the subtitle of the industries
                ind3 = $("#ijf2").text()
                ind3 = ind3.split(":")
                ind3 = ind3[0]
                ind3 = ind3.replace(/([A-Z])/g, ' $1').trim()
                ind3 = ind3.toLowerCase();
                obj["title"] = ind3;
                obj["subtitle"] = ind[1]
                //push the industries on the ind2 variable
                ind2.push(obj)
            }

            else {
                ind = $("#ijf2").text()
                ind = ind.replace(/([A-Z])/g, ' $1').trim()
                ind = ind.toLowerCase();
                //push the industries on the ind2 variable
                ind2.push(ind)
            }

            $http.post("entrepreneur/filinvestor", {
                ind: ind2,
                email: user.Email,
            })
                .then(function (response) {

                    var data = response.data;
                    var data2 = response.data;

                    //remove the loader
                    $(".loader").hide();

                    //if mileis any
                    if (mile == "any") {
                        async function profile() {

                            const result = await investor(data2);

                            //loop through the data
                            for (var p = 1; p < data2.length; p++) {

                                //post function to get the users profile picture
                                (function (data) {

                                    var idd = data._id

                                    $http.post("api/profile", {
                                        user: data.Email,
                                    })
                                        .then(function (response) {
                                            if (response.data !== "none") {

                                                //remove the txt element inside the div
                                                $('#' + idd).contents().filter(function () {
                                                    return this.nodeType === 3;
                                                }).remove();

                                                //image file
                                                document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                            }
                                        })
                                }(data2[p]));
                            }
                        }

                        profile();
                        return;
                    }

                    //if entrepreneur chooses the any category on industry
                    if (ind2 == "any") {

                        //var array to store if there is data
                        var datacheck = [];

                        //loop through the data
                        for (var i = 1; i < data.length; i++) {

                            var origin1 = new google.maps.LatLng(lat, long);
                            var destinationB = new google.maps.LatLng(data[i].lat, data[i].long);


                            (function (data) {
                                var data2 = [];
                                data2.push(response.data[0])

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

                                    //check to see if investor is within distance
                                    if (distanceMiles <= mile) {
                                        data2.push(data)
                                        datacheck.push(data)
                                        async function profile() {
                                            const result = await investor(data2);

                                            //loop through the data
                                            for (var p = 1; p < data2.length; p++) {

                                                //post function to get the users profile picture
                                                (function (data) {

                                                    var idd = data._id

                                                    $http.post("api/profile", {
                                                        user: data.Email,
                                                    })
                                                        .then(function (response) {
                                                            if (response.data !== "none") {

                                                                //remove the txt element inside the div
                                                                $('#' + idd).contents().filter(function () {
                                                                    return this.nodeType === 3;
                                                                }).remove();

                                                                //image file
                                                                document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                                            }
                                                        })
                                                }(data2[p]));
                                            }
                                        }

                                        profile();
                                    }
                                }
                            }(data[i]))
                        }

                        setTimeout(() => {

                            if (datacheck.length < 1) {
                                $("<p class = \"message\" >I can't find investors matching your search right now.</p>").appendTo(".container1");
                            }
                        }, 500)

                        return;
                    } else {
                        processArray(data)
                        async function processArray(data) {
                            //var to store the data
                            var checkedData = [];
                            //loop through the data
                            for (var t = 0; t < data.length; t++) {

                                if (data[t].Industry) {
                                    //check if titles match
                                    var x
                                    if (ind2[0].title !== undefined) {
                                        x = data[t].Industry.every(e => e.title !== ind2[0].title)

                                        if (x == false) {
                                            checkedData.push(data[t])
                                        }
                                    }
                                    else {
                                        var f = data[t].Industry.every(e => e.title !== ind2[0])

                                        if (f == false) {
                                            checkedData.push(data[t])
                                        }
                                    }
                                }
                            }

                            //var array to store if there is data
                            var datacheck = [];

                            //loop through check data
                            for (var p = 0; p < checkedData.length; p++) {

                                var origin1 = new google.maps.LatLng(lat, long);
                                var destinationB = new google.maps.LatLng(checkedData[p].lat, checkedData[p].long);


                                (function (data) {
                                    var data2 = [];
                                    data2.push(response.data[0])

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

                                        //check to see if investor is within distance
                                        if (distanceMiles <= mile) {
                                            data2.push(data)
                                            datacheck.push(data)
                                            async function profile() {

                                                const result = await investor(data2);

                                                //loop through the data
                                                for (var x = 1; x < data2.length; x++) {

                                                    //post function to get the users profile picture
                                                    (function (data) {

                                                        var idd = data._id

                                                        $http.post("api/profile", {
                                                            user: data.Email,
                                                        })
                                                            .then(function (response) {
                                                                if (response.data !== "none") {

                                                                    //remove the txt element inside the div
                                                                    $('#' + idd).contents().filter(function () {
                                                                        return this.nodeType === 3;
                                                                    }).remove();

                                                                    //image file
                                                                    document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                                                }
                                                            })
                                                    }(data2[x]));
                                                }
                                            }

                                            profile();
                                        }
                                    }
                                }(checkedData[p]))
                            }

                            setTimeout(() => {

                                if (datacheck.length < 1) {
                                    $("<p class = \"message\" >I can't find investors matching your search right now.</p>").appendTo(".container1");
                                }
                            }, 500)
                        }
                    }

                });


        });

        var x = document.getElementById("in1");

        //when user clicks industries
        $("#ijf2").click(function () {

            if (window.getComputedStyle(x).display === "none") {
                document.getElementById("in1").style.display = "block";
            }

            else {
                document.getElementById("in1").style.display = "none";
                $(".subtitle").hide();

                //set the distance back to any distance
                $("#in2").val("any")

                //remove all the previous investors
                $(".investor2").remove();

                //show the loading cirlce
                $(".loader").show()

                var ind = $("#ijf2").text().toLowerCase();

                //store the selected industries
                var ind2 = []
                var obj = {};

                //split the industries
                if (ind.includes(":")) {

                    ind = ind.split(":")

                    //set the title and the subtitle of the industries
                    ind3 = $("#ijf2").text()
                    ind3 = ind3.split(":")
                    ind3 = ind3[0]
                    ind3 = ind3.replace(/([A-Z])/g, ' $1').trim()
                    ind3 = ind3.toLowerCase();
                    obj["title"] = ind3;
                    obj["subtitle"] = ind[1]
                    //push the industries on the ind2 variable
                    ind2.push(obj)
                }

                else if (ind == "any") {
                    ind = ind
                    //push the industries on the ind2 variable
                    ind2.push(ind)
                }

                else {
                    ind = $("#ijf2").text()
                    ind = ind.replace(/([A-Z])/g, ' $1').trim()
                    ind = ind.toLowerCase();
                    obj["title"] = ind;
                    //push the industries on the ind2 variable
                    ind2.push(obj)
                }


                $http.post("entrepreneur/filinvestor", {
                    ind: ind2,
                    email: user.Email,
                })
                    .then(function (response) {

                        //hide the loader
                        $(".loader").hide();

                        //var to store the data
                        var data = response.data

                        //call the investor function
                        async function profile() {

                            const result = await investor(data);

                            //loop through the data
                            for (var p = 1; p < data.length; p++) {

                                //post function to get the users profile picture
                                (function (data) {

                                    var idd = data._id

                                    $http.post("api/profile", {
                                        user: data.Email,
                                    })
                                        .then(function (response) {
                                            if (response.data !== "none") {

                                                //remove the txt element inside the div
                                                $('#' + idd).contents().filter(function () {
                                                    return this.nodeType === 3;
                                                }).remove();

                                                //image file
                                                document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                            }
                                        })
                                }(data[p]));
                            }
                        }

                        profile();

                        //when user clicks save investor
                        $(".save").click(function () {

                            var txt = $(this)
                            var id = $(this).attr('id')

                            $http.post("/entrepreneur/save", {
                                id: id,
                                EntrepreneurEmail: user.Email
                            })
                                .then((res) => {

                                    //if saved
                                    if (res.data == "saved") {
                                        txt.html("Unsave Investor")

                                        //remove the save class and add the unsave class
                                        txt.removeClass('save').addClass("unsave")
                                    }
                                    else {
                                        location.href = "/findinvestors"
                                    }
                                })
                        })

                        $(".unsave").click(function () {

                            var id2 = $(this)

                            //variable to save id of the investor being removed
                            var id = $(this).attr('id');

                            //route to unsave an investor
                            $http.post("/entrepreneur/unsaveInvestor", {
                                id: id,
                                email: user.Email
                            })
                                .then((res) => {

                                    //if saved
                                    if (res.data == "saved") {
                                        id2.removeClass("unsave").addClass("save")
                                        id2.html("Save Investor")
                                    }
                                    else {
                                        location.href = "/savedinvestors"
                                    }
                                })
                        })
                    })
            }
        })

        //when user clicks any
        $(".any").click(function () {
            $("#ijf2").html("Any<i class=\"fa fa-angle-down\" id = \"arrow\"></i>")
            document.getElementById("in1").style.display = "none";

            //remove all the previous investors
            $(".investor2").remove();

            //set the distance back to any distance
            $("#in2").val("any")

            //show the loading cirlce
            $(".loader").show()

            var ind = "none";
            var mile = $("#in2").val().toLowerCase();

            //store the selected industries
            var ind2 = []

            ind = "none"
            //push the industries on the ind2 variable
            ind2.push(ind)


            $http.post("entrepreneur/filinvestor", {
                ind: ind2,
                distance: mile,
                email: user.Email,
            })
                .then(function (res) {

                    //hide the loader
                    $(".loader").hide();

                    //var to store the data
                    var data = res.data

                    //call the investor function
                    async function profile() {

                        const result = await investor(data);

                        //loop through the data
                        for (var p = 1; p < data.length; p++) {

                            //post function to get the users profile picture
                            (function (data) {

                                var idd = data._id

                                $http.post("api/profile", {
                                    user: data.Email,
                                })
                                    .then(function (response) {
                                        if (response.data !== "none") {

                                            //remove the txt element inside the div
                                            $('#' + idd).contents().filter(function () {
                                                return this.nodeType === 3;
                                            }).remove();

                                            //image file
                                            document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                        }
                                    })
                            }(data[p]));
                        }
                    }

                    profile();

                    //when user clicks save investor
                    $(".save").click(function () {

                        var txt = $(this)
                        var id = $(this).attr('id')

                        $http.post("/entrepreneur/save", {
                            id: id,
                            EntrepreneurEmail: user.Email
                        })
                            .then((res) => {

                                //if saved
                                if (res.data == "saved") {
                                    txt.html("Unsave Investor")

                                    //remove the save class and add the unsave class
                                    txt.removeClass('save').addClass("unsave")
                                }
                                else {
                                    location.href = "/findinvestors"
                                }
                            })
                    })

                    $(".unsave").click(function () {



                        var id2 = $(this)

                        //variable to save id of the investor being removed
                        var id = $(this).attr('id');

                        //route to unsave an investor
                        $http.post("/entrepreneur/unsaveInvestor", {
                            id: id,
                            email: user.Email
                        })
                            .then((res) => {

                                //if saved
                                if (res.data == "saved") {
                                    id2.removeClass("unsave").addClass("save")
                                    id2.html("Save Investor")
                                }
                                else {
                                    location.href = "/savedinvestors"
                                }
                            })
                    })
                })

        })

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

                //when user cliks subtitle
                $(".sub").click(function () {
                    var sub = $(this)[0].innerHTML;
                    var title2 = title.split(" ").join("")

                    //set the distance back to any distance
                    $("#in2").val("any")

                    //remove all the previous investors
                    $(".investor2").remove();

                    //show the loading cirlce
                    $(".loader").show()

                    $("#ijf2").html(title2 + ":" + sub + "<i class=\"fa fa-angle-down\" id=\"arrow\"></i>");
                    $(".subtitle").hide();
                    $("#in1").hide();

                    var ind = $("#ijf2").text().toLowerCase();
                    var mile = $("#in2").val().toLowerCase();

                    //store the selected industries
                    var ind2 = []
                    var obj = {};

                    //split the industries
                    if (ind.includes(":")) {

                        ind = ind.split(":")

                        //set the title and the subtitle of the industries
                        ind3 = $("#ijf2").text()
                        ind3 = ind3.split(":")
                        ind3 = ind3[0]
                        ind3 = ind3.replace(/([A-Z])/g, ' $1').trim()
                        ind3 = ind3.toLowerCase();
                        obj["title"] = ind3;
                        obj["subtitle"] = ind[1]
                        //push the industries on the ind2 variable
                        ind2.push(obj)
                    }

                    else {
                        ind = "none"
                        //push the industries on the ind2 variable
                        ind2.push(ind)
                    }

                    //get the investor
                    $http.post("entrepreneur/filinvestor", {
                        ind: ind2,
                        distance: mile,
                        email: user.Email,
                    })
                        .then(function (res) {

                            //hide the loader
                            $(".loader").hide();

                            //var to store the data
                            var data = res.data

                            //call the investor function
                            async function profile() {

                                const result = await investor(data);

                                //loop through the data
                                for (var p = 1; p < data.length; p++) {

                                    //post function to get the users profile picture
                                    (function (data) {

                                        var idd = data._id

                                        $http.post("api/profile", {
                                            user: data.Email,
                                        })
                                            .then(function (response) {
                                                if (response.data !== "none") {

                                                    //remove the txt element inside the div
                                                    $('#' + idd).contents().filter(function () {
                                                        return this.nodeType === 3;
                                                    }).remove();

                                                    //image file
                                                    document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                                }
                                            })
                                    }(data[p]));
                                }

                                //when user clicks save investor
                                $(".save").click(function () {
                                    console.log("oijh")
                                    var txt = $(this)
                                    var id = $(this).attr('id')

                                    $http.post("/entrepreneur/save", {
                                        id: id,
                                        EntrepreneurEmail: user.Email
                                    })
                                        .then((res) => {

                                            //if saved
                                            if (res.data == "saved") {
                                                txt.html("Unsave Investor")

                                                //remove the save class and add the unsave class
                                                txt.removeClass('save').addClass("unsave")
                                            }
                                            else {
                                                location.href = "/findinvestors"
                                            }
                                        })
                                })

                                $(".unsave").click(function () {

                                    var id2 = $(this)

                                    //variable to save id of the investor being removed
                                    var id = $(this).attr('id');

                                    //route to unsave an investor
                                    $http.post("/entrepreneur/unsaveInvestor", {
                                        id: id,
                                        email: user.Email
                                    })
                                        .then((res) => {

                                            //if saved
                                            if (res.data == "saved") {
                                                id2.removeClass("unsave").addClass("save")
                                                id2.html("Save Investor")
                                            }
                                            else {
                                                location.href = "/savedinvestors"
                                            }
                                        })
                                })
                            }
                            profile()
                        })

                })

                //when user clicks the title
                $(".radio2").click(function () {

                    $(".subtitle").hide();

                    //store the title
                    title = $(this)[0].innerHTML;
                    var title2 = title.split(" ").join("")
                    var subdiv = $(this).parent("div")[0].children[1]

                    $("#ijf2").html(title2 + "<i class=\"fa fa-angle-down\" id=\"arrow\"></i>")

                    //check to see if there is a subtitle
                    if (subdiv) {
                        $(subdiv).show()
                    }
                    else {

                        //set the distance back to any distance
                        $("#in2").val("any")

                        //remove all the previous investors
                        $(".investor2").remove();

                        //show the loading cirlce
                        $(".loader").show()

                        $("#in1").hide();

                        var ind = $("#ijf2").text().toLowerCase();
                        var mile = $("#in2").val().toLowerCase();

                        //store the selected industries
                        var ind2 = []
                        var obj = {};

                        //split the industries
                        if (ind.includes(":")) {

                            ind = ind.split(":")

                            //set the title and the subtitle of the industries
                            var ind3 = ind[0].replace(/([A-Z])/g, ' $1').trim()
                            ind3 = ind3.toLowerCase();
                            obj["title"] = ind3
                            obj["subtitle"] = ind[1]
                            //push the industries on the ind2 variable
                            ind2.push(obj)
                        }

                        else {
                            ind = "none"
                            //push the industries on the ind2 variable
                            ind2.push(ind)
                        }

                        //get the investor
                        $http.post("entrepreneur/filinvestor", {
                            ind: ind2,
                            distance: mile,
                            email: user.Email
                        })
                            .then(function (res) {

                                //hide the loader
                                $(".loader").hide();

                                //var to store the data
                                var data = res.data

                                //call the investor function
                                async function profile() {

                                    const result = await investor(data);

                                    //loop through the data
                                    for (var p = 1; p < data.length; p++) {

                                        //post function to get the users profile picture
                                        (function (data) {

                                            var idd = data._id

                                            $http.post("api/profile", {
                                                user: data.Email,
                                            })
                                                .then(function (response) {
                                                    if (response.data !== "none") {

                                                        //remove the txt element inside the div
                                                        $('#' + idd).contents().filter(function () {
                                                            return this.nodeType === 3;
                                                        }).remove();

                                                        //image file
                                                        document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                                    }
                                                })
                                        }(data[p]));
                                    }
                                }

                                profile();

                                //when user clicks save investor
                                $(".save").click(function () {

                                    var txt = $(this)
                                    var id = $(this).attr('id')

                                    $http.post("/entrepreneur/save", {
                                        id: id,
                                        EntrepreneurEmail: user.Email
                                    })
                                        .then((res) => {

                                            //if saved
                                            if (res.data == "saved") {
                                                txt.html("Unsave Investor")

                                                //remove the save class and add the unsave class
                                                txt.removeClass('save').addClass("unsave")
                                            }
                                            else {
                                                location.href = "/findinvestors"
                                            }
                                        })
                                })

                                $(".unsave").click(function () {

                                    var id2 = $(this)

                                    //variable to save id of the investor being removed
                                    var id = $(this).attr('id');

                                    //route to unsave an investor
                                    $http.post("/entrepreneur/unsaveInvestor", {
                                        id: id,
                                        email: user.Email
                                    })
                                        .then((res) => {

                                            //if saved
                                            if (res.data == "saved") {
                                                id2.removeClass("unsave").addClass("save")
                                                id2.html("Save Investor")
                                            }
                                            else {
                                                location.href = "/savedinvestors"
                                            }
                                        })
                                })
                            })
                    }


                })
            });


        //get the users product industry type
        $http.post("entrepreneur/prind", {
            email: user.Email,
        })
            .then(function (res) {

                var data = res.data

                //get the investors
                $http.post("entrepreneur/filinvestor", {
                    ind: data,
                    email: user.Email
                })
                    .then((res) => {

                        //hide the loader
                        $(".loader").hide();

                        //var to store the data
                        var data = res.data


                        async function profile() {

                            const result = await investor(data);

                            //loop through the data
                            for (var p = 1; p < data.length; p++) {

                                //post function to get the users profile picture
                                (function (data) {

                                    var idd = data._id

                                    $http.post("api/profile", {
                                        user: data.Email,
                                    })
                                        .then(function (response) {
                                            if (response.data !== "none") {

                                                //remove the txt element inside the div
                                                $('#' + idd).contents().filter(function () {
                                                    return this.nodeType === 3;
                                                }).remove();

                                                //image file
                                                document.getElementById(idd).style.backgroundImage = 'url(../profile/' + response.data + ')';
                                            }
                                        })
                                }(data[p]));
                            }
                        }

                        profile();
                        //when user clicks save investor
                        $(".save").click(function () {

                            var txt = $(this)
                            var id = $(this).attr('id')

                            $http.post("/entrepreneur/save", {
                                id: id,
                                EntrepreneurEmail: user.Email
                            })
                                .then((res) => {

                                    //if saved
                                    if (res.data == "saved") {
                                        txt.html("Unsave Investor")

                                        //remove the save class and add the unsave class
                                        txt.removeClass('save').addClass("unsave")
                                    }
                                    else {
                                        location.href = "/findinvestors"
                                    }
                                })
                        })

                        $(".unsave").click(function () {

                            var id2 = $(this)

                            //variable to save id of the investor being removed
                            var id = $(this).attr('id');

                            //route to unsave an investor
                            $http.post("/entrepreneur/unsaveInvestor", {
                                id: id,
                                email: user.Email
                            })
                                .then((res) => {

                                    //if saved
                                    if (res.data == "saved") {
                                        id2.removeClass("unsave").addClass("save")
                                        id2.html("Save Investor")
                                    }
                                    else {
                                        location.href = "/savedinvestors"
                                    }
                                })
                        })
                    })
            })

        //route to check for messages / notifications
        $http.post("entrepreneur/not", {
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

    //offers controller
    app.controller("OffersController", OffersController);
    function OffersController($http, $window, jwtHelper) {

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

            //investor id
            var invid = $(".invid").attr("id")

            //entreprepreneurs id
            var enid = user._id

            //message
            var msg = $(".write").val();

            //array to store the links
            var lin = [];

            if (msg) {
                $http.post("entrepreneur/msg", {
                    inid: invid,
                    enid: enid,
                    msg: msg,
                    link: lin
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
        $http.post("entrepreneur/chat", {
            id: user._id
        })
            .then((res) => {
                //check if reponse is not none
                if (res.data !== "none") {
                    $(".p").html("Click on the message(s) on the left to read.")
                    //loop through the messages
                    for (var i = 0; i < res.data.length; i++) {

                        (function (data) {
                            //route to get the investors info
                            $http.post("entrepreneur/chat2", {
                                id: data.InvestorId
                            })
                                .then((response) => {

                                    if (!response.data) {
                                        return;
                                    }
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
                                            if (data.ReadEntrepreneur == true) {

                                                //check if the message type is request
                                                if (data.MsgType == "request") {

                                                    $("<div class = \"msg msga\">" +
                                                        "<input type=\"hidden\" id = " + data._id + " value = " + data2._id + ">" +
                                                        prf3 +
                                                        "<div class = \"nm\">" +
                                                        "<p class = \"nm1\">" + data2.FirstName + " " + data2.LastName + "</p>" +
                                                        "<p class = \"type\">Investor</p>" +
                                                        "</div>" +
                                                        "<i class=\"badge2 fa fa-check-circle\"> Investment Request</i>" +
                                                        "</div>"
                                                    ).appendTo(".people1")

                                                }
                                                else {
                                                    $("<div class = \"msg\">" +
                                                        "<input type=\"hidden\" id = " + data._id + " value = " + data2._id + ">" +
                                                        prf3 +
                                                        "<div class = \"nm\">" +
                                                        "<p class = \"nm1\">" + data2.FirstName + " " + data2.LastName + "</p>" +
                                                        "<p class = \"type\">Investor</p>" +
                                                        "</div>" +
                                                        "<span class=\"badge\"></span>" +
                                                        "</div>"
                                                    ).appendTo(".people1")
                                                }

                                            }
                                            else {
                                                //check if the message type is request
                                                if (data.MsgType == "request") {

                                                    $("<div class = \"msg msga\">" +
                                                        "<input type=\"hidden\" id = " + data._id + " value = " + data2._id + ">" +
                                                        prf3 +
                                                        "<div class = \"nm\">" +
                                                        "<p class = \"nm1\">" + data2.FirstName + " " + data2.LastName + "</p>" +
                                                        "<p class = \"type\">Investor </p>" +
                                                        "</div>" +
                                                        "<i class=\"badge2 id3 fa fa-check-circle\"> Investment Request</i>" +
                                                        "</div>"
                                                    ).appendTo(".people1")

                                                }
                                                else {
                                                    $("<div class = \"msg\">" +
                                                        "<input type=\"hidden\" id = " + data._id + " value = " + data2._id + ">" +
                                                        prf3 +
                                                        "<div class = \"nm\">" +
                                                        "<p class = \"nm1\">" + data2.FirstName + " " + data2.LastName + "</p>" +
                                                        "<p class = \"type\">investor</p>" +
                                                        "</div>" +
                                                        "</div>"
                                                    ).appendTo(".people1")
                                                }
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

                                                //var to store the investors id
                                                var invid = $(this)[0].children[0].value
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
                                                    var enid3 = invid
                                                    var url = "/info/investor/" + enid3
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
                                                            if (data3.Act == "investor") {
                                                                if (data3.Link) {

                                                                    //var to store the product link
                                                                    var prlink = data3.Link.split("/")
                                                                    if (data3.Msg == "Withdrawn investment request") {

                                                                        $(
                                                                            "<div class = \"msg33\">" +
                                                                            "<p class = \"time-date\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"nmm\">" + name + "</p>" +
                                                                            "<p class = \"msg331\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk\">" +
                                                                            "<p class = \"link2\">Withdrawn Investement Request</p>" +
                                                                            "<div class = \"link3\">" +
                                                                            "<a class = \"link4\" href=\"/preview2/" + prlink[0] + "\" target = \"_blank\">" + prlink[1] + "</a>" +
                                                                            "</div>" +
                                                                            "</div>" + "</div>").appendTo(".message3")
                                                                    }

                                                                    else {
                                                                        $(
                                                                            "<div class = \"msg33\">" +
                                                                            "<p class = \"time-date\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"nmm\">" + name + "</p>" +
                                                                            "<p class = \"msg331\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk\">" +
                                                                            "<p class = \"link2\">Requesting to invest in your startup</p>" +
                                                                            "<div class = \"link3\">" +
                                                                            "<a class = \"link4\" href=\"/preview2/" + prlink[0] + "\" target = \"_blank\">" + prlink[1] + "</a>" +
                                                                            "</div>" +
                                                                            "</div>" + "</div>").appendTo(".message3")
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
                                                                    var data4 = data3.Link.split(",")

                                                                    if (data4.length > 1) {

                                                                        // var to store the link
                                                                        var links = []

                                                                        //loop through the links
                                                                        for (var i = 0; i < data4.length; i++) {

                                                                            var data5 = data4[i].split("/")

                                                                            links.push(
                                                                                "<a class = \"link4\" href=\"/preview2/" + data5[0] + "\" target = \"_blank\">" + data5[1] + "</a>"
                                                                            )
                                                                        }

                                                                        links = links.join("")

                                                                        $(
                                                                            "<div class = \"msg34\">" +
                                                                            "<p class = \"time-date2\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"msg332\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk9\">" +
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
                                                                            "<div class = \"msg34\">" +
                                                                            "<p class = \"time-date2\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                            "<p class = \"msg332\">" + data3.Msg + "</p>" +
                                                                            "<div class =\"linkk9\">" +
                                                                            "<p class = \"link2\">My Startup Link</p>" +
                                                                            "<div class = \"link3\">" +
                                                                            "<a class = \"link4\" href=\"/preview2/" + data5[0] + "\" target = \"_blank\">" + data5[1] + "</a>" +
                                                                            "</div>" +
                                                                            "</div>" +
                                                                            "</div>").appendTo(".message3")
                                                                    }

                                                                }
                                                                else {

                                                                    $("<div class = \"hld\">" +
                                                                        "<div class = \"msg34\">" +
                                                                        "<p class = \"time-date2\">" + data3.Date + " " + data3.Time + "</p>" +
                                                                        "<p class = \"msg332\">" + data3.Msg + "</p>" +
                                                                        "</div>" + "</div>").appendTo(".message3")
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
                                                $http.post("/entrepreneur/read", {
                                                    id: mid
                                                })
                                                    .then((res) => {
                                                    })
                                            })
                                        })
                                });
                        }(res.data[i]))

                    }
                }
            })

        //route to check for messages / notifications
        $http.post("entrepreneur/not", {
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
    }


    //myProducts controller
    app.controller('EntrepreneurController', EntrepreneurController);

    function EntrepreneurController($http, $window, $location, jwtHelper) {
        var vm = this;

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        //send to client users first name
        vm.email = user.Email;

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        //to track if divdropnav is opened
        var opened = false;

        //to track if bell icon is clicked
        var notificationBell = false;

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

        //get the products from the database and display them
        $http.post("entrepreneur/user-products", user)
            .then(function (response) {
                $(".first-product").show();
                //hide the loading cirlce
                $(".loader").hide();

                //var to store the response data
                var dat = response.data;

                if (response.data == "no") {
                    $(".products").hide();
                }
                else {
                    $(".pr2").hide();

                    var myFiles = [];
                    //store the dots
                    var myDots = [];

                    //loop through the products
                    for (var p = dat.product.length - 1; p >= 0; p--) {

                        //loop through the images
                        for (var i = 0; i < dat.images.length; i++) {

                            //loop through the files
                            for (var f = 0; f < dat.images[i].length; f++) {

                                //find images that have the same name as the product
                                if (dat.product[p].Startup_Name == dat.images[i][f].metadata.Product_id) {


                                    //split the files contentType
                                    var cont = dat.images[i][f].contentType;
                                    cont = cont.split("/")

                                    //stoe the files id
                                    var fileid = dat.images[i][f]._id;

                                    //push the dots to myDots object
                                    myDots.push("<span class=\"dot\"></span>")

                                    //check to see if the file is an image
                                    if (cont[0] == "image") {
                                        myFiles.push("<div class = \"myslidediv\">" +
                                            "<img class = \"img mySlides\" src = \"../writeto/" + fileid + "." + cont[1] + "\">" +
                                            "</div>");
                                    }

                                    //if file is video
                                    else {

                                        myFiles.push(
                                            "<div class = \"myslidediv\">" +
                                            "<video class = \"video mySlides\" src = \"../writeto/" + fileid + "." + cont[1] + "\" controls>" + "</video>" +
                                            "</div>"

                                        );
                                    }
                                }
                            }
                        }

                        //track if the products is viewable by investors or not
                        var public;

                        if (dat.product[p].Public == true) {
                            public = "<p class =\"public\">Visible to investors</p>" +
                                "<label class=\"switch\">" +
                                "<input type=\"checkbox\" class = \"pud\" checked>" +
                                "<span class=\"slider round\"></span>" +
                                "</label>"

                        }
                        else {
                            public = "<p class =\"public\">Not visible to investors</p>" +
                                "<label class=\"switch\">" +
                                "<input type=\"checkbox\" class = \"pud\">" +
                                "<span class=\"slider round\"></span>" +
                                "</label>" +
                                "<div class = \"switch2\">" +
                                "<p class = \"switch22\">Click the switch on the bottom right to make your startup visible to investors.</p>" +
                                "</div>"
                        }

                        //change money from number to string
                        var money = dat.product[p].Startup_Money_Request.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        //check to see if the entrepreneur has down offer
                        var offer;

                        if (dat.product[p].Startup_Percent_Offer != undefined || null) {
                            offer = "<p class = \"offer offer2\">Investment: USD " + money + " for " + dat.product[p].Startup_Percent_Offer + " stake</p>"
                        }
                        //check to see f entrepreneur has the second description instead
                        else if (dat.product[p].Startup_Description2 != undefined || null) {
                            offer = "<h5 class = \"description2 offer2\">" + dat.product[p].Startup_Description2 + "</h5>"
                        }
                        //check to see if both oofer and description 2 are present
                        if (dat.product[p].Startup_Percent_Offer != undefined && dat.product[p].Startup_Description2 != undefined || null) {
                            offer = "<p class = \"offer offer2\">Investment: USD " + money + " for " + dat.product[p].Startup_Percent_Offer + " stake</p>" +
                                "<h5 class = \"description2 offer2\">" + dat.product[p].Startup_Description2 + "</h5>"
                        }

                        myDots = myDots.join("");

                        //upload the rest
                        myFiles.push(
                            "<div class = \"dot1\">" +
                            "<div class = \"dot2\">" + myDots + "</div>" +
                            "</div>" +
                            "<div class = \"ws\">" +
                            "<i class=\"fa fa-eye\" id = \"watches\" style=\"font-size:15px; color: grey\"> " + dat.product[p].Views + "</i> " +
                            "<p class = \"saves\">Saves " + dat.product[p].Saves + "</p>" +
                            "</div>" +

                            "<div class = \"offer1\">" +
                            "<h1 class=\"name offer2\">" + dat.product[p].Startup_Name + "</h1>" +
                            "<p class=\"description offer2\">" + dat.product[p].Startup_Description + "</p>" +
                            offer +
                            "</div>" +
                            "<button class = \"delete edit1\">Delete </button>" +
                            "<button class = \"edit edit1\">Edit </button>" +
                            public
                        );

                        myFiles = myFiles.join("");

                        $("<div class = \"test\">" +
                            "<input type = \"hidden\" value = " + dat.product[p]._id + ">" +
                            myFiles + " </div>").appendTo(".products");

                        myFiles = [];
                        myDots = [];

                    }
                }

                //call the slideshow function
                slideshow();

                //when user clicks on the startup
                $(".offer2").click(function () {
                    var id = $(this).parents("div")[1].children[0].value

                    location.href = "/preview2/" + id
                })
                //when user clicks the switch for the product to be on or off
                $(".pud").click(function () {

                    //route to get the user info
                    $http.post("/entrepreneur/substatus", {
                        email: user.Email
                    })
                        .then((res) => {
                            var status = res.data

                            if (status == "inactive") {

                                document.querySelector(".subpop").style.display = "flex"
                                return;
                            }

                            //if user subscription is past due
                            if (status == "past_due") {
                                document.querySelector(".subpop").style.display = "flex";
                                $(".subpop2").html("Past due")
                                $(".subpop3").html("Your subscription is past due. Your startup is currently not visible to investors.")
                                document.querySelector("#ulll").style.display = "none";
                                return;
                            }

                            else {

                                //var to store the product id
                                var id = $(this).parents("div")[0].children[0].value


                                var pr;

                                if ($(this).prop("checked")) {
                                    pr = "on"
                                }
                                else {
                                    pr = "off"
                                }

                                $http.post("entrepreneur/public", {
                                    id: id,
                                    pr: pr,
                                })
                                    .then((res) => {

                                        if (res.data == "pending") {
                                            document.querySelector(".subpop").style.display = "flex";
                                            $(".subpopp").html("Pending approval")
                                            $(".subpop2").html("Pending approval")
                                            $(".subpop3").html("If not approved within a week, then your startup is disapproved.")
                                            document.querySelector("#ulll").style.display = "none";

                                            return;
                                        }

                                        if (res.data == "disapproved") {
                                            document.querySelector(".subpop").style.display = "flex";
                                            $(".subpopp").html("Approval status")
                                            $(".subpop2").html("disapproved")
                                            $(".subpop3").html("unfortunately, your startup was not approved. contact our email. support@investrloft.com with any questions")
                                            document.querySelector("#ulll").style.display = "none";

                                            return;
                                        }

                                        location.reload();
                                    })

                            }
                        })

                })

                //take entrepreneur to the update page when they click edit button
                $(".edit").click(function () {
                    //variable to store the products name
                    var pname = $(this).parent("div").children(".offer1")[0].firstChild.innerHTML;

                    $http.post("entrepreneur/updatep", {
                        name: pname,
                        email: user.Email
                    })
                    //send the entrepreneur to the update page
                    location.href = "/update"


                })

                //global variable to store the products name in the proccess of deletion
                var name;
                var div;
                //delete product when Deleteproduct button is clicked
                $(".delete").click(function () {
                    document.querySelector('.pop-up').style.display = 'flex';
                    //get the products name
                    name = $(this).parent("div").children(".offer1")[0].firstChild.innerHTML;
                    //store the parents div
                    div = $(this).parent('div')[0]

                })

                //delete product when yes button is clicked
                $(".yes").click(function () {
                    $http.post("/entrepreneur/delete", {
                        name: name,
                        email: user.Email,
                    })
                        .then((res) => {
                            location.href = "/mystartups"
                        })

                })

                //close the pop up window when entrepreneur clicks no
                $(".no").click(function () {
                    document.querySelector('.pop-up').style.display = 'none';
                })


            })

        //route to check for messages / notifications
        $http.post("entrepreneur/not", {
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
    }



    //post controller
    app.controller('PostController', PostController);

    function PostController($http, $location, $window, jwtHelper,) {
        var vm = this;
        vm.industry;
        //to store files that are being previewd
        var myFiles = [];

        //to store the video link
        var videLinks = []

        //reload the page once
        if (window.location.href.indexOf('reload') == -1) {
            window.location.replace(window.location.href + '?reload');
        }

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        //send to client users first name
        vm.email = user.Email;

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

        //industry
        $("<p class = \"industry\">click here to pick your industry</p>").appendTo(".dropbtn")
        //to track if divdropnav is opened
        var opened = false;

        //to track if bell icon is clicked
        var notificationBell = false;

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

        $(".burger").click(function () {
            $(".link").toggleClass('nav-active')
        })

        //when user clicks add link
        $(".ytbtn").click(function () {
            var str = $("#vidlink").val()

            if (str == "") {
                $(".yterror").html("Enter the video link")
                return;
            }

            $("<div class = \"yplink\">" +
                "<a href=" + str + " target = \"_blank\">" + str + "</a>" +
                "<button class = \"delyt\">x</button>" +
                "</div>").appendTo(".ytlink")

            var html = $("<a href=" + str + " target = \"_blank\">" + str + "</a>")

            var html2 = html[0].href;

            document.querySelector(".ytlink").style.display = "block";

            videLinks.push(html2)
            $("#vidlink").val("")

            //when deletes the link
            $(".delyt").click(function () {

                var str2 = $(this).parent("div")[0].children[0].href

                //loop through the video links
                for (var v = 0; v < videLinks.length; v++) {

                    if (videLinks[v] == str2) {
                        videLinks.splice(v, 1);

                        //loop through the links
                        for (var l = 0; l < $(".yplink").length; l++) {

                            if ($(".yplink")[l].children[0].href == str2) {
                                $(".yplink")[l].remove();
                            }
                        }

                    }
                }
            })

        })
        //preview pictures before uploading

        if (window.File && window.FileList && window.FileReader) {
            $("#file").on("change", function (e) {

                var files = e.target.files,
                    filesLength = files.length;
                for (var i = 0; i < filesLength; i++) {

                    var f = files[i]

                    if (files[i].type.includes("image")) {
                        myFiles.push(f);
                    }
                    else {
                        //alert
                        alert("Upload images only. if you have a video, try posting it on youtube and add the link on youtube video link below.")
                        return;
                    }

                    //if there is a video show the loading circle
                    /*if (f.type.includes("video")) {
                        //show the div holding the loading circle
                        document.querySelector('.iver').style.display = 'flex';
                    }*/

                    (function (file) {
                        var fileReader = new FileReader();
                        fileReader.onload = (function (e) {

                            //to acces the file name and file typre of the files
                            var filename = file.name;
                            var filetype = file.type;


                            //image file
                            if (filetype.includes("image")) {

                                //hide the videos may take longer to load text
                                $("#imgt").hide();

                                $("<div class=\"imgpreview\">" +
                                    "<img id=\"img\" src=\"" + e.target.result + "\" title=\"" + filename + "\"/>" +
                                    "<br/><button class=\"remove\">x</button>" +
                                    "</div>").appendTo(".images");

                            }

                            //video file
                            /*if (filetype.includes("video")) {

                                //hide the videos may take longer to load text
                                $("#imgt").hide();

                                $("<div class = \"imgpreview\">" + "<video src=\"" + e.target.result + "\"  title=\"" + filename + "\" width=\"100%\" height=\"100%\" controls>" +
                                    "</video>" + "<br/><button class=\"remove\">x</button>" + "</div>"
                                ).appendTo(".images");

                                //hide the div holding loading cirlce
                                $('.iver').hide();
                            }*/


                            $(".remove").click(function () {
                                $(this).parent("div").remove();
                                var name = $(this).parents('div')[0].children[0].title;

                                for (var i = 0; i < myFiles.length; i++) {

                                    if (myFiles[i].name == name) {
                                        myFiles.splice(i, 1);
                                    }
                                }

                            });

                        });

                        fileReader.readAsDataURL(f);

                    }(files[i]));

                }

            });



        } else {
            alert("Your browser doesn't support to File API")
        }

        //when user clicks select for the industry drop down
        $(".dropbtn").click(function () {

            //show the loading circle
            $(".spin12").show();



            //fetch all the industries from the industry database
            $http.get('/entrepreneur/industry')
                .then(function (res) {

                    //hide the loading circle
                    $(".spin12").hide();

                    // var to store file
                    var file = [];

                    //loop through the data
                    for (var i = 0; i < res.data.length; i++) {

                        //get the title name of the industry
                        if (res.data[i].SubTitle.length > 0) {

                            //loop thorugh the subtitles
                            for (var s = 0; s < res.data[i].SubTitle.length; s++) {

                                file.push(
                                    "<p class = \"sub\">" + res.data[i].SubTitle[s] + "</p>"
                                )

                            }
                        }

                        file = file.join("")

                        //get the name of the category
                        $("<div class = \"classTitle class2\">" +
                            "<p class = \"tit\">" + res.data[i].Title + "</p>" +
                            "<div class = \"classSubTitle\">" +
                            file +
                            "</div>" +
                            "</div>").appendTo("#myDropdown");

                        file = [];
                    }

                    //append the "other" option
                    $("<div class = \"classTitle\">" +
                        "<p id=\"other\">Other</p>" +
                        "</div>"
                    ).appendTo("#myDropdown")

                    //when user clicks the other option
                    $("#other").click(function () {

                        //remove all the classtile
                        $(".classTitle").remove();

                        //append input
                        $("<div class = \"classTitle\" id=\"otherdiv\">" +
                            "<h3 class = \"h3\" >Industry title</h3>" +
                            "<input type = \"text\" placeholder = \"eg home\" class=\"intx\">" +
                            "<h3 class = \"h3\">Industry subtitle</h3>" +
                            "<input type = \"text\" placeholder = \"eg security\" class=\"intx intx2\">" +
                            "<br>" + "<br>" +
                            "<button class = \"inbtn\">save</button>" +
                            "</div>").appendTo("#myDropdown");

                        //when user clicks save
                        $(".inbtn").click(function () {


                            document.getElementById("myDropdown").style.display = "none"

                            //if there is no value on title
                            if ($(".intx").val() == "") {

                                //remove the previous industry
                                $(".industry").remove();

                                $("<p class = \"industry\">click here to pick your industry</p>").appendTo(".dropbtn");


                            }

                            //if there is a value on title
                            if ($(".intx").val() !== "") {
                                //remove the previous industry
                                $(".industry").remove();
                                $("<p class = \"industry\">" + $(".intx").val() + " </p>").appendTo(".dropbtn")
                            };

                            //if there is value on title and subtitle
                            if ($(".intx").val() !== "" && $(".intx2").val() !== "") {
                                //remove the previous industry
                                $(".industry").remove();
                                $("<p class = \"industry\">" + $(".intx").val() + ":" + $(".intx2").val() + "</p>").appendTo(".dropbtn")
                            }

                        })
                    })

                    //var to trak the title
                    var text;

                    //when user clicks class on the category
                    $(".tit").click(function () {

                        //hide the previous subtitles
                        $(".classSubTitle").hide();

                        text = $(this)[0].innerHTML.toLowerCase();


                        $(".industry").remove();
                        $("<p class = \"industry\">" + text + "</p>").appendTo(".dropbtn")

                        $($(this).parent("div")[0].children[1]).show()

                    })

                    //when user clicks the subtitle
                    $(".sub").click(function () {

                        //value of the sutitle
                        var text2 = $(this)[0].innerHTML.toLocaleLowerCase();

                        $(".industry").remove();
                        $("<p class = \"industry\">" + text + ":" + text2 + "</p>").appendTo(".dropbtn")

                        //hide the previous subtitles
                        $(".classSubTitle").hide();

                        //hide the drop down
                        $("#myDropdown").hide();
                    })

                })


        })

        //post the form and save to the database
        vm.post = function () {

            //reset the error
            vm.error = "";
            vm.error2 = "";

            //check to see if there are images
            if (myFiles.length == 0) {
                vm.error = "please upload at least one picture of your startup";
                vm.error2 = "please upload at least one picture of your startup";
                return;
            }

            //check for error before posting
            if (!vm.product) {
                vm.error = "Please fill out the form below";
                vm.error2 = "please fill out the form above";
                return;
            }

            if (!vm.product.name || !vm.product.description) {
                vm.error = "please fill out the form correctly"
                vm.error2 = "please fill out the form correctly"
                return;
            }

            if ($(".empnum").val() == "#") {
                vm.error = "please fill out the how many employees are on your team option"
                vm.error2 = "please fill out the how many employees are on your team option"
                return;
            }

            if (!vm.product.money && !vm.product.offer && !vm.product.description2) {
                vm.error = "you need to put in an offer and/or explain what you need from the investor";
                vm.error2 = "you need to put in an offer and/or explain what you need from the investor";
                return;
            }
            if ($(".invalid").attr("class") == "invalid ng-touched") {
                vm.error = "please fix the errors below";
                vm.error2 = "please fix the errors above";
                return;
            }

            //check to see if there is industry type
            if ($(".industry")) {
                vm.product.industry = $(".industry").html()
            }

            //check to see if there are any video links
            if (videLinks.length > 0) {
                vm.product.video = videLinks;
            }

            vm.product.employees = $(".empnum").val();

            //hide the post text
            $(".postbtn").hide();
            //show the loading circle
            $("#spin3").show();

            //disable the post button
            $(".btn1").prop('disabled', true);

            //get the users name and email
            const token = $window.localStorage.token;
            const payload = jwtHelper.decodeToken(token).data;
            if (payload) {
                var user = payload;
            }

            vm.product.name = vm.product.name.toLowerCase();

            vm.user = JSON.stringify(user);

            var fd = new FormData();
            for (key in vm.product) {
                fd.append(key, vm.product[key]);
            }

            fd.append("user", vm.user);
            for (var i = 0; i < myFiles.length; i++) {

                fd.append(user.Email, myFiles[i]);
            }


            //first check if the product exists in the users products
            $http.post('/entrepreneur/check', {
                name: vm.product.name,
                email: user.Email,
            })
                .then((res) => {

                    //if product doesnt exists
                    if (res.data == "ok") {
                        //post it
                        $http.post('/entrepreneur/post', fd, {
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        })
                            .then(function (response) {
                                if (response) {
                                    $location.path("/mystartups");
                                }
                            });
                    }

                    //if product exists show error
                    if (res.data == "exist") {

                        vm.error = "you already posted a startup with the provided name";
                        vm.error2 = "you already posted a startup with the provided name";

                        //show the post text
                        $(".postbtn").show();

                        //hide the loading circle
                        $("#spin3").hide();

                        //disable the post button
                        $(".btn1").prop('disabled', false);
                    }
                });


        }

        //route to check for messages / notifications
        $http.post("entrepreneur/not", {
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
    }

    //update controller
    app.controller("UpdateController", UpdateController);
    function UpdateController($http, $window, $location, jwtHelper) {
        var vm = this;

        //check the users name and email
        const token = $window.localStorage.token;
        const payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            var user = payload
        }

        //send to client users first name
        vm.firstname = user.FirstName;
        vm.email = user.Email;

        //to track if divdropnav is opened
        var opened = false;

        //to track if bell icon is clicked
        var notificationBell = false;

        $(".burger").click(function () {
            $(".link").toggleClass('nav-active')
        })

        var intials = user.FirstName.charAt(0) + user.LastName.charAt(0);
        var profileImage = $('.logo2').text(intials);

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

        //get the products information from the databse to be able to display it on the page
        $http.post("entrepreneur/updatef", {
            email: user.Email
        })
            .then(function (response) {

                //var to store the data
                var data = response.data[1][0]

                //hide the loading cirlcle
                $(".loader").hide();

                //check for the startups industry type
                if (data.Startup_TitleIndustry !== "none") {
                    $("<p class = \"industry\">" + data.Startup_TitleIndustry + ":" + data.Startup_SubIndustry + "</p>").appendTo(".dropbtn")
                }
                else {
                    $("<p class = \"industry\">click here to pick your industry</p>").appendTo(".dropbtn")
                }

                //show the containers
                $(".container2").show();
                $(".intro5").show();

                vm.product = data

                //set the product info
                //product name
                $("#productname").val(data.Startup_Name);
                vm.product.name = data.Startup_Name;

                //product description
                $(".description1").val(data.Startup_Description);
                vm.product.description = data.Startup_Description;

                //number of employees
                $(".empnum").val(data.Startup_Employees)
                vm.product.employees = data.Startup_Employees

                //capital raised
                $(".cp").val(data.Startup_RaisedCapital)
                vm.product.money2 = data.Startup_RaisedCapital

                //website
                $(".wb").val(data.Startup_Website)
                vm.product.website = data.Startup_Website

                //money
                $(".mmoney").val(data.Startup_Money_Request);
                vm.product.money = data.Startup_Money_Request;

                //percentage
                $(".offeer").val(data.Startup_Percent_Offer);
                vm.product.offer = data.Startup_Percent_Offer;

                //description2
                $(".description2").val(data.Startup_Description2);
                vm.product.description2 = data.Startup_Description2;

                //var array to store the images
                var myFiles = [];

                //var array to store the video links
                var videLinks = [];

                //video link
                if (data.Startup_Video_Link.length > 0) {
                    vm.product.video = data.Startup_Video_link

                    //loop through the video links
                    for (var i = 0; i < data.Startup_Video_Link.length; i++) {
                        var str = data.Startup_Video_Link[i]

                        $("<div class = \"yplink\">" +
                            "<a href=" + str + " target = \"_blank\">" + str + "</a>" +
                            "<button class = \"delyt\">x</button>" +
                            "</div>").appendTo(".ytlink")

                        var html = $("<a href=" + str + " target = \"_blank\">" + str + "</a>")

                        var html2 = html[0].href;

                        document.querySelector(".ytlink").style.display = "block";

                        videLinks.push(html2)

                        //when deletes the link
                        $(".delyt").click(function () {

                            var str2 = $(this).parent("div")[0].children[0].href

                            //loop through the video links
                            for (var v = 0; v < videLinks.length; v++) {

                                if (videLinks[v] == str2) {
                                    videLinks.splice(v, 1);

                                    //loop through the links
                                    for (var l = 0; l < $(".yplink").length; l++) {

                                        if ($(".yplink")[l].children[0].href == str2) {
                                            $(".yplink")[l].remove();
                                        }
                                    }

                                }
                            }
                        })
                    }
                }

                //when user clicks add link
                $(".ytbtn").click(function () {
                    var str = $("#vidlink").val()

                    if (str == "") {
                        $(".yterror").html("Enter the video link")
                        return;
                    }

                    $("<div class = \"yplink\">" +
                        "<a href=" + str + " target = \"_blank\">" + str + "</a>" +
                        "<button class = \"delyt\">x</button>" +
                        "</div>").appendTo(".ytlink")

                    var html = $("<a href=" + str + " target = \"_blank\">" + str + "</a>")

                    var html2 = html[0].href;

                    document.querySelector(".ytlink").style.display = "block";

                    videLinks.push(html2)
                    $("#vidlink").val("")

                    //when deletes the link
                    $(".delyt").click(function () {

                        var str2 = $(this).parent("div")[0].children[0].href

                        //loop through the video links
                        for (var v = 0; v < videLinks.length; v++) {

                            if (videLinks[v] == str2) {
                                videLinks.splice(v, 1);

                                //loop through the links
                                for (var l = 0; l < $(".yplink").length; l++) {

                                    if ($(".yplink")[l].children[0].href == str2) {
                                        $(".yplink")[l].remove();
                                    }
                                }

                            }
                        }
                    })

                })

                var pic = response.data[0].picture[0]


                //preview pictures before uploading
                if (window.File && window.FileList && window.FileReader) {

                    //loop throuth the images
                    for (var p = 0; p < pic.length; p++) {

                        //hide the videos may take longer to load text
                        $("#imgt").hide();

                        (function (pic) {
                            //split contentytpe
                            var pic3 = pic.contentType.split("/")

                            async function getImageFileFromUrl(url) {
                                let response = await fetch(url);
                                let data = await response.blob();
                                let metadata = {
                                    type: pic.contentType
                                };
                                var file = new File([data], pic._id, metadata);
                                myFiles.push(file)
                            }
                            const file = getImageFileFromUrl("../writeto/" + pic._id + "." + pic3[1], pic.contentType);
                        }(pic[p]));

                        //split contentytpe
                        var pic2 = pic[p].contentType.split("/");

                        //if images
                        if (pic[p].contentType.includes("image")) {
                            $("<div class=\"imgpreview\">" +
                                "<img id=\"img\" src=\"../writeto/" + pic[p]._id + "." + pic2[1] + "\"  title = " + pic[p]._id + ">" +
                                "<br/><button class=\"remove\">x</button>" +
                                "</div>").appendTo(".images");
                        }
                        else {

                            $("<div class = \"imgpreview\">" + "<video src=\"../writeto/" + pic[p]._id + "." + pic2[1] + "\" title =  " + pic[p]._id + " width=\"100%\" height=\"100%\" controls>" +
                                "</video>" + "<br/><button class=\"remove\">x</button>" + "</div>"
                            ).appendTo(".images");

                        }

                        $(".remove").click(function () {
                            $(this).parent("div").remove();
                            var name = $(this).parents('div')[0].children[0].title;

                            for (var i = 0; i < myFiles.length; i++) {

                                if (myFiles[i].name == name) {
                                    myFiles.splice(i, 1);
                                }
                            }

                        });
                    }

                    $("#file").on("change", function (e) {

                        var files = e.target.files,
                            filesLength = files.length;
                        for (var i = 0; i < filesLength; i++) {

                            var f = files[i]

                            if (files[i].type.includes("image")) {
                                myFiles.push(f);
                            }
                            else {
                                //alert
                                alert("Upload images only. if you have a video, try posting it on youtube and add the link on youtube video link below.")
                                return;
                            }

                            //if there is a video show the loading circle
                            /*if (f.type.includes("video")) {
                                //show the div holding the loading circle
                                document.querySelector('.iver').style.display = 'flex';
                            }*/

                            (function (file) {
                                var fileReader = new FileReader();
                                fileReader.onload = (function (e) {

                                    //to acces the file name and file typre of the files
                                    var filename = file.name;
                                    var filetype = file.type;


                                    //image file
                                    if (filetype.includes("image")) {

                                        //hide the videos may take longer to load text
                                        $("#imgt").hide();

                                        $("<div class=\"imgpreview\">" +
                                            "<img id=\"img\" src=\"" + e.target.result + "\" title=\"" + filename + "\"/>" +
                                            "<br/><button class=\"remove\">x</button>" +
                                            "</div>").appendTo(".images");

                                    }

                                    //video file
                                    /*if (filetype.includes("video")) {

                                        //hide the videos may take longer to load text
                                        $("#imgt").hide();

                                        $("<div class = \"imgpreview\">" + "<video src=\"" + e.target.result + "\"  title=\"" + filename + "\" width=\"100%\" height=\"100%\" controls>" +
                                            "</video>" + "<br/><button class=\"remove\">x</button>" + "</div>"
                                        ).appendTo(".images");

                                        //hide the div holding loading cirlce
                                        $('.iver').hide();
                                    }*/


                                    $(".remove").click(function () {
                                        $(this).parent("div").remove();
                                        var name = $(this).parents('div')[0].children[0].title;

                                        for (var i = 0; i < myFiles.length; i++) {

                                            if (myFiles[i].name == name) {
                                                myFiles.splice(i, 1);
                                            }
                                        }

                                    });

                                });

                                fileReader.readAsDataURL(f);

                            }(files[i]));

                        }

                    });



                } else {
                    alert("Your browser doesn't support to File API")
                }


                //when user clicks select for the industry drop down
                $(".dropbtn").click(function () {

                    //show the loading circle
                    $(".spin12").show();



                    //fetch all the industries from the industry database
                    $http.get('/entrepreneur/industry')
                        .then(function (res) {

                            //hide the loading circle
                            $(".spin12").hide();

                            // var to store file
                            var file = [];
                            //loop through the data
                            for (var i = 0; i < res.data.length; i++) {

                                //get the title name of the industry
                                if (res.data[i].SubTitle.length > 0) {

                                    //loop thorugh the subtitles
                                    for (var s = 0; s < res.data[i].SubTitle.length; s++) {

                                        file.push(
                                            "<p class = \"sub\">" + res.data[i].SubTitle[s] + "</p>"
                                        )

                                    }
                                }

                                file = file.join("")

                                //get the name of the category
                                $("<div class = \"classTitle class2\">" +
                                    "<p class = \"tit\">" + res.data[i].Title + "</p>" +
                                    "<div class = \"classSubTitle\">" +
                                    file +
                                    "</div>" +
                                    "</div>").appendTo("#myDropdown");

                                file = [];
                            }

                            //append the "other" option
                            $("<div class = \"classTitle\">" +
                                "<p id=\"other\">Other</p>" +
                                "</div>"
                            ).appendTo("#myDropdown")

                            //when user clicks the other option
                            $("#other").click(function () {

                                //remove all the classtile
                                $(".classTitle").remove();

                                //append input
                                $("<div class = \"classTitle\" id=\"otherdiv\">" +
                                    "<h3 class = \"h3\" >Industry title</h3>" +
                                    "<input type = \"text\" placeholder = \"eg home\" class=\"intx\">" +
                                    "<h3 class = \"h3\">Industry subtitle</h3>" +
                                    "<input type = \"text\" placeholder = \"eg security\" class=\"intx intx2\">" +
                                    "<br>" + "<br>" +
                                    "<button class = \"inbtn\">save</button>" +
                                    "</div>").appendTo("#myDropdown");

                                //when user clicks save
                                $(".inbtn").click(function () {


                                    document.getElementById("myDropdown").style.display = "none"

                                    //if there is no value on title
                                    if ($(".intx").val() == "") {

                                        //remove the previous industry
                                        $(".industry").remove();

                                        $("<p class = \"industry\">click here to pick your industry</p>").appendTo(".dropbtn");


                                    }

                                    //if there is a value on title
                                    if ($(".intx").val() !== "") {
                                        //remove the previous industry
                                        $(".industry").remove();
                                        $("<p class = \"industry\">" + $(".intx").val() + " </p>").appendTo(".dropbtn")
                                    };

                                    //if there is value on title and subtitle
                                    if ($(".intx").val() !== "" && $(".intx2").val() !== "") {
                                        //remove the previous industry
                                        $(".industry").remove();
                                        $("<p class = \"industry\">" + $(".intx").val() + ":" + $(".intx2").val() + "</p>").appendTo(".dropbtn")
                                    }

                                })
                            })

                            //var to trak the title
                            var text;

                            //when user clicks class on the category
                            $(".tit").click(function () {

                                //hide the previous subtitles
                                $(".classSubTitle").hide();

                                text = $(this)[0].innerHTML.toLowerCase();


                                $(".industry").remove();
                                $("<p class = \"industry\">" + text + "</p>").appendTo(".dropbtn")

                                $($(this).parent("div")[0].children[1]).show()

                            })

                            //when user clicks the subtitle
                            $(".sub").click(function () {

                                //value of the sutitle
                                var text2 = $(this)[0].innerHTML.toLocaleLowerCase();

                                $(".industry").remove();
                                $("<p class = \"industry\">" + text + ":" + text2 + "</p>").appendTo(".dropbtn")

                                //hide the previous subtitles
                                $(".classSubTitle").hide();

                                //hide the drop down
                                $("#myDropdown").hide();
                            })

                        })


                })


                //post the form and save to the database
                vm.update = function () {


                    //reset the error
                    vm.error = "";
                    vm.error2 = "";

                    //check to see if there are images
                    if (myFiles.length == 0) {
                        vm.error = "please upload at least one picture of your startup";
                        vm.error2 = "please upload at least one picture of your startup";
                        return;
                    }

                    //check for error before posting
                    if (!vm.product) {
                        vm.error = "Please fill out the form below";
                        vm.error2 = "please fill out the form above";
                        return;
                    }

                    if (!vm.product.name || !vm.product.description) {
                        vm.error = "please fill out the form correctly"
                        vm.error2 = "please fill out the form correctly"
                        return;
                    }

                    if ($(".empnum").val() == "#") {
                        vm.error = "please fill out the how many employees are on your team option"
                        vm.error2 = "please fill out the how many employees are on your team option"
                        return;
                    }

                    if (!vm.product.money && !vm.product.offer && !vm.product.description2) {
                        vm.error = "you need to put in an offer and/or explain what you need from the investor";
                        vm.error2 = "you need to put in an offer and/or explain what you need from the investor";
                        return;
                    }
                    if ($(".invalid").attr("class") == "invalid ng-touched") {
                        vm.error = "please fix the errors below";
                        vm.error2 = "please fix the errors above";
                        return;
                    }

                    //check to see if there is industry type
                    if ($(".industry")) {
                        vm.product.industry = $(".industry").html()
                    }

                    vm.product.employees = $(".empnum").val();
                    vm.product.video = videLinks;

                    //hide the post text
                    $(".postbtn").hide();
                    //show the loading circle
                    $("#spin3").show();

                    //disable the post button
                    $(".btn1").prop('disabled', true);


                    //route to delete the previous pictures
                    $http.post("/entrepreneur/picdelete", {
                        email: user.Email,
                        name: data.Startup_Name,
                        name2: vm.product.name,
                    })
                        .then((res) => {

                            if (res.data == "done") {
                                vm.product.name = vm.product.name.toLowerCase();

                                var fd = new FormData();
                                for (key in vm.product) {
                                    fd.append(key, vm.product[key]);
                                }

                                for (var i = 0; i < myFiles.length; i++) {

                                    fd.append(user.Email, myFiles[i]);
                                }

                                //update the startup
                                $http.post('/entrepreneur/update', fd, {
                                    transformRequest: angular.identity,
                                    headers: { 'Content-Type': undefined }
                                })
                                    .then((res) => {
                                        $location.path("/mystartups");
                                    })
                            }
                            else {
                                vm.error = "you already posted a startup with the provided name";
                                vm.error2 = "you already posted a startup with the provided name";

                                //show the post text
                                $(".postbtn").show();

                                //hide the loading circle
                                $("#spin3").hide();

                                //disable the post button
                                $(".btn1").prop('disabled', false);
                            }
                        })

                }
            })

        //check if the form is empty after 2 seconds and redirect back to the entrepreneur page
        setTimeout(function () {
            if (!$("#productname").val()) {
                location.href = "/mystartups"
            }
        }, 1000);

        //when the entrepreneur navigates away from the page
        window.onbeforeunload = function unload() {
            $http.post("entrepreneur/unload", {
                email: user.Email,
            })
        }

        //route to check for messages / notifications
        $http.post("entrepreneur/not", {
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
    }

}())