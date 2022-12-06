
(function () {
    const app = angular.module('app').controller('Ctrl2', ['ngRoute', 'angular-jwt']);

    app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        //resource page
        $routeProvider.when("/administrator/101/resources", {
            templateUrl: "../Administrator/resources.html",
            controller: "resourceController",
            controllerAs: "vm",
            access: {
                restricted: false,
                //account: "investor",
            }
        })

        //amdministrator page
        $routeProvider.when("/administrator/101/industry", {
            templateUrl: "../Administrator/industries.html",
            controller: "industryController",
            controllerAs: "vm",
            access: {
                restricted: false,
                //account: "investor",
            }
        })

        //investor page
        $routeProvider.when("/administrator/101/investor", {
            templateUrl: "../Administrator/investors.html",
            controller: "investorController",
            controllerAs: "vm",
            access: {
                restricted: false,
                //account: "investor",
            }
        })

        //startup page
        $routeProvider.when("/administrator/101/startup", {
            templateUrl: "../Administrator/startups.html",
            controller: "startupController",
            controllerAs: "vm",
            access: {
                restricted: false,
                //account: "investor",
            }
        })

    });

    //resource controller
    app.controller('resourceController', resourceController);

    function resourceController($location, $scope, $window, $http, jwtHelper) {

        var vm = this

        //industry
        $("<p class = \"industryy\">click here to pick your industry</p>").appendTo(".dropbtn")


        var myFiles2 = [];
        var myFiles = [];

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



                    //var to trak the title
                    var text;

                    //when user clicks class on the category
                    $(".tit").click(function () {

                        //hide the previous subtitles
                        $(".classSubTitle").hide();

                        text = $(this)[0].innerHTML.toLowerCase();

                        $(".industryy").remove();
                        $("<p class = \"industryy\">" + text + "</p>").appendTo(".dropbtn")

                        $($(this).parent("div")[0].children[1]).show()

                    })

                    //when user clicks the subtitle
                    $(".sub").click(function () {

                        //value of the sutitle
                        var text2 = $(this)[0].innerHTML.toLocaleLowerCase();

                        $(".industryy").remove();
                        $("<p class = \"industryy\">" + text + ":" + text2 + "</p>").appendTo(".dropbtn")

                        //hide the previous subtitles
                        $(".classSubTitle").hide();

                        //hide the drop down
                        $("#myDropdown").hide();
                    })

                })


        })

        //route to get all the resources from the databse
        $http.post("admin/resource2", {
            Name: "this route is to receive all the resources"
        })
            .then((res) => {


                //var to store the resource
                var resource = res.data.resource[0]

                //var to store the logo
                var logo = res.data.logo[0]

                //loop through all the resources
                for (var i = 0; i < resource.length; i++) {

                    //loop through the logo
                    for (var l = 0; l < logo.length; l++) {

                        //check to see if the logo matches the resource
                        if (logo[l].metadata.Name == resource[i].Name) {

                            var type = logo[l].contentType.split("/")
                            type = type[1];
                            var url = '../logo2/' + logo[l]._id + "." + type;

                            $("<div class = \"resource\">" +
                                "<div class = \"profile\">" +
                                "<div class = \"loggo\">" +
                                "<img class = \"hgo\" src=" + url + " > " +
                                "</div>" +
                                "</div>" +
                                "<div class = \"leftsection\">" +
                                "<h1 class = \"name\">" + resource[i].Name + "</h1>" +
                                "<a href = " + resource[i].Link + " target=\"_blank\" >Visit " + resource[i].Name + " here </a>" +
                                "<p class = \"description\">" + resource[i].Description + "</p>" +
                                "</div>" +
                                "</div>").appendTo(".inal1")
                        }
                    }
                }

            })

        //when select valuechanges
        $("#opt").change(function () {

            //if value is startups
            if ($("#opt").val() == "Startups") {

                location.href = "/administrator/101/startup"
            }

            //if value is Investors
            if ($("#opt").val() == "Investors") {

                location.href = "/administrator/101/investor"

            }

            //if value is Industries
            if ($("#opt").val() == "Industries") {

                location.href = "/administrator/101/industry"

            }

            //if value is resources
            if ($("#opt").val() == "resources") {

                location.href = "/administrator/101/resources"

            }
        })

        $("#spin3").hide();

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

        //when user clicks add 
        $(".adbtn").click(function () {

            $(".error1").html("")

            //get the resource name
            var name = $(".title").val()
            name = name.toLowerCase();

            //get the resource link
            var link = $(".subtitle").val()

            //get the resource desctiption
            var description = $(".description").val()


            //store if the resource is live or not
            var live;

            //if there is no resource name
            if (!name) {
                $(".error1").html("please enter the name of the resource.")
                return;
            }


            //if there is no resource link
            if (!link) {
                $(".error1").html("please enter the link to the resource.")
                return;
            }

            //regex function to verify that the link is valid
            const isValidUrl = urlString => {
                var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
                return !!urlPattern.test(urlString);
            }

            //check if the link is valid
            if (isValidUrl(link) == false) {
                $(".error1").html("please enter a valid link to the resource.")
                return;
            }

            //if there is no resource description
            if (!description) {
                $(".error1").html("please enter the resources description.")
                return;
            }

            //check if the resource is live or not
            if (vm.checked) {
                live = true
            }
            else {
                live = false
            }

            //var to store the industry
            var industry;

            //if statement to check if there is an industry
            if ($(".industryy").html() !== "click here to pick your industry" || "") {
                industry = $(".industryy").html()
            }
            else {

                $(".error1").html("please enter the resources industry.")
                return;

            }

            //var to store the resource 
            var resourc = {
                name: name,
                link: link,
                live: live,
                description: description,
                industry: industry
            }

            //check if there is a logo uploaded
            if (myFiles.length == 0) {
                $(".error1").html("please uploade an image / logo for the resource.")
                return;

            }

            //format the logo image
            var fd = new FormData();

            for (key in resourc) {
                fd.append(key, resourc[key]);
            }

            fd.append(name, myFiles[0]);



            $(".cp").html("")
            $("#spin3").show();


            //send to the information to the server side 
            $http.post("admin/resources", fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
            })
                .then((res) => {

                    console.log(res.data)

                    //if the data is succesfully saved
                    if (res.data == "resource is saved") {
                        $("#spin3").hide();
                        $(".cp").html("Success!!")
                        $(".adbtn").css({ 'background-color': 'green', 'color': 'white' });


                        //timeout funtion to delay the refresh of the page
                        setTimeout(doSomething, 2000);

                        function doSomething() {
                            //reload the page
                            window.location.reload();
                        }

                    }

                    //if the data is not saved
                    if (res.data == "Resource already exists") {
                        $("#spin3").hide();
                        $(".cp").html("Resource already exists")
                        $(".adbtn").css({ 'background-color': 'red', 'color': 'white' });
                        $(".error1").html("The resource you are trying to upload already exists.")

                        //timeout funtion to change te add button back
                        setTimeout(doSomething, 2000);

                        function doSomething() {
                            //reload the page
                            $(".cp").html("Add")
                            $(".adbtn").css({ 'background-color': '#3F3FA0', 'color': 'white' });
                        }
                    }

                })

        })


    }

    //startups controller
    app.controller('startupController', startupController);

    function startupController($location, $scope, $window, $http, jwtHelper) {

        var vm = this

        //when select valuechanges
        $("#opt").change(function () {

            //if value is startups
            if ($("#opt").val() == "Startups") {

                location.href = "/administrator/101/startup"
            }

            //if value is Investors
            if ($("#opt").val() == "Investors") {

                location.href = "/administrator/101/investor"

            }

            //if value is Industries
            if ($("#opt").val() == "Industries") {

                location.href = "/administrator/101/industry"

            }

            //if value is resources
            if ($("#opt").val() == "resources") {

                location.href = "/administrator/101/resources"

            }
        })


        //when user clicks close on the message pop-up
        $(".close").click(function () {
            $(".message1").hide();
        });

        function strt(response, cls) {
            if (response.data.length > 0) {

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
                        "<button  class=\"disapprove\"> Disapprove </button>" +
                        "<button class = \"approve\" >Approve</button>" +
                        "</div>" +
                        "</div>"
                    );
                    myFiles = myFiles.join("");
                    $("<div class = \"test\">" + myFiles + "</div>").appendTo(cls);
                    myFiles = [];
                }

                //when user clicks the startups
                $(".blm").click(function () {

                    //product id
                    var prid = $(this).parents("div")[0].children[0].id

                    $location.path("/preview/" + prid + "")
                    $scope.$apply();

                });

                //when user clicks Approve
                $(".approve").click(function () {


                    $(".disapprove2").remove()
                    $(".approve2").remove()
                    $(".feature2").remove()
                    $(".unfeature2").remove()

                    $(".ms1").html("Are your sure you want to approve this startup?")

                    $("<button class=\"approve2\">Approve</button>").appendTo(".text")

                    document.querySelector(".imgp2").innerHTML = ""


                    document.querySelector(".message1").style.display = "flex"


                    //product id
                    var prid = $(this).parents("div")[2].children[0].id

                    $(".approve2").click(function () {
                        //route to approve the startup
                        $http.post("/admin/approve", {
                            approve: "approved",
                            prid: prid
                        })
                            .then((res) => {
                                location.href = "/administrator/101/startup"
                            })

                    })

                })

                //when user clicks Disapprove
                $(".disapprove").click(function () {

                    $(".disapprove2").remove()
                    $(".approve2").remove()
                    $(".feature2").remove()
                    $(".unfeature2").remove()

                    $(".ms1").html("Are your sure you want to disapprove this startup?")

                    $("<button class=\"disapprove2\">disapprove</button>").appendTo(".text")

                    document.querySelector(".imgp2").innerHTML = ""


                    document.querySelector(".message1").style.display = "flex"

                    //product id
                    var prid = $(this).parents("div")[2].children[0].id

                    $(".disapprove2").click(function () {
                        //route to approve the startup
                        $http.post("/admin/approve", {
                            approve: "disapproved",
                            prid: prid
                        })
                            .then((res) => {
                                location.href = "/administrator/101/startup"
                            })
                    })

                })

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
        }

        //route to get all startups that are pending
        $http.post("admin/strtn", {
            dat: "pending"
        })
            .then((response) => {

                strt(response, ".pending")

            })


        //route to get all startups that are approved
        $http.post("admin/stapr", {
            dat: "approved"
        })
            .then((response) => {
                strt(response, ".home1")
            })


        //route t0 get all startups that are disapproved
        $http.post("admin/disapproved", {
            dat: "disapproved"
        })
            .then((response) => {
                strt(response, ".disapproved")
            })

    }


    //investor controller
    app.controller('investorController', investorController);

    function investorController($location, $scope, $window, $http, jwtHelper) {

        var vm = this

        //when select value changes
        $("#opt").change(function () {

            //if value is startups
            if ($("#opt").val() == "Startups") {

                location.href = "/administrator/101/startup"
            }

            //if value is Investors
            if ($("#opt").val() == "Investors") {

                location.href = "/administrator/101/investor"

            }

            //if value is Industries
            if ($("#opt").val() == "Industries") {

                location.href = "/administrator/101/industry"

            }

            //if value is resources
            if ($("#opt").val() == "resources") {

                location.href = "/administrator/101/resources"

            }
        })

        //when user clicks close on the message pop-up
        $(".close").click(function () {
            $(".message1").hide();
        });


        function inve(data, ap) {
            //loop through the data
            for (var d = 0; d < data.length; d++) {

                var inve
                var ft
                //check to see if investor is Approved
                if (data[d].Approved == false) {
                    inve = "<button class = \"approve\">Approve</button>"
                }

                if (data[d].Approved == true) {
                    inve = "<button class = \"unapprove\">Unapprove</button>"
                }

                //check to see if investor is featured
                if (data[d].Feature == false) {
                    ft = "<P class = \"feature\" >Feature Investor</p>"
                }

                if (data[d].Feature == true) {
                    ft = "<P class = \"unfeature\" >Unfeature Investor</p>"
                }
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
                    inve +
                    "<div class = \"rating\">" +
                    "<p class = \"rating2 \">Budget " +
                    "<label class = \"bdgt\" >$" + money + "</label>" +
                    "</p>" +
                    ft +
                    "</div>" +
                    "</div>" +
                    "</div>"

                ).appendTo(ap)



            }

            //when entrepreneur clicks on the investor profile
            $(".nl").click(function () {
                var inid = $(this).parents("div")[0].children[2].children[2].children[1].id
                url = "/info/investor/" + inid

                window, open(url)
            })


            //when user click feature
            $(".feature").click(function () {

                $(".imgp2").css("background", "");

                $(".unapprove2").remove()
                $(".approve2").remove()
                $(".feature2").remove()
                $(".unfeature2").remove()

                $(".ms1").html("Are your sure you want to feature this investor on the homepage?")

                $("<button class=\"feature2\">Feature</button>").appendTo(".text")

                document.querySelector(".imgp2").innerHTML = ""


                document.querySelector(".message1").style.display = "flex"

                //get id of the clicked investor
                var inid = $(this).parents("div")[2].children[0].id

                //get the profile image url
                var pr = $(this).parents("div")[2].children[0].style.backgroundImage;



                if (pr !== "") {
                    document.querySelector(".imgp2").style.backgroundImage = pr;
                }
                else {
                    $(".imgp2").html($(this).parents("div")[1].children[0].innerHTML)
                }


                $(".inid").val(inid)

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

                //when user clisk yes on featuring investor
                $(".feature2").click(function () {
                    //store invetors id
                    var invid = $(".inid").val()

                    $http.post("admin/feature2", {
                        invid: invid
                    })
                        .then((res) => {
                            location.href = "/administrator/101/investor"
                        })
                })

            })

            //when user click feature
            $(".unfeature").click(function () {

                $(".imgp2").css("background", "");

                $(".unapprove2").remove()
                $(".approve2").remove()
                $(".feature2").remove()
                $(".unfeature2").remove()

                $(".ms1").html("Are your sure you want to unfeature this investor from the homepage?")

                $("<button class=\"unfeature2\">Unfeature</button>").appendTo(".text")

                document.querySelector(".imgp2").innerHTML = ""


                document.querySelector(".message1").style.display = "flex"

                //get id of the clicked investor
                var inid = $(this).parents("div")[2].children[0].id

                //get the profile image url
                var pr = $(this).parents("div")[2].children[0].style.backgroundImage;



                if (pr !== "") {
                    document.querySelector(".imgp2").style.backgroundImage = pr;
                }
                else {
                    $(".imgp2").html($(this).parents("div")[1].children[0].innerHTML)
                }


                $(".inid").val(inid)

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

                //when user clisk yes on featuring investor
                $(".unfeature2").click(function () {
                    //store invetors id
                    var invid = $(".inid").val()

                    $http.post("admin/unfeature2", {
                        invid: invid
                    })
                        .then((res) => {
                            location.href = "/administrator/101/investor"
                        })
                })

            })

            //when user clicks approve
            $(".approve").click(function () {

                $(".imgp2").css("background", "");

                $(".unapprove2").remove()
                $(".approve2").remove()
                $(".feature2").remove()
                $(".unfeature2").remove()

                $(".ms1").html("Are your sure you want to approve this investor?")

                $("<button class=\"approve2\">Approve</button>").appendTo(".text")

                document.querySelector(".imgp2").innerHTML = ""


                document.querySelector(".message1").style.display = "flex"

                //get id of the clicked investor
                var inid = $(this).parents("div")[1].children[0].id

                //get the profile image url
                var pr = $(this).parents("div")[1].children[0].style.backgroundImage;


                if (pr !== "") {
                    document.querySelector(".imgp2").style.backgroundImage = pr;
                }
                else {
                    $(".imgp2").html($(this).parents("div")[1].children[0].innerHTML)
                }


                $(".inid").val(inid)

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

                //when user clisk yes on approving investor
                $(".approve2").click(function () {
                    //store invetors id
                    var invid = $(".inid").val()

                    $http.post("admin/approve", {
                        invid: invid
                    })
                        .then((res) => {
                            location.href = "/administrator/101/investor"
                        })
                })
            })

            //when user clicks unapprove
            $(".unapprove").click(function () {

                $(".unapprove2").remove()
                $(".approve2").remove()
                $(".feature2").remove()
                $(".unfeature2").remove()

                $("<button class=\"unapprove2\">Unapprove</button>").appendTo(".text")

                $(".imgp2").css("background", "");

                $(".ms1").html("Are you sure you want to unapprove this investor?")

                document.querySelector(".imgp2").innerHTML = ""

                document.querySelector(".message1").style.display = "flex"

                //get id of the clicked investor
                var inid = $(this).parents("div")[1].children[0].id
                console.log(inid)

                //get the profile image url
                var pr = $(this).parents("div")[1].children[0].style.backgroundImage;


                if (pr !== "") {
                    document.querySelector(".imgp2").style.backgroundImage = pr;
                }
                else {
                    $(".imgp2").html($(this).parents("div")[1].children[0].innerHTML)
                }


                $(".inid").val(inid)

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

                //when user clisk yes on unapproving investor
                $(".unapprove2").click(function () {
                    //store invetors id
                    var invid = $(".inid").val()

                    $http.post("admin/unapprove", {
                        invid: invid
                    })
                        .then((res) => {
                            location.href = "/administrator/101/investor"
                        })
                })

            })


            //remove any messages
            $(".message").remove()
        }

        async function profile(data, ap) {

            const result = await inve(data, ap);

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
                                $(ap).find(".investor2").find('#' + idd).contents().filter(function () {
                                    return this.nodeType === 3;
                                }).remove();

                                //image file
                                $(ap).find(".investor2").find('#' + idd).css('background-image', 'url(../profile/' + response.data + ')');
                            }
                        })
                }(data[p]));
            }
        }

        //route to get investors that need approvement
        $http.post("admin/approvement", {
            apr: false
        })
            .then((res) => {

                if (res.data !== "No investors") {
                    profile(res.data, ".investor")
                }
                else {
                    $(".app").html("All investors are appoved")
                    $(".app").show()
                }


            })

        //route to get approved investors
        $http.post("admin/invest", {
            apr: false
        })
            .then((res) => {

                if (res.data !== "No investors") {
                    profile(res.data, ".home1")
                    console.log(res.data)
                }
                else {
                    $(".ail").html("There are no registered investors yet")
                    $(".ail").show()

                }


            })

        //route to get featured investors
        $http.post("admin/feature", {
            apr: false
        })
            .then((res) => {

                if (res.data !== "No investors") {
                    profile(res.data, ".home2")
                }
                else {
                    $(".ft").html("There are no investors featured")
                    $(".ft").show()
                }

            })
    }

    //industry controller
    app.controller('industryController', industryController);

    function industryController($location, $scope, $window, $http, jwtHelper) {

        var vm = this

        //when select valuechanges
        $("#opt").change(function () {

            //if value is startups
            if ($("#opt").val() == "Startups") {

                location.href = "/administrator/101/startup"
            }

            //if value is Investors
            if ($("#opt").val() == "Investors") {

                location.href = "/administrator/101/investor"

            }

            //if value is Industries
            if ($("#opt").val() == "Industries") {

                location.href = "/administrator/101/industry"

            }

            //if value is resources
            if ($("#opt").val() == "resources") {

                location.href = "/administrator/101/resources"

            }
        })

        $("#spin3").hide();

        //when user clicks add
        $(".adbtn").click(function () {

            $(".error1").html("")

            //get the industries title
            var title = $(".title").val()
            title = title.toLowerCase();

            //get the industries subtitle
            var subtitle = $(".subtitle").val()

            //store if the industry is live or not
            var live;

            if (!title) {
                $(".error1").html("please enter the industries title")
                return;
            }

            $(".cp").html("")
            $("#spin3").show();

            if (vm.checked) {
                live = true
            }
            else {
                live = false
            }

            //var to store the subtitles
            var sub = [];

            //remove any spaces
            subtitle.replace(/\s+/g, '');
            //split the subtitle
            var subtitle = subtitle.split(",")

            async function check() {
                for (var i = 0; i < subtitle.length; i++) {

                    var s = subtitle[i]

                    //remove all space at the start of the string
                    while (s.charAt(0) == " ") {
                        s = s.substring(1);
                    }

                    //remove all space at the end of the string
                    while (s.charAt(s.length - 1) == " ") {
                        s = s.substring(0, s.length - 1);
                    }

                    //change to lowercase
                    s = s.toLowerCase()
                    sub.push(s)
                }

            }

            check()

            $http.post("admin/industry", {
                title: title,
                sub: sub,
                live: live,
            })
                .then((res) => {

                    if (res.data == "exists") {
                        $(".error1").html("This industry already exists")
                        $(".cp").html("Add")
                        $("#spin3").hide();
                        return
                    }

                    $()

                    $(".cp").html("Industry added")
                    $("#spin3").hide();

                    setTimeout(function () {
                        location.href = "/administrator/101/industry"
                    }, 1000);
                })

        })

        //route to display all the industries
        $http.post("admin/industry1", {
            title: "none"
        })
            .then((res) => {

                //store the data
                var dat = res.data

                //var to store the industries
                var indus = []

                //var to store the subtitles
                var sub = []

                //loop through the data
                for (var i = 0; i < dat.length; i++) {

                    indus.push("<div class = \"tittle\">" +
                        "<h2 class = \"title1\">" + dat[i].Title + "</h2>" +
                        "</div>")

                    //if there are subtitles
                    if (dat[i].SubTitle.length !== 0) {

                        //loop through the industries subtitle
                        for (var s = 0; s < dat[i].SubTitle.length; s++) {

                            sub.push(
                                "<p class = \"subt2\" >" + dat[i].SubTitle[s] + "</p>")
                        }
                    }

                    indus = indus.join("")
                    sub = sub.join("")

                    var offl;
                    var offl2;

                    if (dat[i].Live == true) {
                        offl = "<p class = \"ofl\"> Live </p>"
                        offl2 = "<input type=\"checkbox\" checked>"
                    }

                    else {
                        offl = "<p class = \"ofl\"> Offline </p>"
                        offl2 = "<input type=\"checkbox\">"
                    }

                    $("<div class = \"in\" >" + indus +
                        "<div class = \"subt\">" + sub +
                        "</div>" +
                        "<!--Rounded switch -->" +
                        "<div class = \"st\">" +
                        "<label class=\"switch\">" +
                        offl2 +
                        "<span class=\"slider round\"></span>" +
                        offl +
                        "</label>" +
                        "</div>" +
                        "<div class = \"dt\">" +
                        "<button class = \"dtbtn\">delete</button>" +
                        "</div>" +
                        "</div>").appendTo(".inal1")
                    indus = []
                    sub = []
                }


                //var to store the title
                var t1
                //when user clicks delete
                $(".dtbtn").click(function () {
                    t1 = $(this).parents("div")[1].children[0].children[0].innerHTML;
                    document.querySelector(".pop-up").style.display = "flex"
                })

                //when user clicks yes
                $(".yes").click(function () {

                    //route to delete industry
                    $http.post("/admin/deleteIndustry", {
                        title: t1,
                        delete: true
                    })
                        .then((res) => {
                            location.href = "/administrator/101/industry"
                        })
                })

                //when user clicks no
                $(".no").click(function () {
                    document.querySelector(".pop-up").style.display = "none"
                    t1 = ""
                    location.href = "/administrator/101/industry"
                })

                $('.slider').click(function () {
                    var checkbox = $(this).parents("div")[0].children[0].children[0];
                    var title = $(this).parents("div")[1].children[0].children[0].innerHTML;
                    var ofl = $(this).parents("div")[0].children[0].children[2]

                    if ($(checkbox).prop('checked')) {
                        $(ofl).html("Offline")

                        //route to put the industry offline
                        $http.post("admin/IndusOffline", {
                            title: title,
                            off: "yes"
                        })
                            .then((res) => {
                            })

                    } else {
                        $(ofl).html("Live")

                        //route to put the industry online
                        $http.post("admin/IndusOffline", {
                            title: title,
                            off: "no"
                        })
                            .then((res) => {
                            })
                    }
                });

            })
    }

}())