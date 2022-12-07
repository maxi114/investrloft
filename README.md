## Name
Investrloft


## Description
InvestrLoft seeks to fill the void between student entrepreneurs and investors. It will provide a centralized platform where students may grow their business by utilizing helpful materials and pitching ideas to investors. It will create opportunities for students to access investors and pitch competitions.


## Installation
To run the application, you will first need to clone it on your machine from github using the following command git clone -b master https://github.com/8000h/csc400.git 

During the development stages of investrloft we utilized a program called Docker. A platform for developing shipping and running applications. In order to run the application, you will first need to install docker on your computer. Use this link to install docker  https://www.docker.com . Once docker is installed, you may be prompted to install WSL 2 Linux kernel. Use the provided link from the pop up to install WSL 2.  

Open the terminal and run docker compose up –build .  This will prompt docker to build the application into containers that will allow our application to run without installing the dependencies. 

Visual studio will prompt you to install the docker dependency, click yes. If you are not prompted to install the dependency, please make sure you install it by navigating to the extensions section, type in docker in the search bar and install it. 

Once you install the docker dependency, stop the server by using ctrl c on windows or  cmd c on mac. Install nodemon using this command npm install -g nodemon . 

Once nodemon is installed, run this command to start the server docker compose up. You may now access the application on localhost:8080  
